const fromEvent = require('graphcool-lib').fromEvent
const bcryptjs = require('bcryptjs')
const validator = require('validator')

const userQuery = `
query UserQuery($email: String!) {
  User(email: $email){
    id
    name
    password
  }
}`

const createUserMutation = `
mutation CreateUserMutation($name: String!, $email: String!, $passwordHash: String!) {
  createUser(
    name: $name,
    email: $email,
    password: $passwordHash
  ) {
    id
  }
}`

const getGraphcoolUser = (api, email) => {
  return api.request(userQuery, { email })
    .then(userQueryResult => {
      if (userQueryResult.error) {
        return Promise.reject(userQueryResult.error)
      } else {
        return userQueryResult.User
      }
    })
}

const createGraphcoolUser = (api, name, email, passwordHash) => {
  return api.request(createUserMutation, { name, email, passwordHash })
    .then(userMutationResult => {
      return userMutationResult.createUser.id
    })
}

module.exports = function(event) {
  if (!event.context.graphcool.pat) {
    console.log('Please provide a valid root token!')
    return { error: 'Email Signup not configured correctly.'}
  }

  // Retrieve payload from event
  const name = event.data.name
  const email = event.data.email
  const password = event.data.password

  // Create Graphcool API (based on https://github.com/graphcool/graphql-request)
  const graphcool = fromEvent(event)
  const api = graphcool.api('simple/v1')

  const SALT_ROUNDS = 10

  if (validator.isEmail(email)) {
    return getGraphcoolUser(api, email)
      .then(graphcoolUser => {
        if (!graphcoolUser) {
          return bcryptjs.hash(password, SALT_ROUNDS)
            .then(hash => createGraphcoolUser(api, name, email, hash))
        } else {
          return Promise.reject('Email already in use')
        }
      })
      .then(graphcoolUserId => {
        return graphcool.generateAuthToken(graphcoolUserId, 'User')
          .then(token => {
            return { data: {id: graphcoolUserId, token}}
        })
      })
      .catch(error => {
        // Log error, but don't expose to caller
        console.log(`Error: ${JSON.stringify(error)}`)
        return { error: 'An unexpected error occured.' }
      })
  } else {
    return { error: 'Not a valid email' }
  }
}
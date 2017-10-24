// Libraries
const fromEvent = require('graphcool-lib').fromEvent

// User query
const userQuery = `
  query UserQuery($userId: ID!) {
    User(id: $userId){
      id
      name
      password
    }
  }
`

// Get user
const getUser = (api, userId) => {
  return api.request(userQuery, { userId })
    .then(userQueryResult => { return userQueryResult.User })
    .catch(error => {
      console.log(`Error: ${JSON.stringify(error)}`)
      return { error: `An unexpected error occured` }
    })
}

module.exports = event => {

  // Check for auth
  if (!event.context.auth || !event.context.auth.nodeId) {
    console.log(`No auth context`)
    return {data: {id: null}}
  }

  // Retrieve payload from event
  const userId = event.context.auth.nodeId
  console.log(`Node ID: ${userId}`)

  // Create Graphcool API
  const graphcool = fromEvent(event)
  const api = graphcool.api('simple/v1')

  // Get user
  return getUser(api, userId)
    .then(emailUser => {
      if (!emailUser) { return { error: `No user with id: ${userId}` } }
      return { data: emailUser }
    })
    .catch(error => {
      console.log(`Error: ${JSON.stringify(error)}`)
      return { error: `An unexpected error occured` }
    })

}
// Libraries
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { gql, graphql, compose } from 'react-apollo'

// Constants
import config from '../config'

// Components
import Header from '../components/Header'

// Join view
class JoinView extends Component {

  // Initial state
  state = {
    name: '',
    email: '',
    password: '',
    isLoading: false,
  }

  // Create user
  createUser = async () => {
    const { name, email, password } = this.state

    // Check for empty fields
    if (name === '' || email === '' || password === '') return console.log('Some fields are empty')

    this.setState({ isLoading: true })

    // Call the createUserMutation
    const response = await this.props.createUser({
      variables: { name, email, password }
    })

    // Save user token to localStorage
    localStorage.setItem(config.graphCool.authToken, response.userQuery.signupUser.token)

    // Back to home
    window.location.assign('/')
  }

  render() {
    const { name, email, password, isLoading } = this.state
    const { userQuery } = this.props

    // Check if still loading
    if (userQuery.loading) { return <div>Loading...</div> }

    // Check if user is already logged in
    if (userQuery.loggedInUser.id) {
      console.warn('Already logged in')
      window.location.assign('/')
    }

    return  ([
      <Header />,
      <form>
        <input
          placeholder='Name'
          value={name}
          onChange={(e) => this.setState({ name: e.target.value })}
          type='text' />

        <input
          placeholder='Email'
          value={email}
          onChange={(e) => this.setState({ email: e.target.value })}
          type='email' />

        <input
          placeholder='Password'
          value={password}
          onChange={(e) => this.setState({ password: e.target.value })}
          type='password' />

        {
          (email && password)
          ? (
              isLoading
              ? <button disabled>Logging in...</button>
              : <button onClick={this.createUser}>Log in</button>
            )
          : <button disabled>Please fill all the fields</button>
        }
      </form>
    ])
  }

}

// Create user
const createUserMutation = gql`
  mutation ($name: String!, $email: String!, $password: String!) {
    signupUser(
      name: $name,
      email: $email,
      password: $password
    ) {
      id
      token
    }
  }
`

// Get current user
const userQuery = gql`
  query {
    loggedInUser {
      id
    }
  }
`

export default compose(
  graphql(createUserMutation, { name: 'createUser' }),
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } })
) (withRouter(JoinView))
// Libraries
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { gql, graphql, compose } from 'react-apollo'

// Constants
import config from '../config'

// Components
import Header from '../components/Header'

// Login view
class LoginView extends Component {

  // Initial state
  state = {
    email: '',
    password: '',
    isLoading: false
  }

  // Sign user in
  signinUser = async () => {
    const { email, password } = this.state

    // Check for empty fields
    if (email === '' || password === '') return console.log('Some fields are empty')

    // Set the loading state
    this.setState({ isLoading: true })

    // Call the signinUserMutation
    const response = await this.props.signinUser({
      variables: { email, password }
    })

    // Save user token to localStorage
    localStorage.setItem(config.graphCool.authToken, response.data.authenticateUser.token)

    // Back to home
    window.location.assign('/')
  }

  render() {
    const { email, password, isLoading } = this.state
    const { data, router } = this.props

    // Check if still loading
    if (data.loading) { return <div>Loading...</div> }

    // Check if user is already logged in
    if (data.loggedInUser.id) {
      console.warn('Already logged in')
      router.replace('/')
    }

    return  ([
      <Header/>,
      <div>
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
              : <button onClick={this.signinUser}>Log in</button>
            )
          : <button disabled>Please fill all the fields</button>
        }
      </div>
    ])
  }

}

// Sign in user
const signinUserMutation = gql`
  mutation ($email: String!, $password: String!) {
    authenticateUser(
      email: $email,
      password: $password
    ) {
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
  graphql(signinUserMutation, { name: 'signinUser' }),
  graphql(userQuery, { options: { fetchPolicy: 'network-only' } })
) (withRouter(LoginView))
// Libraries
import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'

// Components
import Header from '../components/Header'

// New exercise view
class NewExerciseView extends Component {

  // Initial state
  state = {
    name: ''
  }

  // Create a new exercise
  createExercise = async (e) => {
    e.preventDefault()

    // Check if user is logged in
    if (!this.props.userQuery.loggedInUser) {
      console.warn('Only logged in users can create new exercises')
      return
    }

    const { name } = this.state
    let response = await this.props.createExerciseMutation({ variables: { name } })

    window.location.assign(`/exercises/${response.createExerciseMutation.createExercise.id}`)
  }

  render() {
    if (this.props.userQuery.loading) return <div>Loading...</div>

    return ([
      <Header user={ this.props.userQuery.loggedInUser.id ? this.props.userQuery.loggedInUser.name : null } />,
      <form>
        <input
          placeholder='Name'
          value={this.state.name}
          onChange={(e) => this.setState({ name: e.target.value })}
          type='text' />

        <button onClick={(e) => this.createExercise(e)}>New exercise</button>
      </form>
    ])
  }

}

// Create workout mutation
const createExerciseMutation = gql`
  mutation($name: String!) {
    createExercise(
      name: $name
    ) {
      id
    }
  }
`

// Get current user
const userQuery = gql`
  query {
    loggedInUser {
      id
      name
    }
  }
`

export default compose(
  graphql(createExerciseMutation, { name: 'createExerciseMutation' }),
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } })
) (NewExerciseView)
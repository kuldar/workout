// Libraries
import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'

// New workout view
class NewWorkoutView extends Component {

  // Initial state
  state = {
    name: ''
  }

  // Create a new workout
  createWorkout = async (e) => {
    e.preventDefault()

    // Check if user is logged in
    if (!this.props.userQuery.loggedInUser) {
      console.warn('Only logged in users can create new posts')
      return
    }

    const { name } = this.state
    const userId = this.props.userQuery.loggedInUser.id

    let response = await this.props.createWorkoutMutation({ variables: { name, userId } })

    // this.props.history.push(`/workouts/${response.createWorkoutMutation.createWorkout.id}`)
    window.location.assign(`/workouts/${response.createWorkoutMutation.createWorkout.id}`)
  }

  render() {
    if (this.props.userQuery.loading) return <div>Loading...</div>

    return (
      <form>
        <input
          placeholder='Name'
          value={this.state.name}
          onChange={(e) => this.setState({ name: e.target.value })}
          type='text' />

        <button onClick={(e) => this.createWorkout(e)}>New workout</button>
      </form>
    )
  }

}

// Create workout mutation
const createWorkoutMutation = gql`
  mutation($name: String! $userId: ID!) {
    createWorkout(
      name: $name,
      userId: $userId
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
  graphql(createWorkoutMutation, { name: 'createWorkoutMutation' }),
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } })
) (NewWorkoutView)
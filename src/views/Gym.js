// Libraries
import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'
import moment from 'moment'

// Gym view
class GymView extends Component {

  // Create new workout session
  createWorkoutSession = async (e, workoutId) => {
    e.preventDefault()
    let response = await this.props.createSessionMutation({ variables: { workoutId } })
    this.props.history.push(`/gym/${response.data.createSession.id}`)
  }

  render() {
    const { userQuery, userWorkoutsQuery } = this.props

    // Check if loading
    if (userQuery.loading || userWorkoutsQuery.loading) return <div>Loading...</div>

    const user = userQuery.loggedInUser
    const workouts = userWorkoutsQuery.allWorkouts

    return (
      <div>
        <strong>Select a workout</strong>
        { workouts && workouts.map(workout => (
          <button onClick={(e) => this.createWorkoutSession(e, workout.id)}>
            {workout.name}
          </button>
        ))}
      </div>
    )
  }

}

// Create session mutation
const createSessionMutation = gql`
  mutation CreateSessionMutation($workoutId: ID!) {
    createSession(workoutId: $workoutId) {
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

// Get current user workouts
const userWorkoutsQuery = gql`
  query {
    allWorkouts {
      id
      name
    }
  }
`

export default compose(
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } }),
  graphql(userWorkoutsQuery, { name: 'userWorkoutsQuery' }),
  graphql(createSessionMutation, { name: 'createSessionMutation' })
)(GymView)
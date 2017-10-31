// Libraries
import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'
import moment from 'moment'

// Components
import Header from '../components/Header'

// Styles
const wrapper = {
  maxWidth: '60rem',
  margin: '0 auto',
  padding: '0 1rem'
}

// Gym view
class GymView extends Component {

  // Create new workout session
  createWorkoutSession = async (e, workoutId) => {
    e.preventDefault()
    const userId = this.props.userQuery.loggedInUser.id
    let response = await this.props.createSessionMutation({ variables: { workoutId, userId } })
    window.location.assign(`/gym/${response.data.createSession.id}`)
  }

  render() {
    const { userQuery, userWorkoutsQuery } = this.props

    // Check if loading
    if (userQuery.loading || userWorkoutsQuery.loading) return <div>Loading...</div>

    const user = userQuery.loggedInUser
    const workouts = userWorkoutsQuery.allWorkouts

    return ([
      <Header user={ user.id && user } />,
      <div style={wrapper}>
        <h2>👇  Select a workout</h2>
        <hr/>
        <ul>
          {
            workouts && workouts.map(workout => (
              <li>
                <a href='#' onClick={(e) => this.createWorkoutSession(e, workout.id)}>
                  Start <strong>{workout.name}</strong> session
                </a>
              </li>
            ))
          }
        </ul>
      </div>
    ])
  }

}

// Create session mutation
const createSessionMutation = gql`
  mutation CreateSessionMutation($workoutId: ID!, $userId: ID!) {
    createSession(
      workoutId: $workoutId
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
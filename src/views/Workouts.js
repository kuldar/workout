// Libraries
import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'

// Components
import Header from '../components/Header'

// Workouts view
class WorkoutsView extends Component {

  render() {
    const { userQuery, allWorkoutsQuery } = this.props

    // Check if still loading
    if (userQuery.loading || allWorkoutsQuery.loading) { return <div>Loading...</div> }

    return ([
      <Header user={ userQuery.loggedInUser.id ? userQuery.loggedInUser : null } />,
      <div>
        <h2>Workouts</h2>
        {
          allWorkoutsQuery.allWorkouts.map(workout => (
            <div>
              <a href={`/workouts/${workout.id}`}><strong>{workout.name}</strong></a> -
              { workout.exercises.map(exercise => <span> {exercise.name}</span>) }
            </div>
          ))
        }
      </div>
    ])
  }

}

// All workouts
const allWorkoutsQuery = gql`
  query {
    allWorkouts(orderBy: createdAt_DESC) {
      id
      name
      exercises {
        name
      }
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
  graphql(allWorkoutsQuery, { name: 'allWorkoutsQuery' }),
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } })
) (WorkoutsView)
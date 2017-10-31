// Libraries
import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'

// Components
import Header from '../components/Header'

// Styles
const wrapper = {
  maxWidth: '60rem',
  margin: '0 auto',
  padding: '0 1rem'
}

// Workouts view
class WorkoutsView extends Component {

  render() {
    const { allWorkoutsQuery, userQuery } = this.props

    if (allWorkoutsQuery.loading || userQuery.loading) return <div>Loading...</div>
    const workouts = allWorkoutsQuery.allWorkouts
    const user = userQuery.loggedInUser

    return ([
      <Header user={ user.id && user } />,
      <div style={wrapper}>
        <h2>💪  Workouts</h2>
        <hr />
        <a href='/workouts/new'>New workout</a>
        <div>
          <ul>
            { workouts.map(workout => <li><a href={`/workouts/${workout.id}`}>{workout.name}</a></li>) }
          </ul>
        </div>
      </div>
    ])
  }

}

// Workouts query
const allWorkoutsQuery = gql`
  query allWorkoutsQuery {
    allWorkouts(orderBy: createdAt_DESC) {
      id
      name
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
)(WorkoutsView)
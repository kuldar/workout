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

// Exercise view
class ExerciseView extends Component {

  render() {
    const { exerciseQuery, userQuery } = this.props

    if (exerciseQuery.loading || userQuery.loading) return <div>Loading...</div>
    const exercise = exerciseQuery.Exercise
    const user = userQuery.loggedInUser

    return ([
      <Header user={ user.id ? user.name : null } />,
      <div style={wrapper}>
        <h2>{exercise.name}</h2>
        <div>
          <p>{exercise.description}</p>
        </div>
        <hr />
        <div>
          <h3>💪  Workouts:</h3>
          <ul>
            { exercise.workouts.map(workout => <li><a href={`/workouts/${workout.id}`}>{workout.name}</a></li>) }
          </ul>
        </div>
      </div>
    ])
  }

}

// Current exercise query
const exerciseQuery = gql`
  query exerciseQuery($id: ID!) {
    Exercise(id: $id) {
      id
      name
      description
      workouts {
        id
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
  graphql(exerciseQuery, { name: 'exerciseQuery', options: ({ match }) => ({ variables: { id: match.params.id }}) }),
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } })
)(ExerciseView)
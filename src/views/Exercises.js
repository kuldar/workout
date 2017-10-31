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

// Exercises view
class ExercisesView extends Component {

  render() {
    const { allExercisesQuery, userQuery } = this.props

    if (allExercisesQuery.loading || userQuery.loading) return <div>Loading...</div>
    const exercises = allExercisesQuery.allExercises
    const user = userQuery.loggedInUser

    return ([
      <Header user={ user.id && user } />,
      <div style={wrapper}>
        <h2>🏋️   Exercises</h2>
        <hr />
        <a href='/exercises/new'>New exercise</a>
        <div>
          <ul>
            { exercises.map(exercise => <li><a href={`/exercises/${exercise.id}`}>{exercise.name}</a></li>) }
          </ul>
        </div>
      </div>
    ])
  }

}

// Exercises query
const allExercisesQuery = gql`
  query allExercisesQuery {
    allExercises(orderBy: createdAt_DESC) {
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
  graphql(allExercisesQuery, { name: 'allExercisesQuery' }),
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } })
)(ExercisesView)
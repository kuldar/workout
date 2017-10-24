// Libraries
import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'
import moment from 'moment'

// Components
import Header from '../components/Header'

// Session view
class SessionView extends Component {

  render() {
    const { sessionQuery, sessionExercisesQuery, userQuery } = this.props
    if (sessionQuery.loading || userQuery.loading) return <div>Loading...</div>

    const session = sessionQuery.Session
    const user = userQuery.loggedInUser

    return ([
      <Header user={ user.id ? user.name : null } />,
      <div>
        <div><strong>Workout:</strong> <a href={`/workouts/${session.workout.id}`}>{session.workout.name}</a></div>
        <div><strong>Date:</strong> {moment(session.createdAt).calendar()}</div>
        <div>
          <strong>Sets:</strong>
          {
            session.sets.map(set => (
              <div>
                {set.exercise.name} - (
                  { set.reps && `${set.reps} reps ` }
                  { set.weight && `${set.weight} kg ` }
                  { set.time && `${set.time} min` }
                )
              </div>
            ))
          }
        </div>
      </div>
    ])
  }

}

// Current session query
const sessionQuery = gql`
  query sessionQuery($id: ID!) {
    Session(id: $id) {
      id
      createdAt
      workout {
        id
        name
      }
      sets {
        id
        reps
        weight
        time
        exercise {
          id
          name
        }
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
  graphql(sessionQuery, { name: 'sessionQuery', options: ({ match }) => ({ variables: { id: match.params.id }}) }),
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } })
)(SessionView)
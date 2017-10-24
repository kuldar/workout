// Libraries
import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'
import moment from 'moment'

// Components
import Header from '../components/Header'

// Workout view
class WorkoutView extends Component {

  // Handle creating a new set
  handleCreateSession = async (e) => {
    e.preventDefault()

    let session = await this.props.createSessionMutation({ variables: { workoutId: this.props.workoutQuery.Workout.id } })

    this.props.history.push(`/sessions/${session.data.createSession.id}`)
  }

  render() {
    const { workoutQuery, userQuery } = this.props

    if (workoutQuery.loading || userQuery.loading) return <div>Loading...</div>
    const workout = workoutQuery.Workout
    const user = userQuery.loggedInUser

    return ([
      <Header user={ user.id ? user.name : null } />,
      <div>
        <h2>{workout.name}</h2>
        <button onClick={(e) => this.handleCreateSession(e)}>New session</button>
        <br/><br/>
        <div>
          <strong>Exercises:</strong>
          { workout.exercises.map(exercise => <div>{exercise.name}</div>) }
        </div>
        <br/>
        <div>
          <strong>Sessions:</strong>
          { workout.sessions.map(session => <div><a href={`/sessions/${session.id}`}>{moment(session.createdAt).calendar()}</a></div>) }
        </div>
      </div>
    ])
  }

}

// Current workout query
const workoutQuery = gql`
  query workoutQuery($id: ID!) {
    Workout(id: $id) {
      id
      name
      sessions {
        id
        createdAt
      }
      exercises {
        id
        name
        sets {
          id
          reps
          weight
          time
        }
      }
    }
  }
`

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

export default compose(
  graphql(workoutQuery, { name: 'workoutQuery', options: ({ match }) => ({ variables: { id: match.params.id }}) }),
  graphql(createSessionMutation, { name: 'createSessionMutation' }),
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } })
)(WorkoutView)
// Libraries
import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'
import moment from 'moment'

// Session view
class WorkoutView extends Component {

  // Handle creating a new set
  handleCreateSession = async (e) => {
    e.preventDefault()

    let session = await this.props.createSessionMutation({ variables: { workoutId: this.props.workoutQuery.Workout.id } })

    this.props.history.push(`/sessions/${session.data.createSession.id}`)
  }

  render() {
    if (this.props.workoutQuery.loading) return <div>Loading...</div>
    const { id, name, exercises, sessions } = this.props.workoutQuery.Workout

    return (
      <div>
        <h1>{name}</h1>
        <button onClick={(e) => this.handleCreateSession(e)}>New session</button>
        <br/><br/>
        <div>
          <strong>Exercises:</strong>
          { exercises.map(exercise => <div>{exercise.name}</div>) }
        </div>
        <br/>
        <div>
          <strong>Sessions:</strong>
          { sessions.map(session => <div><a href={`/sessions/${session.id}`}>{moment(session.createdAt).calendar()}</a></div>) }
        </div>
      </div>
    )
  }

}

// Current workout query
const WORKOUT_QUERY = gql`
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
const CREATE_SESSION_MUTATION = gql`
  mutation CreateSessionMutation($workoutId: ID!) {
    createSession(workoutId: $workoutId) {
      id
    }
  }
`

export default compose(
  graphql(WORKOUT_QUERY, { name: 'workoutQuery', options: ({ match }) => ({ variables: { id: match.params.id }}) }),
  graphql(CREATE_SESSION_MUTATION, { name: 'createSessionMutation' })
)(WorkoutView)
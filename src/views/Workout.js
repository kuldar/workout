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
      <Header user={ user.id && user } />,
      <div style={wrapper}>
        <h2>{workout.name}</h2>
        <div>
          <p>{workout.description}</p>
        </div>
        <hr />
        <div>
          <h3>🏋️  Exercises:</h3>
          <ul>
            { workout.exercises.map(exercise => <li><a href={`/exercises/${exercise.id}`}>{exercise.name}</a></li>) }
          </ul>
        </div>
        <br/>
        <div>
          <h3>📆  Sessions:</h3>
          <ul>
            { workout.sessions.map(session => <li><a href={`/sessions/${session.id}`}>{moment(session.createdAt).calendar()}</a></li>) }
          </ul>
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
      description
      sessions {
        id
        createdAt
      }
      exercises {
        id
        name
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
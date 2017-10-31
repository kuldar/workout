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

// Gym session view
class GymSessionView extends Component {

  state = {
    reps: '',
    time: '',
    weight: '',
    distance: '',
    exerciseId: ''
  }

  // Handle creating a new set
  handleCreateSet = async () => {

    // Create set
    const variables = {
      reps: parseInt(this.state.reps),
      time: parseInt(this.state.time),
      weight: parseInt(this.state.weight),
      distance: parseInt(this.state.distance),
      exerciseId: this.state.exerciseId,
      sessionId: this.props.sessionQuery.Session.id
    }

    await this.props.createSetMutation({ variables })
    this.props.sessionQuery.refetch()
  }

  handleFinishSession = async () => {
    // TODO
  }

  render() {
    const { sessionQuery, userQuery } = this.props
    const { reps, time, weight, distance, exerciseId } = this.state

    // Check if loading
    if (sessionQuery.loading || userQuery.loading) return <div>Loading...</div>

    const { id, sets, workout } = this.props.sessionQuery.Session
    const user = userQuery.loggedInUser

    return ([
      <Header user={ user.id && user } />,
      <div style={wrapper}>
        <h2>New session of {workout.name}</h2>
        <hr/>
        <br/>
        <div>
          <select onChange={(e) => this.setState({ exerciseId: e.target.value })}>
            <option value=''>Pick an exercise</option>
            { workout.exercises.map(exercise => <option value={exercise.id}>{exercise.name}</option>) }
          </select>
        </div>
        <br/>
        <div>
          <input
            placeholder='Reps'
            value={reps}
            onChange={(e) => this.setState({ reps: e.target.value })}
            type='number' />
        </div>
        <br/>
        <div>
          <input
            placeholder='Weight'
            value={weight}
            onChange={(e) => this.setState({ weight: e.target.value })}
            type='number' />
        </div>
        <br/>
        <div>
          <input
            placeholder='Time'
            value={time}
            onChange={(e) => this.setState({ time: e.target.value })}
            type='number' />
        </div>
        <br/>
        <div>
          <input
            placeholder='Distance'
            value={distance}
            onChange={(e) => this.setState({ distance: e.target.value })}
            type='number' />
        </div>
        <br/>
        <button onClick={this.handleCreateSet}>Add set</button>
        <br/>
        <hr/>
        <br/>
        <ul>
          { sets.map(set => (
            <li>
              <strong>{set.exercise.name}</strong>
              <div>
                {set.reps && <div>{`${set.reps} reps`}</div>}
                {set.weight && <div>{`${set.weight} kg`}</div>}
                {set.time && <div>{`${set.time} minutes`}</div>}
                {set.distance && <div>{`${set.distance} meters`}</div>}
              </div>
            </li>
          )) }
        </ul>
      </div>
    ])
  }

}

// Current session query
const sessionQuery = gql`
  query sessionQuery($id: ID!) {
    Session(id: $id) {
      id
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
      workout {
        id
        name
        exercises {
          id
          name
        }
      }
    }
  }
`

// Create set mutation
const createSetMutation = gql`
  mutation CreateSetMutation(
    $reps: Int,
    $weight: Int,
    $time: Int,
    $exerciseId: ID!,
    $sessionId: ID!
  ) {
    createSet(
      reps: $reps,
      weight: $weight,
      time: $time,
      exerciseId: $exerciseId,
      sessionId: $sessionId
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

export default compose(
  graphql(sessionQuery, { name: 'sessionQuery', options: ({ match }) => ({ variables: { id: match.params.id }}) }),
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } }),
  graphql(createSetMutation, { name: 'createSetMutation' })
)(GymSessionView)
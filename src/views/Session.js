// Libraries
import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'

// Session view
class SessionView extends Component {

  state = {
    reps: '',
    weight: '',
    time: '',
    exerciseId: ''
  }

  // Handle creating a new set
  handleCreateSet = async () => {

    // Create set
    const variables = {
      reps: parseInt(this.state.reps),
      weight: parseInt(this.state.weight),
      time: parseInt(this.state.time),
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
    if (this.props.sessionQuery.loading) return <div>Loading...</div>
    const { id, sets, workout } = this.props.sessionQuery.Session

    return (
      <div>
        <h1>
          <a href={`/workouts/${workout.id}`}>{workout.name}</a>
        </h1>
        <div>
          <select onChange={(e) => this.setState({ exerciseId: e.target.value })}>
            <option value=''>Pick an exercise</option>
            { workout.exercises.map(exercise => <option value={exercise.id}>{exercise.name}</option>) }
          </select>
        </div>

        <div>
          <input
            placeholder='Reps'
            value={this.state.reps}
            onChange={(e) => this.setState({ reps: e.target.value })}
            type='number' />
        </div>
        <div>
          <input
            placeholder='Weight'
            value={this.state.weight}
            onChange={(e) => this.setState({ weight: e.target.value })}
            type='number' />
        </div>
        <div>
          <input
            placeholder='Time'
            value={this.state.time}
            onChange={(e) => this.setState({ time: e.target.value })}
            type='number' />
        </div>
        <button onClick={this.handleCreateSet}>Add set</button>
        <hr/>
        <div>
          { sets.map(set => (
            <div>
              <strong>{set.exercise.name}</strong> ({set.reps} reps, {set.weight} weight, {set.time} time)
            </div>
          )) }
        </div>
      </div>
    )
  }

}

// Current session query
const SESSION_QUERY = gql`
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
const CREATE_SET_MUTATION = gql`
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

export default compose(
  graphql(SESSION_QUERY, { name: 'sessionQuery', options: ({ match }) => ({ variables: { id: match.params.id }}) }),
  graphql(CREATE_SET_MUTATION, { name: 'createSetMutation' })
)(SessionView)
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

// New workout view
class NewWorkoutView extends Component {

  // Initial state
  state = {
    name: '',
    description: '',
    exercisesIds: []
  }

  // Handle adding/removing exercise
  handleExerciseChange = () => {

    // Get exercises as an array
    const exercises = this.form.exercise
    const exercisesArray = Array.prototype.slice.call(exercises)

    // Get relatd exercises
    const addedExercisesArray = exercisesArray.filter(input => input.checked)
    const addedExercisesIds = addedExercisesArray.map(input => input.value)

    // Update the state with related exercises
    this.setState({ exercisesIds: addedExercisesIds })

  }

  // Create a new workout
  createWorkout = async (e) => {
    e.preventDefault()

    // Check if user is logged in
    if (!this.props.userQuery.loggedInUser) {
      console.warn('Only logged in users can create new posts')
      return
    }

    const { name, description, exercisesIds } = this.state
    const userId = this.props.userQuery.loggedInUser.id

    let response = await this.props.createWorkoutMutation({ variables: { name, description, exercisesIds, userId } })

    window.location.assign(`/workouts/${response.data.createWorkout.id}`)
  }

  render() {
    const { exercisesQuery, userQuery } = this.props
    const { name, description } = this.state

    // Check if loading
    if (exercisesQuery.loading || userQuery.loading) return <div>Loading...</div>
    const user = userQuery.loggedInUser

    return ([
      <Header user={ user.id && user } />,
      <div style={wrapper}>
        <h2>New workout</h2>
        <hr/>
        <br/>
        <form ref={form => this.form = form}>
          <div>
            <input
              placeholder='Name'
              value={name}
              onChange={(e) => this.setState({ name: e.target.value })}
              type='text' />
          </div>
          <br/>
          <div>
            <textarea
              placeholder='Description'
              value={description}
              onChange={(e) => this.setState({ description: e.target.value })}>
            </textarea>
          </div>
          <br/>
          <div>
            {exercisesQuery.allExercises.map((exercise, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  value={exercise.id}
                  id={exercise.id}
                  name="exercise"
                  onChange={() => this.handleExerciseChange()} />
                <label htmlFor={exercise.id}>{exercise.name}</label>
              </div>
            ))}
          </div>
          <br/>
          <button onClick={(e) => this.createWorkout(e)}>New Workout</button>
        </form>
      </div>
    ])
  }

}

// Create workout mutation
const createWorkoutMutation = gql`
  mutation($name: String!, $description: String!, $exercisesIds: [ID!], $userId: ID!) {
    createWorkout(
      name: $name,
      description: $description,
      exercisesIds: $exercisesIds,
      userId: $userId
    ) {
      id
    }
  }
`

// Exercises query
const exercisesQuery = gql`
  query exercisesQuery {
    allExercises {
      id
      name
      description
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
  graphql(createWorkoutMutation, { name: 'createWorkoutMutation' }),
  graphql(exercisesQuery, { name: "exercisesQuery" }),
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } })
) (NewWorkoutView)
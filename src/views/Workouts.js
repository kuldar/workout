// Libraries
import React, { Component } from 'react'
import { graphql, gql } from 'react-apollo'

// Workouts view
class WorkoutsView extends Component {

  render() {

    let query = this.props.allWorkoutsQuery
    if (query && query.loading) { return <div>Loading...</div> }
    const workouts = this.props.allWorkoutsQuery.allWorkouts

    return (
      <div>
        <h1>Workouts</h1>
        { workouts.map(workout => (
          <div>
            <a href={`/workouts/${workout.id}`}><strong>{workout.name}</strong></a> -
            { workout.exercises.map(exercise => <span> {exercise.name}</span>) }
          </div>
        )) }
      </div>
    )
  }

}

const ALL_WORKOUTS_QUERY = gql`
  query AllWorkoutsQuery {
    allWorkouts {
      id
      name
      exercises {
        name
      }
    }
  }
`

export default graphql(ALL_WORKOUTS_QUERY, {name: 'allWorkoutsQuery'}) (WorkoutsView)
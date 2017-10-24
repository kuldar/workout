// Libraries
import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

// Auth
import JoinView from './views/Join'
import LoginView from './views/Login'

// Overview
import OverviewView from './views/Overview'

// Gym
import GymView from './views/Gym'
import GymSessionView from './views/GymSession'

// Members
// import MembersView from './views/Members'
import MemberView from './views/Member'

// Exercises
import ExercisesView from './views/Exercises'
import ExerciseView from './views/Exercise'
import NewExerciseView from './views/NewExercise'

// Workouts
import WorkoutsView from './views/Workouts'
import WorkoutView from './views/Workout'
import NewWorkoutView from './views/NewWorkout'

// Session
import SessionView from './views/Session'
import SessionsView from './views/Sessions'

// App
class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={WorkoutsView} />
          <Route exact path='/join' component={JoinView} />
          <Route exact path='/login' component={LoginView} />

          <Route exact path='/overview' component={OverviewView} />

          <Route exact path='/members/:id' component={MemberView} />

          <Route exact path='/gym' component={GymView} />
          <Route exact path='/gym/:id' component={GymSessionView} />

          <Route exact path='/exercises' component={ExercisesView} />
          <Route exact path='/exercises/new' component={NewExerciseView} />
          <Route exact path='/exercises/:id' component={ExerciseView} />

          <Route exact path='/workouts' component={WorkoutsView} />
          <Route exact path='/workouts/new' component={NewWorkoutView} />
          <Route exact path='/workouts/:id' component={WorkoutView} />

          <Route exact path='/sessions' component={SessionsView} />
          <Route exact path='/sessions/:id' component={SessionView} />
        </Switch>
      </div>
    )
  }
}

export default App

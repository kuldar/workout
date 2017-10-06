// Libraries
import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

// Components
import Header from './components/Header'

// Views
import WorkoutsView from './views/Workouts'
import WorkoutView from './views/Workout'
import SessionView from './views/Session'

// App
class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={WorkoutsView} />
          <Route exact path='/workouts' component={WorkoutsView} />
          <Route exact path='/workouts/:id' component={WorkoutView} />
          <Route exact path='/sessions/:id' component={SessionView} />
        </Switch>
      </div>
    )
  }
}

export default App

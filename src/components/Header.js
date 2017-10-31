// Libraries
import React from 'react'

// Constants
import config from '../config'

// Styles
const header = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '1rem 2rem'
}

const headerTitle = {
  margin: '0'
}

const headerNavLink = {
  margin: '0 0 0 1rem'
}

// Header
const Header = ({ user }) => {

  // Handle logging out
  const handleLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem(config.graphCool.authToken)
    window.location.assign('/')
  }

  return (
    <div style={header}>
      <div style={headerTitle}>
        {
          user
          ? <span>Hello, <a href={`/members/${user.id}`}>{user.name}</a></span>
          : <a href={`/`}>Workout.wtf</a>
        }
      </div>
      <nav>
        {
          user
          ? [
              <a href='/overview' style={headerNavLink}>Overview</a>,
              <a href='/gym' style={headerNavLink}>Hit the gym</a>,
              <a href='/workouts' style={headerNavLink}>Workouts</a>,
              <a href='/exercises' style={headerNavLink}>Exercises</a>,
              <a href='/sessions' style={headerNavLink}>Sessions</a>,
              <a onClick={(e) => handleLogout(e)} href='#' style={headerNavLink}>Logout</a>
            ]
          : [
              <a href='/join' style={headerNavLink}>Join</a>,
              <a href='/login' style={headerNavLink}>Login</a>
            ]
        }
      </nav>
    </div>
  )
}

export default Header
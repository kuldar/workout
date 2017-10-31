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

// Sessions view
class SessionsView extends Component {

  render() {
    const { allSessionsQuery, userQuery } = this.props

    if (allSessionsQuery.loading || userQuery.loading) return <div>Loading...</div>
    const sessions = allSessionsQuery.allSessions
    const user = userQuery.loggedInUser

    return ([
      <Header user={ user.id && user } />,
      <div style={wrapper}>
        <h2>Sessions</h2>
        <hr />
        <div>
          <h3>📆 Sessions:</h3>
          <ul>
            { sessions.map(session => <li><a href={`/sessions/${session.id}`}>{session.createdAt}</a></li>) }
          </ul>
        </div>
      </div>
    ])
  }

}

// Sessions query
const allSessionsQuery = gql`
  query allSessionsQuery {
    allSessions(orderBy: createdAt_DESC) {
      id
      createdAt
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
  graphql(allSessionsQuery, { name: 'allSessionsQuery' }),
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } })
)(SessionsView)
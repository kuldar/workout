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

// Overview view
class OverviewView extends Component {

  render() {
    const { userQuery } = this.props

    if (userQuery.loading) return <div>Loading...</div>
    const user = userQuery.loggedInUser

    return ([
      <Header user={ user.id && user } />,
      <div style={wrapper}>
        <h2>Overview</h2>
      </div>
    ])
  }
}

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
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } })
)(OverviewView)
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

// New exercise view
class NewExerciseView extends Component {

  // Initial state
  state = {
    name: '',
    description: ''
  }

  // Create a new exercise
  createExercise = async (e) => {
    e.preventDefault()

    // Check if user is logged in
    if (!this.props.userQuery.loggedInUser) {
      console.warn('Only logged in users can create new exercises')
      return
    }

    const { name, description } = this.state
    let response = await this.props.createExerciseMutation({ variables: { name, description } })

    window.location.assign(`/exercises/${response.data.createExercise.id}`)
  }

  render() {
    const { userQuery } = this.props
    if (userQuery.loading) return <div>Loading...</div>
    const user = userQuery.loggedInUser

    return ([
      <Header user={ user.id && user } />,
      <div style={wrapper}>
        <h2>New exercise</h2>
        <hr/>
        <br/>
        <form>
          <div>
            <input
              placeholder='Name'
              value={this.state.name}
              onChange={(e) => this.setState({ name: e.target.value })}
              type='text' />
          </div>
          <br/>
          <div>
            <textarea
              placeholder='Description'
              value={this.state.description}
              onChange={(e) => this.setState({ description: e.target.value })}>
            </textarea>
          </div>
          <br/>
          <button onClick={(e) => this.createExercise(e)}>Create exercise</button>
        </form>
      </div>
    ])
  }

}

// Create workout mutation
const createExerciseMutation = gql`
  mutation($name: String!, $description: String!) {
    createExercise(
      name: $name,
      description: $description
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
  graphql(createExerciseMutation, { name: 'createExerciseMutation' }),
  graphql(userQuery, { name: 'userQuery', options: { fetchPolicy: 'network-only' } })
) (NewExerciseView)
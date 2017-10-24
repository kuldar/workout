// Libraries
import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './lib/registerServiceWorker'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'

// Config
import config from './config'

// Components
import App from './App'

// Initialize network interface
const networkInterface = createNetworkInterface({ uri: config.graphCool.simpleApi })

// Add auth token to network calls
networkInterface.use([{
  applyMiddleware(req, next) {

    // Set empty headers if none exist
    if (!req.options.headers) { req.options.headers = {} }

    // Add the user auth token to headers if exists
    const token = localStorage.getItem(config.graphCool.authToken)
    req.options.headers.authorization = token ? `Bearer ${token}` : null

    next()
  }
}])

// Initialize new Apollo client
const client = new ApolloClient({ networkInterface })

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
  , document.getElementById('root')
)

registerServiceWorker()
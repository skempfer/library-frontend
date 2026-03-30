import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import App from './App.jsx'

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URI ?? 'http://localhost:4000/graphql',
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
})

const rootElement = document.getElementById('root')

window.addEventListener('error', (event) => {
  if (rootElement) {
    rootElement.textContent = `frontend runtime error: ${event.message}`
  }
})

window.addEventListener('unhandledrejection', (event) => {
  if (rootElement) {
    rootElement.textContent = `frontend promise error: ${event.reason}`
  }
})

createRoot(rootElement).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
)

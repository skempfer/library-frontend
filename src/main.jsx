import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import App from './App.jsx'

const endpointFromEnv = import.meta.env.VITE_GRAPHQL_URI
const defaultEndpoints = ['http://localhost:4000/', 'http://localhost:4001/']

const probeGraphqlEndpoint = async (uri) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 800)

  try {
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'query { __typename }' }),
      signal: controller.signal,
    })

    return response.ok
  } catch {
    return false
  } finally {
    clearTimeout(timeoutId)
  }
}

const resolveGraphqlUri = async () => {
  if (endpointFromEnv) {
    return endpointFromEnv
  }

  for (const uri of defaultEndpoints) {
    const isAvailable = await probeGraphqlEndpoint(uri)
    if (isAvailable) {
      return uri
    }
  }

  return defaultEndpoints[1]
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('root element not found')
}

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

const root = createRoot(rootElement)

resolveGraphqlUri().then((uri) => {
  const client = new ApolloClient({
    link: new HttpLink({ uri }),
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

  root.render(
    <StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </StrictMode>
  )
})

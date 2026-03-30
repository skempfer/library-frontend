import { useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const client = useApolloClient()
  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)

  if (authorsResult.loading || booksResult.loading) {
    return <div>loading data from GraphQL server...</div>
  }

  if (authorsResult.error || booksResult.error) {
    return <div>could not connect to GraphQL server (http://localhost:4000/graphql)</div>
  }

  const authors = authorsResult.data?.allAuthors ?? []
  const books = booksResult.data?.allBooks ?? []

  const logout = async () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    await client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} authors={authors} canEdit={Boolean(token)} />

      <Books show={page === 'books'} books={books} />

      <NewBook show={page === 'add' && Boolean(token)} />

      <LoginForm show={page === 'login' && !token} setToken={setToken} setPage={setPage} />
    </div>
  )
}

export default App

import { useState } from 'react'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Recommended from './components/Recommended'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const client = useApolloClient()

  const updateBooksCache = (queryVariables, addedBook) => {
    client.cache.updateQuery(
      {
        query: ALL_BOOKS,
        variables: queryVariables,
      },
      (data) => {
        if (!data?.allBooks) {
          return data
        }

        const alreadyInCache = data.allBooks.some((book) => book.id === addedBook.id)
        if (alreadyInCache) {
          return data
        }

        return {
          ...data,
          allBooks: data.allBooks.concat(addedBook),
        }
      }
    )
  }

  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data?.bookAdded

      if (addedBook) {
        updateBooksCache({}, addedBook)
        updateBooksCache({ genre: null }, addedBook)
        addedBook.genres.forEach((genre) => {
          updateBooksCache({ genre }, addedBook)
        })

        window.alert(`new book added: ${addedBook.title}`)
      }
    },
  })

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
            <button onClick={() => setPage('recommended')}>recommended</button>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} authors={authors} canEdit={Boolean(token)} />

      <Books show={page === 'books'} books={books} />

      <Recommended show={page === 'recommended' && Boolean(token)} />

      <NewBook show={page === 'add' && Boolean(token)} />

      <LoginForm show={page === 'login' && !token} setToken={setToken} setPage={setPage} />
    </div>
  )
}

export default App

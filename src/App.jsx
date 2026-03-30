import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const App = () => {
  const [page, setPage] = useState('authors')
  const authors = [
    { id: '1', name: 'Robert Martin', born: 1952, bookCount: 2 },
    { id: '2', name: 'Martin Fowler', born: 1963, bookCount: 1 },
    { id: '3', name: 'Fyodor Dostoevsky', born: 1821, bookCount: 2 },
    { id: '4', name: 'Joshua Kerievsky', born: null, bookCount: 1 },
    { id: '5', name: 'Sandi Metz', born: null, bookCount: 1 },
  ]

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} authors={authors} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App

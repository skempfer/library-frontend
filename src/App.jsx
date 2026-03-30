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
  const books = [
    { id: '1', title: 'Clean Code', author: 'Robert Martin', published: 2008 },
    {
      id: '2',
      title: 'Agile software development',
      author: 'Robert Martin',
      published: 2002,
    },
    {
      id: '3',
      title: 'Refactoring, edition 2',
      author: 'Martin Fowler',
      published: 2018,
    },
    {
      id: '4',
      title: 'Refactoring to patterns',
      author: 'Joshua Kerievsky',
      published: 2008,
    },
    {
      id: '5',
      title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
      author: 'Sandi Metz',
      published: 2012,
    },
    {
      id: '6',
      title: 'Crime and punishment',
      author: 'Fyodor Dostoevsky',
      published: 1866,
    },
    {
      id: '7',
      title: 'The Demon',
      author: 'Fyodor Dostoevsky',
      published: 1872,
    },
  ]

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} authors={authors} />

      <Books show={page === 'books'} books={books} />

      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App

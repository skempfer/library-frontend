import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('all genres')
  const genreFilter = selectedGenre === 'all genres' ? null : selectedGenre
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: genreFilter },
  })

  if (!props.show) {
    return null
  }

  if (booksResult.loading) {
    return <div>loading...</div>
  }

  if (booksResult.error) {
    return <div>could not load books</div>
  }

  const allBooks = props.books
  const books = booksResult.data?.allBooks ?? []
  const genres = [...new Set(allBooks.flatMap((book) => book.genres))]

  const selectGenre = (genre) => {
    setSelectedGenre(genre)
    void booksResult.refetch({ genre: genre === 'all genres' ? null : genre })
  }

  return (
    <div>
      <h2>books</h2>

      {selectedGenre === 'all genres' ? null : <div>in genre {selectedGenre}</div>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => selectGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => selectGenre('all genres')}>all genres</button>
      </div>
    </div>
  )
}

export default Books

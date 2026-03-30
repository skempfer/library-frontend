import { useState } from 'react'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('all genres')

  if (!props.show) {
    return null
  }

  const books = props.books
  const genres = [...new Set(books.flatMap((book) => book.genres))]
  const filteredBooks =
    selectedGenre === 'all genres'
      ? books
      : books.filter((book) => book.genres.includes(selectedGenre))

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
          {filteredBooks.map((a) => (
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
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre('all genres')}>all genres</button>
      </div>
    </div>
  )
}

export default Books

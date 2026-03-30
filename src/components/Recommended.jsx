import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS_BY_GENRE, ME } from '../queries'

const Recommended = ({ show }) => {
  const meResult = useQuery(ME, {
    skip: !show,
  })
  const favoriteGenre = meResult.data?.me?.favoriteGenre
  const booksResult = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
    skip: !show || !favoriteGenre,
  })

  if (!show) {
    return null
  }

  if (meResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  if (meResult.error || booksResult.error) {
    return <div>could not load recommendations</div>
  }

  const books = booksResult.data?.allBooks ?? []

  return (
    <div>
      <h2>recommendations</h2>

      <div>books in your favorite genre {favoriteGenre}</div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended

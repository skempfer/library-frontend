import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [born, setBorn] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })
  const authors = props.authors
  const activeAuthor = authors.some((author) => author.name === selectedAuthor)
    ? selectedAuthor
    : (authors[0]?.name ?? '')

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!activeAuthor || !born) {
      return
    }

    try {
      await editAuthor({
        variables: {
          name: activeAuthor,
          setBornTo: Number(born),
        },
      })
    } catch (error) {
      console.error(error.message)
      return
    }

    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born ?? ''}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {props.canEdit ? (
        <>
          <h3>set birthyear</h3>

          <form onSubmit={submit}>
            <div>
              name
              <select
                value={activeAuthor}
                onChange={({ target }) => setSelectedAuthor(target.value)}
                disabled={!authors.length}
              >
                {authors.map((author) => (
                  <option key={author.name} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              born
              <input
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </>
      ) : null}
    </div>
  )
}

export default Authors

import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const Authors = ({ authors, token }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  console.log('authors:', authors)
  console.log(name, born)

  const [updateBirthYear] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      console.log(error.message)
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.concat(response.data.editAuthor),
        }
      })
    }
  })

  const submit = async (event) => {
    event.preventDefault()

    try {
      await updateBirthYear({ variables: { name, born: Number(born) } })
    }
    catch (error) {
      console.log('error:', error)
    }

    setName('')
    setBorn('')
  }


  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      {!token ? null
        : <>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div className="field_group">
              <label htmlFor='author'>
                Name:
              </label>
              <select id="author" name="author" value={name} onChange={({ target }) => setName(target.value)}>
                <option value="">Select an author</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field_group">
              <label>
                Born:
              </label>
              <input type="number" name='setBornTo' value={born}
                onChange={({ target }) => setBorn(target.value)} />
            </div>

            <button type="submit">Update birthyear</button>
          </form>
        </>}
    </div>
  )
}

export default Authors
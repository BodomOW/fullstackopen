import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const Authors = ({ authors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [updateBirthYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error.message)
    },
  })

  const submit = async (event) => {
    event.preventDefault()

    updateBirthYear({ variables: { name, born: Number(born) } })

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

      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div className="field_group">
          <label htmlFor="authorSelect">
            Name:
          </label>
          <select id="authorSelect" value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field_group">
          <label htmlFor="bornInput">
            Born:
          </label>
          <input id="bornInput" type="number" value={born}
            onChange={({ target }) => setBorn(target.value)} />
        </div>

        <button type="submit">Update birhyear</button>
      </form>
    </div>

  )
}

export default Authors
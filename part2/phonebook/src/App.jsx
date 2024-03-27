import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { id: 1, name: 'Arto Hellas', number: '040-1234567'}
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addName = (event) => {
    event.preventDefault()

    let lastPerson = persons.slice(-1);

    const personObject = {
      id: lastPerson[0].id + 1,
      name: newName,
      number: newNumber
    }

    console.log(personObject.id)

    // Checks whether an element is duplicated
    const checkDuplicate = (element) => element.name === personObject.name;

    if (persons.some(checkDuplicate)) {
      alert(`${personObject.name} is already added to the phonebook`)
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    // console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>

        <div>
          <button type="submit">add</button>
        </div>

      </form>

      <h2>Numbers</h2>
      <ul style={{ padding: "0" }}>
        {
          persons.map(person => <li key={person.id} style={{ listStyleType: "none" }}>{person.name} {person.number}</li>)
        }
      </ul>
    </div>
  )
}

export default App
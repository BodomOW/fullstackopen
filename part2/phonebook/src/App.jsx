import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newFilter, setNewFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(false)

  const re = RegExp(`.*${newFilter.toLowerCase().split('').join('.*')}.*`)

  const personsToShow = showAll
  ? persons
  : persons.filter(person => person.name.toLowerCase().match(re))

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

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <label for='filter'>filter shown with</label>
        <input id="filter" type="text" value={newFilter} onChange={handleFilterChange} />
      </div>
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
          personsToShow.map(person => <li key={person.id} style={{ listStyleType: "none" }}>{person.name} {person.number}</li>)
        }
      </ul>
    </div>
  )
}

export default App
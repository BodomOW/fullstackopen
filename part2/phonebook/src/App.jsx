import { useState } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

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
  const [showAll, setShowAll] = useState(true)

  const re = RegExp(`.*${newFilter.toLowerCase().split('').join('.*')}.*`)

  const personsToShow = showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().match(re))

  const handleAddPerson = (event) => {
    event.preventDefault()

    let lastPerson = persons.slice(-1);

    const personObject = {
      id: lastPerson[0].id + 1,
      name: newName,
      number: newNumber
    }

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

    if (event.target.value === '') {
      return setShowAll(true)
    }

    setShowAll(false)
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
      <Filter value={newFilter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm 
        handleSubmit={handleAddPerson} name={newName} number={newNumber} 
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} 
      />

      <h3>Numbers</h3>
      
      <Persons personsToShow={personsToShow}/>
    </div>
  )
}

export default App
import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    personService
      .getAll('http://localhost:3001/persons')
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const re = RegExp(`.*${newFilter.toLowerCase().split('').join('.*')}.*`)

  const personsToShow = showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().match(re))

  const handleAddPerson = event => {
    event.preventDefault()


    const personObject = {
      name: newName,
      number: newNumber
    }

    // Checks whether an element is duplicated
    const checkDuplicate = (element) => element.name === personObject.name;

    if (persons.some(checkDuplicate)) {
      alert(`${personObject.name} is already added to the phonebook`)
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })

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

      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App
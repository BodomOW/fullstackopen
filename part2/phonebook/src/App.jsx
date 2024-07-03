import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
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

    // Duplicate value starts with 0
    let checkDuplicate = 0

    persons.forEach(person => {
      if (person.name.toLowerCase() === personObject.name.toLowerCase()) {
        checkDuplicate = 1
        const text = `${personObject.name} is already added to the phonebook, replace the old number with a new one?`
        if (confirm(text) == true) {
          console.log('Person id to update:', person.id)
          console.log('Person name to update:', person.name)
          personService
            .update(person.id, personObject)
            .then(returnedPerson => {
              setPersons(persons.filter(person => person.name.toLowerCase() !== personObject.name.toLowerCase()).concat(returnedPerson))
              setNewName('')
              setNewNumber('')
              setMessage({
                text: `${returnedPerson.name} number updated successfully`,
                status: 'success'
              })
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            })
            .catch(error => {
              setMessage({
                text: `'${person.name}' was already removed from server`,
                status: 'error'
              }
              )
              setTimeout(() => {
                setMessage(null)
              }, 5000)
              setPersons(persons.filter(n => n.id !== person.id))
            })
        }
      }
    })

    if (checkDuplicate === 1) {
      return
    }

    personService
      .create(personObject)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')
        setMessage({
          text: `Added ${createdPerson.name}`,
          status: 'success'
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch((error) => {
        // this is the way to access the error message
        setMessage({
          text: `${error.response.data.error}`,
          status: 'error'
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const handleDeletePerson = (id, name) => {
    console.log('Person id to remove:', id)
    console.log('Person name to remove:', name)
    const text = `Delete ${name} ?`
    if (confirm(text) == true) {
      personService
        .remove(id)
        .then(setPersons(persons.filter(person => person.id !== id)))
    }
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
      <h1>Phonebook</h1>
      <Notification message={message} />

      <Filter value={newFilter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        handleSubmit={handleAddPerson} name={newName} number={newNumber}
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} handleDeletePerson={handleDeletePerson} />
    </div>
  )
}

export default App
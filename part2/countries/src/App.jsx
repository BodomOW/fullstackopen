import { useState, useEffect } from 'react'

import countryService from './services/countries'

const DataDisplay = ({ data }) => {
  console.log('data', data)

  let countryData

  if (data.length > 10) {
    countryData = 'Too many matches, specify another filter'
  }

  if (data.length <= 10 && data.length > 1) {
    countryData = data.map(country => <p key={country.area}>{country.name}</p>)
  }

  if (data.length === 1) {
    countryData = data.map(country => {
      return (
        <div key={country.area}>
          <h1>{country.name}</h1>
          <p>capital {country.capital}</p>
          <p>area {country.area}</p>
          <b>languages:</b>
          <ul>
            {Object.entries(country.spokenLang).map(([key, value]) =>
              <li key={key}>{value}</li>)
            }
          </ul>
          <picture>
            <img src={country.flag.png} alt={country.flag.alt}></img>
          </picture>
        </div>
      )
    })
  }

  console.log('countryData', countryData)
  return (
    <>
      {countryData}
    </>
  )

}

const App = () => {
  const [countries, setCountries] = useState([]) // Initial Countries, value is not going to change after getting them
  console.log('countries', countries)
  const [showCountries, setShowCountries] = useState(false) // Boolean to determine if we need to show something
  const [newFilter, setNewFilter] = useState('') // Filter to match the name of the country
  // const [showData, setShowData] = useState([{ // Object that contains the information to show
  //   name: '',
  //   capital: '',
  //   area: '',
  //   spokenLang: [],
  //   flag: {}
  // }])

  useEffect(() => {
    countryService
      .getAll()
      .then(AllCountries => {
        setCountries(AllCountries)
        // console.log(countries.name.common)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  // regex
  const re = RegExp(`.*${newFilter.toLowerCase().split('').join('.*')}.*`)

  // Saving countries
  const countriesToShow = []

  const checkMatch = (country) => {
    const currentCountry = country.name.common.toLowerCase().match(re)
    if (currentCountry !== null) {
      console.log('currentCountry', currentCountry)

      const countryObject = {
        name: country.name.common,
        capital: country.capital,
        area: country.area,
        spokenLang: country.languages,
        flag: country.flags
      }

      console.log('countryObject', countryObject)
      countriesToShow.push(countryObject)
    }
  }

  if (showCountries) {
    countries.filter(country => checkMatch(country))
  }

  console.log('countriesToShow', countriesToShow)

  const handleFilterChange = event => {
    const value = event.target.value
    console.log(value)

    setNewFilter(value)

    if (value === '') {
      return setShowCountries(false)
    }

    setShowCountries(true)
  }

  return (
    <>
      <span>Find countries </span><input type='text' value={newFilter} onChange={handleFilterChange} />
      <br />
      <DataDisplay data={countriesToShow} />
    </>
  )
}

export default App

import { useState, useEffect } from 'react'

import countryService from './services/countries'

const DataDisplay = ({ data, handleBtn, state }) => {
  console.log('state', state)
  console.log('data', data)

  let countryData

  if (data.length > 10) {
    countryData = 'Too many matches, specify another filter'
  }

  if (data.length <= 10 && data.length > 1) {
    countryData = data.map(country => {
      let btnText = state.map(e => {
        if (e.area === country.area) {
          return e.btnText
        }
      })
      // console.log(btn)
      return (
        <div key={country.area}>
          <p>{country.name} <button id={`btn-${country.area}`} onClick={() => handleBtn(country.area)}>{btnText}</button></p>
          <div id={`content-${country.area}`} hidden>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <b>languages:</b>
            <ul>
              {Object.entries(country.spokenLang).map(([key, value]) =>
                <li key={key}>{value}</li>
              )}
            </ul>
            <picture>
              <img src={country.flag.png} alt={country.flag.alt}></img>
            </picture>
            <br />
            <hr />
          </div>
        </div>
      )
    })
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
              <li key={key}>{value}</li>
            )}
          </ul>
          <picture>
            <img src={country.flag.png} alt={country.flag.alt}></img>
          </picture>
        </div>
      )
    })
  }

  // console.log('countryData', countryData)
  return (
    <>
      {countryData}
    </>
  )

}

const App = () => {
  const [countries, setCountries] = useState([]) // Initial Countries, value is not going to change after getting them
  const [showCountries, setShowCountries] = useState(false) // Boolean to determine if we need to show something
  const [newFilter, setNewFilter] = useState('') // Filter to match the name of the country
  const [countrySelected, setCountrySelected] = useState([])

  useEffect(() => {
    countryService
      .getAll()
      .then(AllCountries => {
        setCountries(AllCountries)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  // regex
  const re = RegExp(`.*${newFilter.toLowerCase().split('').join('.*')}.*`)

  // Saving countries
  const countriesToShow = []

  const checkMatch = country => {
    const currentCountry = country.name.common.toLowerCase().match(re)
    if (currentCountry !== null) {
      // console.log('currentCountry', currentCountry)

      const countryObject = {
        name: country.name.common,
        capital: country.capital,
        area: country.area,
        spokenLang: country.languages,
        flag: country.flags
      }

      // console.log('countryObject', countryObject)
      countriesToShow.push(countryObject)
    }
  }

  const toggleButton = area => {
    const content = document.querySelector(`#content-${area}`)
    content.toggleAttribute('hidden')

    let test = (countrySelected.filter(country => country.area === area))

    if (!content.hasAttribute('hidden')) {
      test.forEach(item => item.btnText = 'hide')
    } else {
      test.forEach(item => item.btnText = 'show')
    }
    setCountrySelected((countrySelected.filter(country => country.area !== area)).concat(test))
  }

  if (showCountries) {
    countries.filter(country => checkMatch(country))
  }

  console.log('countriesToShow', countriesToShow)

  const handleFilterChange = event => {
    const value = event.target.value
    // console.log(value)

    setNewFilter(value)

    if (value === '') {
      return setShowCountries(false)
    }

    setShowCountries(true)

    setCountrySelected(countriesToShow.map(({ area }) => ({ area, btnText: 'show' })))
  }

  return (
    <>
      <span>Find countries </span><input type='text' value={newFilter} onChange={handleFilterChange} />
      <br />
      <DataDisplay data={countriesToShow} handleBtn={toggleButton} state={countrySelected} />
    </>
  )
}

export default App

import { useState, useEffect } from 'react'

import countryService from './services/countries'
import weatherService from './services/weather'

const isObjectEmpty = obj => {
  return Object.keys(obj).length === 0
}

const DataDisplay = ({ data, handleBtn, state, handleGeoCode, weather }) => {
  // console.log('state', state)
  // console.log('data', data)
  console.log('weather obj', weather)

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

      handleGeoCode(country)

      if (!isObjectEmpty(weather)) {
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
            <h2>{`Weather in ${country.name}`}</h2>
            <p>temperature {weather.main.temp} Celcius</p>
            <picture>
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
            </picture>
            <p>wind {weather.wind.speed} m/s</p>
          </div>
        )
      }
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
  const [geoCode, setGeoCode] = useState([])
  const [weather, setWeather] = useState({})

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

  useEffect(() => {
    console.log('useEffect related to state geoCode', geoCode)

    if (geoCode.length === 0) {
      return
    }

    weatherService
      .getWeather(geoCode[0].lat, geoCode[0].lon)
      .then(weather => {
        console.log('weather', weather)
        setWeather(weather)
      })
      .catch(error => {
        console.log(error)
      })
  }, [geoCode])

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

  // console.log('countriesToShow', countriesToShow)

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

  const handleGeoCode = country => {
    // console.log('country', country)

    useEffect(() => {
      weatherService
        .getGeocode(country.name)
        .then(geoCode => {
          console.log('useEffect geoCode', geoCode)
          console.log(geoCode[0].lat, geoCode[0].lon)
          setGeoCode(geoCode)
        })
        .catch(error => {
          console.log(error)
        })
    }, [])
  }

  return (
    <>
      <span>Find countries </span><input type='text' value={newFilter} onChange={handleFilterChange} />
      <br />
      <DataDisplay data={countriesToShow} handleBtn={toggleButton} state={countrySelected} handleGeoCode={handleGeoCode} weather={weather} />
    </>
  )
}

export default App

import { useState, useEffect } from 'react'
import { getCountry } from '../App'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) {
      setCountry(null)
      return
    }

    getCountry(name)
      .then(data => {
        setCountry({ found: true, data: data })
      })
      .catch(() => {
        setCountry({ found: false, data: null })
      })
  }, [name])

  return country
}
import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
// const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name/finland'
// const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = () => {
  const request = axios.get(`${baseUrl}/all`)
  return request.then(response => response.data)
}

const getCountry = (name) => {
  const request = axios.get(`${baseUrl}/name/${name}`)
  return request.then(response => response.data)
}

export default { getAll, getCountry }
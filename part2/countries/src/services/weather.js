import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org'
const api_key = import.meta.env.VITE_SOME_KEY

const getWeather = (lat, lon) => {
  console.log(lat, lon)
  const request = axios.get(`${baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
  return request.then(response => response.data)
}

const getGeocode = cityName => {
  const request = axios.get(`${baseUrl}/geo/1.0/direct?q=${cityName}&appid=${api_key}`)
  return request.then(response => response.data)
}

export default { getWeather, getGeocode }
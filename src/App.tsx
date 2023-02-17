import { ChangeEvent, useEffect, useState } from 'react'
import { optionType ,forecastType} from './types'
import Search from './components/Icons/Search'
import Forecast from './components/Forecast'
const App = (): JSX.Element => {
  const [term, setTerm] = useState<string>()
  const [options, setOptions] = useState<[]>([])
  const [city, setCity] = useState<optionType | null>(null)
  const [forecast, setForeCast] = useState< forecastType|null>(null)
  const getSearchOptions = (value: string) => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${value.trim()}&limit=5&appid=${
        process.env.REACT_APP_API_KEY
      }`
    )
      .then((res) => res.json())
      .then((data) => setOptions(data))
  }
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setTerm(value)

    if (value === '') return
    getSearchOptions(value)
  }
  const getForecast = (city: optionType) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        const forecastData={
          ...data.city,
          list:data.list.slice(0,16),
        }
        
        setForeCast(forecastData)})
  }

  const onSubmit = () => {
    if (!city) return
    getForecast(city)
  }
  const onOptionSelect = (option: optionType) => {
    setCity(option)
    console.log(option.name)
  }
  // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
  useEffect(() => {
    if (city) {
      setTerm(city.name)
      setOptions([])
    }
  }, [city])
  return (
    <main className="flex justify-center items-center bg-gradient-to-br from-sky-400 via-rose-400 to-lime-400 h-[100vh] w-full">
      {forecast ? (
      <Forecast data={forecast}/>
      ) : (
        <Search
          term={term}
          options={options}
          onInputChange={onInputChange}
          onOptionSelect={onOptionSelect}
          onSubmit={onSubmit}
        />
      )}
    </main>
  )
}

export default App

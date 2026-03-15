

import { useState } from 'react'
import './App.css'
import { icons, getClothingIcon } from './icons.js'
function App() {
  const [cityName, setCityName] = useState("")
  const [weatherData, setWeatherData] = useState(null)
  const [isHovering, setIsHovering] = useState(false)

  const handleCityNameInput = (e) => {
    setCityName(e.target.value)
  }

  const weatherIcons = {
    Clear: icons.sun,
    Clouds: icons.clouds,
    Rain: icons.rain
  }

  const fetchOpenWeatherApi = () => {
    const apiKey = "9af04edca48732aeccdff09b5b7406a3";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(response => response.json())
      .then(responseResult => setWeatherData(responseResult))
      .catch(err => console.error("API Fehler:", err))
  }

  return (
    <div>
      <img className='app-logo' src={icons.logo} alt="App Logo" />
      <input
        type='text'
        placeholder='Stadtname'
        onChange={handleCityNameInput}
      />
      <button onClick={fetchOpenWeatherApi}>Suchen</button>

      <div className='weather-container'>
        {weatherData?.main && (
          <>
            <div className='tile'>
              <img 
                onClick={() => { weatherData.weather[0].main === "Clear" && alert("Pack deine Sonnenbrille ein!") }}
                src={weatherIcons[weatherData.weather[0].main]} 
                alt="Wetter"
              />
            </div>
            
            <div className='tile'>
              <img src={icons.wind} alt="Wind" />
              {(weatherData.wind.speed * 3.6).toFixed(1)} km/h
            </div>

            <div className='tile'>
              <img
                src={getClothingIcon(weatherData.main.temp)}
                className='weather-icon'
                alt="Empfehlung"
              />
            </div>

            <div
              className="tile"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span style={{ fontWeight: 'bold' }}>
                {isHovering ? "Gefühlt" : "Temperatur"}
              </span>
              <p>
                {isHovering
                  ? `${Math.round(weatherData.main.feels_like)}°C`
                  : `${Math.round(weatherData.main.temp)}°C`
                }
              </p>
            </div>
          </>
        )}
      </div>
      <p>&copy; {new Date().getFullYear()} QuickWeather</p>
    </div>
  )
}

export default App
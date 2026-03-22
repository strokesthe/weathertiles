import { useState } from "react";
import "./App.css";
import { icons, getClothingIcon } from "./icons.js";

function App() {
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState(null);
  const [searchKey, setSearchKey] = useState(0);

  const apiKey = "9af04edca48732aeccdff09b5b7406a3";

  const weatherIcons = {
    Clear: icons.sun,
    Clouds: icons.clouds,
    Rain: icons.rain,
    Drizzle: icons.rain,
    Snow: icons.snow,
    Moon: icons.moon,
  };

  const handleCityNameInput = (e) => {
    setCityName(e.target.value);
  };

  const fetchOpenWeatherApi = () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    setError(null);
    setForecastData(null);
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Stadt nicht gefunden");
        return response.json();
      })
      .then((result) => {
        setWeatherData(result);
        setSearchKey((prev) => prev + 1);
      })
      .catch((err) => {
        setWeatherData(null);
        setError(err.message);
      });
  };

  const fetchOpenWeatherApiForecast = () => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
    setError(null);
    setWeatherData(null);
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Stadt nicht gefunden");
        return response.json();
      })
      .then((result) => {
        setForecastData(result);
        setSearchKey((prev) => prev + 1);
      })
      .catch((err) => {
        setForecastData(null);
        setError(err.message);
      });
  };

  const getDynamicBg = (temp) => {
    if (temp >= 25)
      return "linear-gradient(135deg, rgba(250, 54, 0, 0.7) 0%, rgba(255, 100, 0, 0.5) 100%)";
    if (temp >= 20)
      return "linear-gradient(135deg, rgba(255, 215, 0, 0.7) 0%, rgba(255, 165, 0, 0.5) 100%)";
    if (temp >= 15)
      return "linear-gradient(135deg, rgba(100, 230, 100, 0.7) 0%, rgba(34, 139, 34, 0.5) 100%)";
    return "linear-gradient(135deg, rgba(0, 132, 175, 0.7) 0%, rgba(0, 191, 255, 0.5) 100%)";
  };


  const fetchWeatherByLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      
      setWeatherData(null);
      setForecastData(null);
      
      fetch(url)
        .then((res) => res.json())
        .then((result) => {
          setWeatherData(result);
          setCityName(result.name)
          setSearchKey((prev) => prev + 1);
        });
    });
  }
};

  return (
    <div className="main-wrapper">
      <img className="app-logo" src={icons.logo} alt="App Logo" />

      <div className="input-group">
        <input
          type="text"
          placeholder="Stadtname"
          value={cityName}
          onChange={handleCityNameInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchOpenWeatherApi();
          }}
        />
        <button onClick={fetchOpenWeatherApi}>Suchen</button>
        <button onClick={fetchOpenWeatherApiForecast}>5 Tage</button>
        <button onClick={fetchWeatherByLocation}>Standort</button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="weather-container" key={searchKey}>
        {weatherData?.main && (
          <div className="weather-current">
            <div
              className="tile"
              style={{ background: getDynamicBg(weatherData.main.temp) }}>
              <img
                src={weatherIcons[weatherData.weather[0].main] || icons.clouds}
                alt="Wetter"
              />
              <p>{weatherData.weather[0].main}</p>
            </div>
            <div
              className="tile"
              style={{ background: getDynamicBg(weatherData.main.temp) }}>
              <img src={icons.wind} alt="Wind" />
              <p>{(weatherData.wind.speed * 3.6).toFixed(1)} km/h</p>
            </div>
            <div
              className="tile"
              style={{ background: getDynamicBg(weatherData.main.temp) }}>
              <img src={getClothingIcon(weatherData.main.temp)} alt="Outfit" />
              <p>Outfit</p>
            </div>
            <div
              className="tile"
              style={{ background: getDynamicBg(weatherData.main.temp) }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}>
              <span style={{ fontWeight: "bold" }}>
                {isHovering ? "Gefühlt" : "Temperatur"}
              </span>
              <p>
                {Math.round(
                  isHovering
                    ? weatherData.main.feels_like
                    : weatherData.main.temp,
                )}
                °C
              </p>
              <p>
                {Math.round(weatherData.main.temp_min)}°C -{" "}
                {Math.round(weatherData.main.temp_max)}°C
              </p>
            </div>
          </div>
        )}

        {forecastData?.list && (
          <div className="forecast-grid">
            {forecastData.list
              .filter((_, index) => index % 8 === 0)
              .map((item, index) => {
                const temp = item.main.temp;
                return (
                  <div
                    key={index}
                    className="tile"
                    style={{ background: getDynamicBg(temp), animationDelay: `${index * 0.1}s` } }>
                    <p style={{ fontWeight: "bold" }}>
                      {new Date(item.dt * 1000).toLocaleDateString("de-DE", {
                        weekday: "short",
                      })}
                    </p>
                    <img
                      src={weatherIcons[item.weather[0].main] || icons.clouds}
                      alt="Wetter"
                      style={{ width: "45px" }}
                    />
                    <img
                      src={getClothingIcon(temp)}
                      alt="Outfit"
                      style={{ width: "35px" }}
                    />
                    <p style={{ fontWeight: "bold" }}>{Math.round(temp)}°C</p>
                    <p style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                      {(item.wind.speed * 3.6).toFixed(0)} km/h
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      <p className="footer-text">
        &copy; {new Date().getFullYear()} QuickWeather
      </p>
    </div>
  );
}

export default App;

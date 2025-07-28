import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import "./Weather.css";

function getWeatherIcon(condition) {
  const cond = (condition ?? "").toLowerCase();
  if (cond.includes("cloud") || cond.includes("mist"))
    return <ThunderstormIcon className="icon cloud" />;
  if (cond.includes("rain"))
    return <ThunderstormIcon className="icon rain" />;
  if (cond.includes("clear"))
    return <WbSunnyIcon className="icon sunny" />;
  if (cond.includes("snow"))
    return <AcUnitIcon className="icon snow" />;
  return <WbSunnyIcon className="icon default" />;
}

function getAmbientSound(condition) {
  const cond = (condition ?? "").toLowerCase();
  if (cond.includes("rain")) return "/sounds/rain.mp3";
  if (cond.includes("thunder")) return "/sounds/thunder.mp3";
  if (cond.includes("snow")) return "/sounds/snow.mp3";
  if (cond.includes("clear") || cond.includes("sun")) return "/sounds/sunny.mp3";
  return null;
}

function speakWeatherHindi(info) {
  const text = `आपका स्थान ${info.city} है। वर्तमान तापमान है ${Math.round(info.temp)} डिग्री सेल्सियस।
    न्यूनतम तापमान ${Math.round(info.tempMin)} डिग्री, अधिकतम तापमान ${Math.round(info.tempMax)} डिग्री है।
    नमी ${info.humidity}% है और महसूस किया गया तापमान है ${Math.round(info.feelsLike)} डिग्री।
    मौसम है ${info.weather}। धन्यवाद।`;

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "hi-IN";
  speechSynthesis.speak(speech);
}

export default function WeatherApp() {
  const [weatherInfo, setWeatherInfo] = useState({
    city: "Delhi",
    temp: 24.43,
    tempMin: 25.05,
    tempMax: 25.54,
    humidity: 34,
    feelsLike: 24.54,
    weather: "Clear",
  });
  const [city, setCity] = useState("");
  const [error, setError] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const audioRef = useRef(null);

  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (weatherInfo.city !== "Delhi") fetchWeather(weatherInfo.city, false);
    }, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, [weatherInfo.city]);

  const fetchWeather = async (targetCity, speak = true) => {
    try {
      const response = await fetch(
        `${API_URL}?q=${targetCity}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error("City Not Found");
      const json = await response.json();

      const newInfo = {
        city: json.name,
        temp: json.main.temp,
        tempMin: json.main.temp_min,
        tempMax: json.main.temp_max,
        humidity: json.main.humidity,
        feelsLike: json.main.feels_like,
        weather: json.weather[0].description,
      };

      setWeatherInfo(newInfo);

      if (speak) speakWeatherHindi(newInfo);

      const sound = getAmbientSound(newInfo.weather);
      if (sound) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(sound);
        audioRef.current.loop = true;
        audioRef.current.play().catch(() => {});
      }
    } catch {
      setError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city) {
      setError(true);
      return;
    }
    await fetchWeather(city);
    setCity("");
  };

  return (
    <main className={`weather-app ${darkMode ? "dark" : "light"}`}>
      <motion.header
        className="app-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1>🌤 Skyscapes</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </motion.header>

      <motion.section
        className="search-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setError(false);
            }}
            placeholder="Search city..."
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
        {error && <p className="error-msg">Please enter a valid city name.</p>}
      </motion.section>

      <motion.section
        className={`weather-card ${weatherInfo.weather.toLowerCase().includes("cloud") ? "cloud" :
          weatherInfo.weather.toLowerCase().includes("rain") ? "rain" :
          weatherInfo.weather.toLowerCase().includes("snow") ? "snow" : "sunny"}`}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="card-header">
          <h2>{weatherInfo.city}</h2>
        </div>

        <div className="card-body">
          <div className="icon-temp">
            {getWeatherIcon(weatherInfo.weather)}
            <span>{Math.round(weatherInfo.temp)}°C</span>
          </div>
          <p className="condition-text">{weatherInfo.weather}</p>
        </div>

        <div className="card-footer">
          <div><strong>Min:</strong> {weatherInfo.tempMin}°C</div>
          <div><strong>Max:</strong> {weatherInfo.tempMax}°C</div>
          <div><strong>Feels Like:</strong> {weatherInfo.feelsLike}°C</div>
          <div><strong>Humidity:</strong> {weatherInfo.humidity}%</div>
        </div>
      </motion.section>

      <footer className="app-footer">
        <p>
          Made with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/alok-yadav-906920292"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rao Alok Yadavv
          </a>
        </p>
      </footer>
    </main>
  );
}

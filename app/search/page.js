"use client";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedUnit = localStorage.getItem("temperatureUnit") || "C";
    const savedTheme = localStorage.getItem("theme") || "light";
    setUnit(savedUnit);
    setTheme(savedTheme);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        https://api.weatherapi.com/v1/forecast.json?key=61510d21795941a0b8813836250804&q=${query}&days=7&aqi=no&alerts=no
      );
      if (!res.ok) throw new Error("Could not find location");
      const data = await res.json();
      setWeather(data);
      setError("");
    } catch (err) {
      setError("Location not found.");
      setWeather(null);
    }
  };

  const getTemp = (c, f) => (unit === "C" ? ${c}°C : ${f}°F);

  const themeClasses =
    theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = theme === "dark" ? "bg-black bg-opacity-50" : "bg-white shadow";

  return (
    <div className={min-h-screen p-6 ${themeClasses}}>
      <h1 className="text-3xl font-bold mb-6">Search Weather</h1>

      <form onSubmit={handleSearch} className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Enter location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-3 rounded-md w-full md:w-1/2 bg-white text-black shadow-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {weather && (
        <div className={${cardBg} rounded-xl p-6 w-full max-w-md}>
          <h2 className="text-2xl font-semibold mb-2">
            {weather.location.name}, {weather.location.country}
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">
                {getTemp(weather.current.temp_c, weather.current.temp_f)}
              </p>
              <p className="opacity-80">{weather.current.condition.text}</p>
            </div>
            <img
              src={https:${weather.current.condition.icon}}
              alt={weather.current.condition.text}
              className="w-16 h-16"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className={${cardBg} p-3 rounded-lg}>
              Feels like: {getTemp(weather.current.feelslike_c, weather.current.feelslike_f)}
            </div>
            <div className={${cardBg} p-3 rounded-lg}>
              Humidity: {weather.current.humidity}%
            </div>
            <div className={${cardBg} p-3 rounded-lg}>
              Wind: {weather.current.wind_kph} kph
            </div>
            <div className={${cardBg} p-3 rounded-lg}>
              Visibility: {weather.current.vis_km} km
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
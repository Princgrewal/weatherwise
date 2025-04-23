"use client";
import { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

async function fetchDataByCoords(lat, lon) {
  const res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=61510d21795941a0b8813836250804&q=${lat},${lon}&days=3&aqi=no&alerts=no`
  );
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export default function HomePage() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState("C");
  const [theme, setTheme] = useState("light");

  const getWeather = async (lat, lon) => {
    try {
      const data = await fetchDataByCoords(lat, lon);
      setWeather(data);
    } catch (err) {
      console.error(err);
      setError("Could not fetch weather data");
    }
  };

  useEffect(() => {
    const savedUnit = localStorage.getItem("temperatureUnit") || "C";
    const savedTheme = localStorage.getItem("theme") || "light";
    setUnit(savedUnit);
    setTheme(savedTheme);

    const getWeatherByLocation = async () => {
      try {
        if (!navigator.geolocation) {
          setError("Geolocation not supported");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            await getWeather(lat, lon);

            setTimeout(() => {
              const container = document.getElementById("map-container");
              if (container && !container.dataset.mapInitialized) {
                const map = new maplibregl.Map({
                  container: container,
                  style: `https://api.maptiler.com/maps/streets/style.json?key=WaHu6lAbayxstbrJXKGf`,
                  center: [lon, lat],
                  zoom: 10,
                });

                new maplibregl.Marker().setLngLat([lon, lat]).addTo(map);

                map.on("click", async (e) => {
                  const clickedLat = e.lngLat.lat;
                  const clickedLon = e.lngLat.lng;
                  await getWeather(clickedLat, clickedLon);
                });

                container.dataset.mapInitialized = "true";
              }
            }, 100);
          },
          () => {
            setError("Location access denied");
            setLoading(false);
          }
        );
      } catch (err) {
        console.error(err);
        setError("Could not fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    getWeatherByLocation();
  }, []);

  const getTemp = (celsius, fahrenheit) =>
    unit === "C" ? `${celsius}°C` : `${fahrenheit}°F`;

  const isDark = theme === "dark";
  const themeClasses = isDark ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = isDark ? "bg-gray-900" : "bg-white";

  return (
    <div className={`min-h-screen p-6 ${themeClasses}`}>
      <h1 className="text-3xl font-extrabold mb-6">Current Location Weather</h1>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {weather && (
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          <div className={`rounded-xl p-6 w-full lg:w-1/2 ${cardBg}`}>
            <h2 className="text-2xl font-semibold mb-2">
              {weather.location.name}, {weather.location.country}
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">
                  {getTemp(weather.current.temp_c, weather.current.temp_f)}
                </p>
                <p className="text-gray-300">{weather.current.condition.text}</p>
              </div>
              <img
                src={`https:${weather.current.condition.icon}`}
                alt={weather.current.condition.text}
                className="w-16 h-16"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div
                className={`p-4 rounded-lg ${cardBg} shadow-md flex justify-center items-center`}
              >
                Feels like: {getTemp(weather.current.feelslike_c, weather.current.feelslike_f)}
              </div>
              <div
                className={`p-4 rounded-lg ${cardBg} shadow-md flex justify-center items-center`}
              >
                Humidity: {weather.current.humidity}%
              </div>
              <div
                className={`p-4 rounded-lg ${cardBg} shadow-md flex justify-center items-center`}
              >
                Wind: {weather.current.wind_kph} kph
              </div>
              <div
                className={`p-4 rounded-lg ${cardBg} shadow-md flex justify-center items-center`}
              >
                Visibility: {weather.current.vis_km} km
              </div>
            </div>
          </div>

          <div className={`w-full lg:w-1/2 ${cardBg} rounded-xl p-2`}>
            <div
              id="map-container"
              style={{ width: "100%", height: "100%", minHeight: "300px", borderRadius: "0.75rem" }}
              className="shadow-md"
            />
          </div>
        </div>
      )}

      {weather && (
        <div>
          <h2 className="text-2xl font-bold mb-4">3-Day Forecast</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {weather.forecast.forecastday.map((day, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl shadow-md ${cardBg} transition hover:scale-105`}
              >
                <h3 className="font-semibold text-lg mb-2">{day.date}</h3>
                <img
                  src={`https:${day.day.condition.icon}`}
                  alt={day.day.condition.text}
                  className="w-12 h-12 mb-2"
                />
                <p className="text-sm mb-1">{day.day.condition.text}</p>
                <p className="text-sm">
                  Avg: {getTemp(day.day.avgtemp_c, day.day.avgtemp_f)}
                </p>
                <p className="text-sm text-gray-400">
                  Max: {getTemp(day.day.maxtemp_c, day.day.maxtemp_f)} / Min: {getTemp(day.day.mintemp_c, day.day.mintemp_f)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

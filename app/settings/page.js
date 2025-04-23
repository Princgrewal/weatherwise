"use client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [unit, setUnit] = useState("C");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedUnit = localStorage.getItem("temperatureUnit") || "C";
    const savedTheme = localStorage.getItem("theme") || "light";
    setUnit(savedUnit);
    setTheme(savedTheme);
  }, []);

  const handleSave = () => {
    localStorage.setItem("temperatureUnit", unit);
    localStorage.setItem("theme", theme);
    alert("Settings saved!");
  };

  const isDark = theme === "dark";
  const themeClasses = isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const cardBg = isDark ? "bg-black bg-opacity-50" : "bg-white shadow-md";

  return (
    <div className={`min-h-screen p-6 ${themeClasses}`}>
      <div className={`${cardBg} rounded-xl p-6 w-full max-w-xl mx-auto`}>
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Temperature Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-3 rounded-md bg-white text-black shadow"
          >
            <option value="C">Celsius (°C)</option>
            <option value="F">Fahrenheit (°F)</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-3 rounded-md bg-white text-black shadow"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

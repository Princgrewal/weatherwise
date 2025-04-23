import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-700 to-indigo-900 text-white p-6 shadow-lg backdrop-blur-md">
      <h2 className="text-3xl font-bold mb-8 tracking-wide">WeatherWise</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              href="/"
              className="block px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-200 hover:scale-105"
            >
              Home
            </Link>
          </li>
          <li>
  <Link
    href="/search"
    className="block px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-200 hover:scale-105"
  >
    Search
  </Link>
</li>
          <li>
            <Link
              href="/settings"
              className="block px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-200 hover:scale-105"
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

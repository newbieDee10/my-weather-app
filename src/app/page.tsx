'use client';

import { Search, Droplets, Wind, Sunrise, Sunset, Eye, Gauge } from "lucide-react";
import { useState } from 'react';

interface WeatherData {
  weather: Array<{
    main: string;
  }>;
  main: {
    temp: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
}

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (searchCity: string) => {
    if (!searchCity.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/package2.json');
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const getTemp = (temp: number) => {
    return isCelsius ? Math.round(temp) : Math.round(temp * 9/5 + 32);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const metersToKm = (meters: number) => Math.round(meters / 1000);
  const mpsToMph = (mps: number) => Math.round(mps * 2.237);

  return (
    <main className="h-screen w-screen overflow-hidden">
      <div className="w-full h-full">
        {/* Home page */}
        <div
          className="w-full h-full p-6 relative overflow-hidden"
          style={{
            backgroundImage: "url('/background picture.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {weather ? (
            <>
              {/* Search bar */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-full bg-white/90 backdrop-blur-sm border-none outline-none text-gray-800 placeholder-gray-500 text-sm"
                />
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-4 h-4 text-gray-600" />
                </button>
              </form>

              {/* Location */}
              <div className="text-center mb-8">
                <h1 className="text-xl font-bold text-black">
                  {weather.name},{weather.sys.country}
                </h1>
              </div>

              {/* Middle section - Weather condition, Temperature, Toggle */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
                {/* Weather condition */}
                <div className="text-center mb-6">
                  <p className="text-2xl font-regular text-black capitalize">
                    {weather.weather[0].main}
                  </p>
                </div>

                {/* Temperature */}
                <div className="text-center mb-4">
                  <div className="text-8xl font-thin text-black leading-none tracking-tight">
                    {getTemp(weather.main.temp)}°{isCelsius ? 'C' : 'F'}
                  </div>
                </div>

                {/* Toggle switch */}
                <div className="flex justify-center items-center gap-3">
                  <span className="text-black font-medium text-sm">°C</span>
                  <button
                    onClick={() => setIsCelsius(!isCelsius)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      isCelsius ? 'bg-gray-400' : 'bg-blue-500'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        isCelsius ? 'left-0.5' : 'translate-x-6 left-0.5'
                      }`}
                    />
                  </button>
                  <span className="text-black font-medium text-sm">°F</span>
                </div>
              </div>

              {/* Weather details grid - 2x3 layout */}
              <div className="grid grid-cols-3 gap-3 absolute bottom-6 left-6 right-6">
                
                {/* Humidity */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center justify-center">
                  <Droplets className="w-7 h-7 text-blue-500 mb-2" />
                  <p className="text-xl font-bold text-black">{weather.main.humidity}%</p>
                  <p className="text-xs text-black font-small">Humidity</p>
                </div>

                {/* Wind */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center justify-center">
                  <Wind className="w-7 h-7 text-gray-600 mb-2" />
                  <p className="text-xl font-bold text-black">{mpsToMph(weather.wind.speed)} mph</p>
                  <p className="text-xs text-black font-small">Wind</p>
                </div>

                {/* Sunrise */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center justify-center">
                  <Sunrise className="w-5 h-5 text-orange-500 mb-2" />
                  <p className="text-xl font-bold text-black">{formatTime(weather.sys.sunrise)}</p>
                  <p className="text-xs text-black font-small">Sunrise</p>
                </div>

                {/* Visibility */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center justify-center">
                  <Eye className="w-5 h-5 text-gray-700 mb-2" />
                  <p className="text-xl font-bold text-black">{metersToKm(weather.visibility)} km</p>
                  <p className="text-xs text-black font-small">Visibility</p>
                </div>

                {/* Pressure */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center justify-center">
                  <Gauge className="w-5 h-5 text-indigo-600 mb-2" />
                  <p className="text-xl font-bold text-black">{weather.main.pressure} hPa</p>
                  <p className="text-xs text-black font-small">Pressure</p>
                </div>

                {/* Sunset */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center justify-center">
                  <Sunset className="w-5 h-5 text-orange-400 mb-2" />
                  <p className="text-xl font-bold text-black">{formatTime(weather.sys.sunset)}</p>
                  <p className="text-xs text-black font-small">Sunset</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Search bar */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-full bg-white/90 backdrop-blur-sm border-none outline-none text-gray-800 placeholder-gray-500 text-sm"
                />
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-4 h-4 text-gray-600" />
                </button>
              </form>
              <div className="text-center py-20">
                <p className="text-xl text-black font-medium">
                  {loading ? 'Loading...' : 'Search for a city to see weather'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

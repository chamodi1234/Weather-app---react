import { useState, useEffect } from 'react';
import Search from '../search';

export default function Weather() {
    const [search, setSearch] = useState(''); // Ensure search is always a string
    const [loading, setLoading] = useState(false);
    const [weatherData, setWeatherData] = useState(null);

    const API_KEY = "c463c0995d91cc6f113990ef6c486828"; // Hardcoded API key

    async function fetchWeatherData(param) {
        if (!param) return; // Prevent empty API requests
        setLoading(true);
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=${API_KEY}&units=metric`);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            setWeatherData(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch() {
        if (!search.trim()) return; // Prevent searching with empty input
        fetchWeatherData(search);
    }

    function getCurrentDate() {
        return new Date().toLocaleDateString("en-us", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }

    useEffect(() => {
        fetchWeatherData("bangalore");
    }, []);

    return (
        <div className='container'>
            <Search
                search={search}
                setSearch={setSearch}
                handleSearch={handleSearch}
            />

            {loading ? (
                <div className='loading'>Loading...</div>
            ) : weatherData ? (
                <div>
                    <div className='city-name'>
                        <h2>
                            {weatherData.name}, <span>{weatherData.sys?.country}</span>
                        </h2>
                    </div>

                    <div className='date'>
                        <span>{getCurrentDate()}</span>
                    </div>

                    <div className='temp'>
                        {weatherData.main?.temp}°C
                    </div>

                    <p className='description'>
                        {weatherData.weather?.[0]?.description || ""}
                    </p>

                    <div className='weather-info'>
                        <div className='column'>
                            <div className='wind'>
                                <p>{weatherData.wind?.speed} m/s</p>
                                <p>Wind Speed</p>
                            </div>
                        </div>

                        <div className='column'>
                            <div className='humidity'>
                                <p>{weatherData.main?.humidity}%</p>
                                <p>Humidity</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No weather data available</p>
            )}
        </div>
    );
}

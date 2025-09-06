import react, {useState} from "react";
import axios from "axios";

export default function Weather() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState("");
    const [error, setError] = useState("");
    const handleCityChange = (event) => {
        setError("");
        setCity(event.target.value);
    }
    const fetchWeather = async () => {
        try{
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${'40af4a1ab2841fbefe0ddc5005df68d3'}&units=${'metric'}`)
            setWeather(response);
            // console.log(response.data);
        }
        catch(error){
            console.log("Error fetching weather data", error);
            setWeather("");
            setError(error.response.data);
        }
    }
    const handleClick = () => {
        fetchWeather();
    }
    return (
        <div id='root'>
            <main className="app" role="main">
                <h1 className="title">Today’s Weather</h1>
                <form className="weather-form" id="weather-form">
                    <label htmlFor="city-input" className="label">City</label>
                    <div className="input-row">
                        <input
                            id="city-input"
                            className="input"
                            name="city"
                            type="text"
                            placeholder="Enter city name"
                            autoComplete="off"
                            value={city} onChange={handleCityChange}
                        />
                        <button type="button" id="get-weather" className="button" onClick={handleClick}>
                            Get Weather
                        </button>
                    </div>
                </form>
                {weather &&
                    <section
                        className="result"
                        id="result"
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <p className="result__city" id="result-city">{weather.data.name}</p>
                        <p className="result__temp" id="result-temp">Temp is {weather.data.main.temp}°C</p>
                        <p className="result__desc" id="result-desc">{weather.data.weather[0].description}</p>
                    </section>
                }
                {error && <div className="error">{error.message}</div>}
            </main>
        </div>
    )
}
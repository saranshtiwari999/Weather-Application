import react, {useState} from "react";
import axios from "axios";

// export default function Weather() {
//     const [city, setCity] = useState("");
//     const [weather, setWeather] = useState("");
//     const [error, setError] = useState("");
//     const handleCityChange = (event) => {
//         setError("");
//         setCity(event.target.value);
//     }
//     const fetchWeather = async () => {
//         try{
//             const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${'40af4a1ab2841fbefe0ddc5005df68d3'}&units=${'metric'}`)
//             setWeather(response);
//             // console.log(response.data);
//         }
//         catch(error){
//             console.log("Error fetching weather data", error);
//             setWeather("");
//             setError(error.response.data);
//         }
//     }
//     const handleClick = () => {
//         fetchWeather();
//     }
//     return (
//         <div id='root'>
//             <main className="app" role="main">
//                 <h1 className="title">Today’s Weather</h1>
//                 <form className="weather-form" id="weather-form">
//                     <label htmlFor="city-input" className="label">City</label>
//                     <div className="input-row">
//                         <input
//                             id="city-input"
//                             className="input"
//                             name="city"
//                             type="text"
//                             placeholder="Enter city name"
//                             autoComplete="off"
//                             value={city} onChange={handleCityChange}
//                         />
//                         <button type="button" id="get-weather" className="button" onClick={handleClick}>
//                             Get Weather
//                         </button>
//                     </div>
//                 </form>
//                 {weather &&
//                     <section
//                         className="result"
//                         id="result"
//                         role="status"
//                         aria-live="polite"
//                         aria-atomic="true"
//                     >
//                         <p className="result__city" id="result-city">{weather.data.name}</p>
//                         <p className="result__temp" id="result-temp">Temp is {weather.data.main.temp}°C</p>
//                         <p className="result__desc" id="result-desc">{weather.data.weather[0].description}</p>
//                     </section>
//                 }
//                 {error && <div className="error">{error.message}</div>}
//             </main>
//         </div>
//     )
// }


/**
 * Weather code mapping per Open-Meteo (WMO) interpretation table.
 * https://open-meteo.com/en/docs (Weather code table section)
 */
const WEATHER_TABLE = [
    { codes:'', label: "Clear sky", icon: "clear" },
    { codes: [1, 2, 3], label: "Mainly clear / Partly cloudy / Overcast", icon: "cloudy" },
    { codes: [45, 48], label: "Fog / Depositing rime fog", icon: "fog" },
    { codes: [51, 53, 55], label: "Drizzle (light / moderate / dense)", icon: "drizzle" },
    { codes: [56, 57], label: "Freezing drizzle (light / dense)", icon: "drizzle" },
    { codes: [61, 63, 65], label: "Rain (slight / moderate / heavy)", icon: "rain" },
    { codes: [66, 67], label: "Freezing rain (light / heavy)", icon: "rain" },
    { codes: [71, 73, 75], label: "Snowfall (slight / moderate / heavy)", icon: "snow" },
    { codes:'', label: "Snow grains", icon: "snow" },
    { codes: [80, 81, 82], label: "Rain showers (slight / moderate / violent)", icon: "rain" },
    { codes: [85, 86], label: "Snow showers (slight / heavy)", icon: "snow" },
    { codes:'', label: "Thunderstorm (slight/moderate)", icon: "thunder" },
    { codes: [96, 99], label: "Thunderstorm with hail (slight/heavy)", icon: "thunder" },
];

function getWeatherInfo(code) {
    const item = WEATHER_TABLE.find((it) => it.codes.includes(Number(code)));
    return item || { label: "Unknown", icon: "cloudy" };
}

function WeatherIcon({ kind, size = 64 }) {
    const stroke = "currentColor";
    const fill = "none";
    const strokeWidth = 2;

    if (kind === "clear") {
        return (
            <svg width={size} height={size} viewBox="0 0 64 64" className="icon" aria-hidden="true">
                <circle cx="32" cy="32" r="12" fill="currentColor" />
                <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round">
                    <line x1="32" y1="4" x2="32" y2="14" />
                    <line x1="32" y1="50" x2="32" y2="60" />
                    <line x1="4" y1="32" x2="14" y2="32" />
                    <line x1="50" y1="32" x2="60" y2="32" />
                    <line x1="12" y1="12" x2="18" y2="18" />
                    <line x1="46" y1="46" x2="52" y2="52" />
                    <line x1="12" y1="52" x2="18" y2="46" />
                    <line x1="46" y1="18" x2="52" y2="12" />
                </g>
            </svg>
        );
    }

    if (kind === "cloudy") {
        return (
            <svg width={size} height={size} viewBox="0 0 64 64" className="icon" aria-hidden="true">
                <path d="M22 42a10 10 0 1 1 4.7-18.8A12 12 0 1 1 38 50H20a8 8 0 0 1 2-8z" fill="currentColor" />
            </svg>
        );
    }

    if (kind === "fog") {
        return (
            <svg width={size} height={size} viewBox="0 0 64 64" className="icon" aria-hidden="true">
                <path d="M20 28a10 10 0 0 1 20 0h4a8 8 0 1 1 0 16H18a8 8 0 1 1 2-16" fill="currentColor" opacity="0.8" />
                <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round">
                    <line x1="12" y1="48" x2="52" y2="48" />
                    <line x1="8" y1="54" x2="44" y2="54" />
                </g>
            </svg>
        );
    }

    if (kind === "drizzle") {
        return (
            <svg width={size} height={size} viewBox="0 0 64 64" className="icon" aria-hidden="true">
                <path d="M22 28a10 10 0 0 1 20 0h4a8 8 0 1 1 0 16H18a8 8 0 1 1 2-16" fill="currentColor" />
                <g fill="currentColor" opacity="0.7">
                    <circle cx="24" cy="50" r="2" />
                    <circle cx="34" cy="52" r="2" />
                    <circle cx="44" cy="50" r="2" />
                </g>
            </svg>
        );
    }

    if (kind === "rain") {
        return (
            <svg width={size} height={size} viewBox="0 0 64 64" className="icon" aria-hidden="true">
                <path d="M22 28a10 10 0 0 1 20 0h4a8 8 0 1 1 0 16H18a8 8 0 1 1 2-16" fill="currentColor" />
                <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round">
                    <line x1="22" y1="48" x2="18" y2="58" />
                    <line x1="34" y1="48" x2="30" y2="58" />
                    <line x1="46" y1="48" x2="42" y2="58" />
                </g>
            </svg>
        );
    }

    if (kind === "snow") {
        return (
            <svg width={size} height={size} viewBox="0 0 64 64" className="icon" aria-hidden="true">
                <path d="M22 28a10 10 0 0 1 20 0h4a8 8 0 1 1 0 16H18a8 8 0 1 1 2-16" fill="currentColor" />
                <g fill="currentColor" opacity="0.9">
                    <text x="22" y="56" fontSize="18" fontFamily="system-ui, -apple-system">✽</text>
                    <text x="36" y="56" fontSize="18" fontFamily="system-ui, -apple-system">✽</text>
                </g>
            </svg>
        );
    }

    // thunder
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" className="icon" aria-hidden="true">
            <path d="M22 28a10 10 0 0 1 20 0h4a8 8 0 1 1 0 16H18a8 8 0 1 1 2-16" fill="currentColor" />
            <path d="M30 46h8l-6 10h6l-10 14 4-12h-6z" fill="currentColor" />
        </svg>
    );
}

export default function WeatherApp() {
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    async function handleGetWeather() {
        const q = city.trim();
        if (!q) {
            setError("Please enter a city name.");
            setResult(null);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResult(null);

            // 1) Geocoding: resolve city -> lat/lon
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
            const geoRes = await fetch(geoUrl);
            if (!geoRes.ok) throw new Error(`Geocoding failed (${geoRes.status})`);
            const geo = await geoRes.json();
            if (!geo.results || geo.results.length === 0) {
                throw new Error("No matching location found.");
            }
            const place = geo.results;
            // console.log(place);
            const displayName = [
                place[0].name,
                place[0].admin1 ? place.admin1 : null,
                place[0].country ? place.country : null,
            ]
                .filter(Boolean)
                .join(", ");

            // 2) Current weather by coordinates
            const weatherUrl =
                `https://api.open-meteo.com/v1/forecast?latitude=${place[0].latitude}` +
                `&longitude=${place[0].longitude}` +
                `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code` +
                `&timezone=auto&precipitation_unit=mm`;
            const wxRes = await fetch(weatherUrl);
            if (!wxRes.ok) throw new Error(`Weather request failed (${wxRes.status})`);
            const wx = await wxRes.json();

            const cur = wx.current || {};
            const info = getWeatherInfo(cur.weather_code);
            setResult({
                name: displayName,
                temp: cur.temperature_2m,
                humidity: cur.relative_humidity_2m,
                precipitation: cur.precipitation,
                code: cur.weather_code,
                desc: info.label,
                icon: info.icon,
            });
        } catch (e) {
            setError(e.message || "Something went wrong.");
            setResult(null);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="app">
            <h1 className="title">Today’s Weather</h1>

            <form className="weather-form" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="city-input" className="label">City</label>
                <div className="input-row">
                    <input
                        id="city-input"
                        name="city"
                        type="text"
                        placeholder="Enter city name"
                        autoComplete="off"
                        className="input"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button type="button" className="button" onClick={handleGetWeather}>
                        Get Weather
                    </button>
                </div>
            </form>

            {error ? <p className="error" role="alert">{error}</p> : null}

            <section className="result" aria-live="polite" aria-atomic="true">
                {loading && <p className="muted">Loading current weather…</p>}

                {!loading && result && (
                    <div className="result__row">
                        <div className="result__iconwrap">
                            <WeatherIcon kind={result.icon} />
                        </div>
                        <div className="result__data">
                            <p className="result__city">{result.name}</p>
                            <p className="result__temp">
                                {typeof result.temp === "number" ? Math.round(result.temp) : "--"}°C
                            </p>
                            <p className="result__desc">{result.desc}</p>
                            <div className="result__stats">
                                <span>Precipitation: {typeof result.precipitation === "number" ? result.precipitation : "--"} mm</span>
                                <span>Humidity: {typeof result.humidity === "number" ? result.humidity : "--"}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
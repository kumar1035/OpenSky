
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        const themeIcon = themeToggle.querySelector('i');

        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        });

        // Weather Icons Mapping
        const weatherIcons = {
            'clear sky': '☀️',
            'few clouds': '🌤️',
            'scattered clouds': '⛅',
            'broken clouds': '☁️',
            'overcast clouds': '☁️',
            'light rain': '🌦️',
            'moderate rain': '🌧️',
            'heavy rain': '⛈️',
            'thunderstorm': '⛈️',
            'snow': '❄️',
            'mist': '🌫️',
            'fog': '🌫️',
            'haze': '🌫️'
        };

        // Sample Weather Data (replace with real API calls)
        const sampleWeatherData = {
            'london': {
                city: 'London',
                temp: 18,
                description: 'light rain',
                windSpeed: 12,
                humidity: 78,
                sunrise: '6:15 AM',
                sunset: '8:30 PM'
            },
            'new york': {
                city: 'New York',
                temp: 25,
                description: 'clear sky',
                windSpeed: 8,
                humidity: 45,
                sunrise: '6:30 AM',
                sunset: '7:45 PM'
            },
            'tokyo': {
                city: 'Tokyo',
                temp: 22,
                description: 'few clouds',
                windSpeed: 10,
                humidity: 65,
                sunrise: '5:45 AM',
                sunset: '6:20 PM'
            },
            'paris': {
                city: 'Paris',
                temp: 20,
                description: 'scattered clouds',
                windSpeed: 15,
                humidity: 58,
                sunrise: '6:45 AM',
                sunset: '8:15 PM'
            }
        };

        // Sample Forecast Data
        const sampleForecastData = [
            { day: 'Tomorrow', icon: '🌤️', temp: '23°/15°', desc: 'partly cloudy' },
            { day: 'Wednesday', icon: '🌧️', temp: '19°/12°', desc: 'light rain' },
            { day: 'Thursday', icon: '☀️', temp: '26°/18°', desc: 'sunny' },
            { day: 'Friday', icon: '⛅', temp: '21°/14°', desc: 'cloudy' },
            { day: 'Saturday', icon: '🌦️', temp: '17°/10°', desc: 'showers' }
        ];

        // Elements
        const searchForm = document.getElementById('searchForm');
        const cityInput = document.getElementById('cityInput');
        const locationBtn = document.getElementById('locationBtn');
        const loading = document.getElementById('loading');
        const weatherCard = document.getElementById('weatherCard');
        const forecastSection = document.getElementById('forecastSection');
        const weatherBg = document.getElementById('weatherBg');

        // Weather Card Elements
        const weatherIcon = document.getElementById('weatherIcon');
        const weatherTemp = document.getElementById('weatherTemp');
        const weatherCity = document.getElementById('weatherCity');
        const weatherDesc = document.getElementById('weatherDesc');
        const windSpeed = document.getElementById('windSpeed');
        const humidity = document.getElementById('humidity');
        const sunrise = document.getElementById('sunrise');
        const sunset = document.getElementById('sunset');
        const forecastGrid = document.getElementById('forecastGrid');

        // Search Form Handler
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const city = cityInput.value.trim().toLowerCase();
            if (city) {
                searchWeather(city);
            }
        });

        // Location Button Handler
locationBtn.addEventListener('click', function () {
    if (navigator.geolocation) {
        loading.style.display = 'flex';
        navigator.geolocation.getCurrentPosition(
            async function (position) {
                const { latitude, longitude } = position.coords;
                const apiKey = 'fa331705614af40576717d024dd037a0';  //add api key here
                // Fetch current weather data using city name
                // Display weather details on UI

                try {
                    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
                    const data = await res.json();

                    const weatherInfo = {
                        city: data.name,
                        temp: Math.round(data.main.temp),
                        description: data.weather[0].description,
                        windSpeed: data.wind.speed,
                        humidity: data.main.humidity,
                        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
                        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString()
                    };

                    displayWeather(weatherInfo);
                    updateBackground(weatherInfo.description);

                    // Get 5-day forecast
                    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
                    const forecastData = await forecastRes.json();
                    const daily = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
                    displayForecast(daily);
                    forecastSection.classList.remove('hidden');

                } catch (error) {
                    alert("Error loading weather: " + error.message);
                } finally {
                    loading.style.display = 'none';
                }
            },
            function () {
                loading.style.display = 'none';
                alert("Location access denied. Please enter a city.");
            }
        );
    }
});

function updateBackground(description) {
    const lowerDesc = description.toLowerCase();
    const bg = document.body;

    // Remove any existing background class
    bg.classList.remove("sunny-bg", "rainy-bg", "cloudy-bg", "snowy-bg", "night-bg");

    // Apply new one based on description
    if (lowerDesc.includes("clear")) bg.classList.add("sunny-bg");
    else if (lowerDesc.includes("rain")) bg.classList.add("rainy-bg");
    else if (lowerDesc.includes("cloud")) bg.classList.add("cloudy-bg");
    else if (lowerDesc.includes("snow")) bg.classList.add("snowy-bg");
    else if (lowerDesc.includes("night")) bg.classList.add("night-bg");
    else bg.classList.add("sunny-bg"); // fallback default
}



        // Search Weather Function
     async function searchWeather(city) {
    loading.style.display = 'flex';
    weatherCard.classList.add('hidden');
    forecastSection.classList.add('hidden');

    const apiKey = 'fa331705614af40576717d024dd037a0'; 

    try {
        // Current Weather
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const weatherData = await weatherRes.json();

        if (weatherData.cod !== 200) throw new Error(weatherData.message);

        const weatherInfo = {
            city: weatherData.name,
            temp: Math.round(weatherData.main.temp),
            description: weatherData.weather[0].description,
            windSpeed: weatherData.wind.speed,
            humidity: weatherData.main.humidity,
            sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(),
            sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()
        };

        displayWeather(weatherInfo);
        updateBackground(weatherInfo.description);

        // 5-Day Forecast
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        const forecastData = await forecastRes.json();

        const daily = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
        displayForecast(daily);

        forecastSection.classList.remove('hidden');

    } catch (error) {
        alert("Weather data error: " + error.message);
    } finally {
        loading.style.display = 'none';
    }
}


        // Display Weather Function
        function displayWeather(data) {
            weatherIcon.textContent = weatherIcons[data.description.toLowerCase()] || '☀️';
            weatherTemp.textContent = `${data.temp}°C`;
            weatherCity.textContent = data.city;
            weatherDesc.textContent = data.description;
            windSpeed.textContent = `${data.windSpeed} km/h`;
            humidity.textContent = `${data.humidity}%`;
            sunrise.textContent = data.sunrise;
            sunset.textContent = data.sunset;

            weatherCard.classList.remove('hidden');
            weatherCard.style.animation = 'zoomIn 0.8s ease-out';
        }


        // Display Forecast Function
       function displayForecast(dataList) {
    forecastGrid.innerHTML = '';
    dataList.slice(0, 5).forEach((item, index) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString(undefined, { weekday: 'long' });
        const tempMin = Math.round(item.main.temp_min);
        const tempMax = Math.round(item.main.temp_max);
        const desc = item.weather[0].description;
        const icon = weatherIcons[desc.toLowerCase()] || '☀️';

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;

        card.innerHTML = `
            <div class="forecast-day">${day}</div>
            <div class="forecast-icon">${icon}</div>
            <div class="forecast-temp">${tempMax}° / ${tempMin}°</div>
            <div class="forecast-desc">${desc}</div>
        `;

        forecastGrid.appendChild(card);
    });
}
document.addEventListener('DOMContentLoaded', function () {
    searchWeather('delhi');
});
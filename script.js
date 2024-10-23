const apiKey = 'befd984de4d3c050671d4eb935e6c660';
let isCelsius = true;
let lastWeatherData = null; // Store the last fetched weather data

// Load last searched city from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedCity = localStorage.getItem('lastCity');
    if (savedCity) {
        document.getElementById('city').value = savedCity;
        fetchWeather(savedCity); // Automatically fetch weather for last city
    }
});

// Function to get weather by city
async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city name.');
        return;
    }
    localStorage.setItem('lastCity', city); // Save last searched city
    await fetchWeather(city);
}

// Function to get weather by location (geolocation)
async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            await fetchWeatherByCoords(lat, lon);
        }, () => {
            alert('Unable to retrieve your location. Please enter a city name.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Fetch weather data for a city
async function fetchWeather(city) {
    const unit = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    await fetchWeatherData(url);
}

// Fetch weather data for coordinates
async function fetchWeatherByCoords(lat, lon) {
    const unit = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
    await fetchWeatherData(url);
}

// Fetch weather data from API
async function fetchWeatherData(url) {
    const loadingElement = document.getElementById('loading');
    const weatherContainer = document.getElementById('weather-container');
    const errorMessage = document.getElementById('error-message');

    loadingElement.style.display = 'flex'; // Show loader
    weatherContainer.style.display = 'none'; // Hide weather info
    errorMessage.style.display = 'none'; // Hide error message

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        lastWeatherData = data; // Store data for later reference
        displayWeather(data);
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block'; // Show error message
    } finally {
        loadingElement.style.display = 'none'; // Hide loader
    }
}

// Display weather data on the page
function displayWeather(data) {
    const cityName = document.getElementById('city-name');
    const temperature = document.getElementById('temperature');
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    const weatherIcon = document.getElementById('weather-icon');
    const weatherContainer = document.getElementById('weather-container');

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°${isCelsius ? 'C' : 'F'}`;
    feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°${isCelsius ? 'C' : 'F'}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} ${isCelsius ? 'm/s' : 'mph'}`;
    sunrise.textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    sunset.textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    weatherContainer.style.display = 'block'; // Show weather info
}

// Toggle between Celsius and Fahrenheit
function toggleUnit() {
    isCelsius = !isCelsius; // Toggle the unit
    const unitLabel = document.querySelector('.toggle-container .toggle-label:nth-child(1)');
    unitLabel.textContent = isCelsius ? 'Celsius' : 'Fahrenheit';
    if (lastWeatherData) {
        displayWeather(lastWeatherData); // Re-display the weather with new unit
    }   
}

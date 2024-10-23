const apiKey = 'befd984de4d3c050671d4eb935e6c660';
let isCelsius = true;
let lastWeatherData = null; // Store the last fetched weather data

// Function to get weather by city
async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city name.');
        return;
    }
    await fetchWeather(city);
}

// Function to get weather by location (geolocation)
async function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            await fetchWeatherByCoords(lat, lon);
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

    // Reset UI elements
    weatherContainer.style.display = 'none';
    errorMessage.style.display = 'none';
    loadingElement.style.display = 'block';

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            lastWeatherData = data; // Store the fetched weather data
            displayWeatherData(data);
            updateBackground(data.weather[0].main); // Dynamically change background
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.innerText = `Error: ${error.message}`;
    } finally {
        loadingElement.style.display = 'none';
    }
}

// Display the weather data
function displayWeatherData(data) {
    document.getElementById('city-name').innerText = data.name;
    document.getElementById('temperature').innerText = `${data.main.temp}°${isCelsius ? 'C' : 'F'}`;
    document.getElementById('feels-like').innerText = `Feels like: ${data.main.feels_like}°${isCelsius ? 'C' : 'F'}`;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind.speed} ${isCelsius ? 'm/s' : 'mph'}`;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    document.getElementById('sunrise').innerText = `Sunrise: ${sunrise}`;
    document.getElementById('sunset').innerText = `Sunset: ${sunset}`;

    document.getElementById('weather-container').style.display = 'block';
}

// Update background based on weather condition
function updateBackground(weather) {
    const appContainer = document.querySelector('.app-container');
    let bgUrl = 'default-bg.jpg';

    switch (weather.toLowerCase()) {
        case 'clear':
            bgUrl = 'sunny.jpg';
            break;
        case 'clouds':
            bgUrl = 'cloudy.jpg';
            break;
        case 'rain':
            bgUrl = 'rainy.jpg';
            break;
        case 'snow':
            bgUrl = 'snowy.jpg';
            break;
    }

    appContainer.style.background = `url('${bgUrl}') no-repeat center center/cover`;
}

// Toggle between Celsius and Fahrenheit
function toggleUnit() {
    isCelsius = !isCelsius;
    if (lastWeatherData) {
        // Update the display based on the last fetched weather data
        displayWeatherData(lastWeatherData);
    } else {
        alert('No weather data available. Please search for a city first.');
    }
}

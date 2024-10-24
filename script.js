const apiKey = 'befd984de4d3c050671d4eb935e6c660';
let isCelsius = true;
let lastWeatherData = null; // Store the last fetched weather data

// Load last searched city from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedCity = localStorage.getItem('lastCity');
    if (savedCity) {
        document.getElementById('city').value = savedCity;
        getWeather(savedCity); // Fetch weather for the last searched city
    }
});

// Fetch weather data based on city name
function getWeather(city) {
    const loading = document.getElementById('loading');
    const weatherContainer = document.getElementById('weather-container');
    const errorMessage = document.getElementById('error-message');
    
    // Show loading indicator
    loading.style.display = 'flex';
    weatherContainer.style.display = 'none';
    errorMessage.style.display = 'none';

    const cityInput = document.getElementById('city');
    if (!city) city = cityInput.value.trim();
    
    if (city) {
        localStorage.setItem('lastCity', city); // Save last searched city
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                lastWeatherData = data; // Store the fetched data
                displayWeather(data);
                loading.style.display = 'none'; // Hide loading indicator
            })
            .catch(error => {
                loading.style.display = 'none'; // Hide loading indicator
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block'; // Show error message
            });
    } else {
        loading.style.display = 'none'; // Hide loading if no city is entered
    }
}

// Display weather data
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
    windSpeed.textContent = `Wind Speed: ${Math.round(data.wind.speed)} ${isCelsius ? 'm/s' : 'mph'}`;
    sunrise.textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    sunset.textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;

    // Set weather icon
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    // Change background image based on weather conditions
    changeBackground(data.weather[0].main);

    weatherContainer.style.display = 'block'; // Show weather container
}

// Change background and font color based on weather conditions
function changeBackground(condition) {
    const body = document.body;
    const cityTitle = document.querySelector('.city-title');
    const temperature = document.querySelector('.temperature');
    const weatherDetails = document.querySelector('.weather-details');

    console.log("Weather Condition: ", condition);

    const styles = {
        clear: {
            backgroundImage: "url('./images/clear.jpg')",
            titleColor: '#4A90E2',    
            tempColor: '#4A90E2',
            detailsColor: '#2C3E50'   
        },
        sunny: {
            backgroundImage: "url('./images/clear.jpg')",
            titleColor: '#FF9800',   
            tempColor: '#FF9800',
            detailsColor: '#333333'  
        },
        clouds: {
            backgroundImage: "url('./images/cloudy.jpg')",
            titleColor: '#3C493F',    
            tempColor: '#3C493F',
            detailsColor: '#2E2E2E'   
        },
        rain: {
            backgroundImage: "url('./images/rainy.jpg')",
            titleColor: '#6FFFE9',   
            tempColor: '#6FFFE9',
            detailsColor: '#C2FBEF'  
        },
        snow: {
            backgroundImage: "url('./images/snow.jpg')",
            titleColor: '#81D4FA',   
            tempColor: '#81D4FA',
            detailsColor: '#263238'   
        },
        mist: {
            backgroundImage: "url('./images/haze.jpg')",
            titleColor: '#B0BEC5',    
            tempColor: '#B0BEC5',
            detailsColor: '#37474F'   
        },
        thunderstorm: {
            backgroundImage: "url('./images/thunderstorm.jpg')",
            titleColor: '#FF7043',   
            tempColor: '#FF7043',
            detailsColor: '#FAFAFA'   
        },
        default: {
            backgroundImage: "url('./images/default.jpg')",
            titleColor: '#9E9E9E',    
            tempColor: '#9E9E9E',
            detailsColor: '#4e4e4e'   
        }
    };

    // Normalize condition for consistent matching
    const weatherStyle = styles[condition.toLowerCase()] || styles['default'];

    // Apply styles
    body.style.backgroundImage = weatherStyle.backgroundImage;
    cityTitle.style.color = weatherStyle.titleColor;
    temperature.style.color = weatherStyle.tempColor;
    weatherDetails.style.color = weatherStyle.detailsColor;
}
    
    // Normalize condition for consistent matching
    const weatherStyle = styles[condition.toLowerCase()] || styles.default;

    // Apply styles
    body.style.backgroundImage = weatherStyle.backgroundImage;
    cityTitle.style.color = weatherStyle.titleColor;
    temperature.style.color = weatherStyle.tempColor;
    weatherDetails.style.color = weatherStyle.detailsColor;
}


// Get weather by user location
function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${isCelsius ? 'metric' : 'imperial'}`;
            fetch(url)
                .then(response => response.json())
                .then(data => displayWeather(data))
                .catch(error => console.error('Error fetching location weather:', error));
        }, error => {
            console.error('Geolocation error:', error);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Toggle temperature unit
function toggleUnit() {
    isCelsius = !isCelsius; // Switch the unit
    if (lastWeatherData) {
        displayWeather(lastWeatherData); 
    } else {
        const cityInput = document.getElementById('city').value;
        if (cityInput) {
            getWeather(cityInput); 
        }
    }
}

// Fetch suggestions
function fetchSuggestions() {
    const suggestionsContainer = document.getElementById('suggestions');
    const cityInput = document.getElementById('city').value.trim();

    
   // const staticSuggestions = ['kozhikode', 'kollam', 'kottakkal', 'meppadi', 'vytilla'];
    const filteredSuggestions = staticSuggestions.filter(city => city.toLowerCase().startsWith(cityInput.toLowerCase()));

    if (filteredSuggestions.length > 0) {
        suggestionsContainer.innerHTML = filteredSuggestions.map(city => `<div class="suggestion-item" onclick="selectSuggestion('${city}')">${city}</div>`).join('');
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

// Select suggestion
function selectSuggestion(city) {
    document.getElementById('city').value = city;
    document.getElementById('suggestions').style.display = 'none';
    getWeather(city); // Fetch weather for the selected suggestion
}

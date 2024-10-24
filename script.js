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
            titleColor: '#8C9EFF',   
            tempColor: '#8C9EFF',    
            detailsColor: '#333333'  
        },
        sunny: {
            backgroundImage: "url('./images/sunny.jpg')",
            titleColor: '#FFC107',   
            tempColor: '#FFC107',
            detailsColor: '#4A4A4A'  
        },
        clouds: {
            backgroundImage: "url('./images/cloudy.jpg')",
            titleColor: '#90A4AE',    
            tempColor: '#90A4AE',
            detailsColor: '#505050'   
        },
        rain: {
            backgroundImage: "url('./images/rainy.jpg')",
            titleColor: '#5C6BC0',    
            tempColor: '#5C6BC0',
            detailsColor: '#d3d3d3'  
        },
        snow: {
            backgroundImage: "url('./images/snowy.jpg')",
            titleColor: '#B3E5FC',    
            tempColor: '#B3E5FC',
            detailsColor: '#2e2e2e'   
        },
        mist: {
            backgroundImage: "url('./images/misty.jpg')",
            titleColor: '#B0BEC5',    
            tempColor: '#B0BEC5',
            detailsColor: '#555555'   
        },
        thunderstorm: {
            backgroundImage: "url('./images/thunderstorm.jpg')",
            titleColor: '#FF7043',   
            tempColor: '#FF7043',
            detailsColor: '#ffffff'   
        },
        default: {
            backgroundImage: "url('./images/default.jpg')",
            titleColor: '#9E9E9E',    
            tempColor: '#9E9E9E',
            detailsColor: '#4e4e4e'  
        }
    };

    // Apply the styles based on the current condition or default
    const weatherStyle = styles[condition] || styles['default'];
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
    const cityInput = document.getElementById('city').value;
    if (cityInput) {
        getWeather(cityInput); // Fetch weather again for the current city
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

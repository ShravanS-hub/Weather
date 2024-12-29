let weather = {
    apikey: "dca8ae3a6195965895aec5de78548c85",
    fetchWeather: function (city) {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apikey}`
        )
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },
    fetchWeatherByCoordinates: function (lat, lon) {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apikey}`
        )
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },
    fetchForecast: function (city) {
        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apikey}`
        )
            .then((response) => response.json())
            .then((data) => this.displayForecast(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${name}')`;
    },
    displayForecast: function (data) {
        const forecastElement = document.querySelector(".forecast");
        forecastElement.innerHTML = "";
    
        // Create a map to store only one forecast per day
        const dailyForecast = {};
    
        // Loop through the list of forecasts provided by the API
        data.list.forEach((forecast) => {
            const date = new Date(forecast.dt_txt);
            const day = date.toISOString().split("T")[0]; // Extract only the date (YYYY-MM-DD)
    
            // If there's no entry for this day yet, add it
            if (!dailyForecast[day] && date.getHours() === 12) { // Use the forecast for 12:00 PM
                dailyForecast[day] = forecast;
            }
        });
    
        // Render the filtered daily forecast
        Object.keys(dailyForecast).slice(0, 7).forEach((key) => {
            const forecast = dailyForecast[key];
            const { dt_txt } = forecast;
            const { icon } = forecast.weather[0];
            const { temp } = forecast.main;
    
            // Format the date for display
            const options = { weekday: "short", day: "numeric", month: "short" };
            const formattedDate = new Date(dt_txt).toLocaleDateString(undefined, options);
    
            // Add forecast to the DOM
            forecastElement.innerHTML += `
                <div class="forecast-item">
                    <div>${formattedDate}</div>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Icon">
                    <div>${temp.toFixed(1)}°C</div>
                </div>
            `;
        });
    }
    
    ,
    search: function () {
        const city = document.querySelector(".search-bar").value;
        if (!city) {
            alert("Please enter a city name.");
            return;
        }
        this.fetchWeather(city);
        this.fetchForecast(city);
    },
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        weather.search();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                weather.fetchWeatherByCoordinates(latitude, longitude);
            },
            () => {
                weather.fetchWeather("New York");
                weather.fetchForecast("New York");
            }
        );
    } else {
        weather.fetchWeather("New York");
        weather.fetchForecast("New York");
    }
});

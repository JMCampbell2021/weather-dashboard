const cities = [];
const citySearch = document.querySelector("#city-search");
const cityInput = document.querySelector("#city");
const weatherContainer = document.querySelector("#current-weather-container");
const citySearchInput = document.querySelector("#searched-city");
const fivedayForcast = document.querySelector("#fiveday");
const pastSearchBtn = document.querySelector("#past-search");
const clearEl = document.getElementById("clear-history");
const forecastT = document.querySelector("#forecast");

formSumbitHandler = (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInput.value = "";
    } else{
        alert("Search is empty. Please enter a City");
    }
    saveSearch();
    pastSearch(city);
}

saveSearch = ()=>{
    localStorage.setItem("cities", JSON.stringify(cities));
};

getCityWeather = (city) => {
    const apiKey = "941f4c56b7c9c603588882d255f6a98a"

    const apiURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid="+apiKey;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

getUvIndex = (lat,lon) =>{
    const apiKey = "941f4c56b7c9c603588882d255f6a98a"
    const apiURL = "https://api.openweathermap.org/data/2.5/uvi?appid="+apiKey+"&lat="+lat+"&lon="+lon;
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
};

get5Day = (city) => {
    var apiKey = "941f4c56b7c9c603588882d255f6a98a"
    var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial&appid="+apiKey;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

//Display weather after search
const displayWeather = (weather, searchCity) => {
   weatherContainer.textContent= "";  
   citySearchInput.textContent=searchCity;

   const currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   citySearchInput.appendChild(currentDate);


   const weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/"+ weather.weather[0].icon + "@2x.png");
   citySearchInput.appendChild(weatherIcon);


   const tempEl = document.createElement("span");
   tempEl.textContent = "Temperature: " + weather.main.temp + " °F";
   
  
   const humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   
   const  windSpeed = document.createElement("span");
   windSpeed.textContent = "Wind Speed: " + weather.wind.speed + " MPH";

   weatherContainer.appendChild(tempEl);
   weatherContainer.appendChild(humidityEl);
   weatherContainer.appendChild(windSpeed);

   const lat =weather.coord.lat;
   const lon = weather.coord.lon;
   getUvIndex(lat,lon)
}

//UV Index display with color 
displayUvIndex = (index) => {
    const uvIndex = document.createElement("div");
    uvIndex.textContent = "UV Index: "
    uvIndex.classList = "pb-3"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "badge badge-success"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "badge badge-warning"
    }
    else if(index.value >8){
        uvIndexValue.classList = "badge badge-danger"
    };

    uvIndex.appendChild(uvIndexValue);
    weatherContainer.appendChild(uvIndex);
}

//display 5-day forcast
display5Day = (weather) => {
    fivedayForcast.textContent = "";
    forecastT.textContent = "5-Day Forecast:";

    const forecast = weather.list;
        for(let i=5; i < forecast.length; i=i+8){
       let dailyForecast = forecast[i];
        
       let foreCast=document.createElement("div");
       foreCast.classList = "d-flex flex-row card text-white bg-primary mb-3 text-white m-2 rounded";

       let forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM DD,YYYY");
       forecastDate.classList = "col-3 text-center"
       foreCast.appendChild(forecastDate);

       let weatherIcon = document.createElement("img")
       weatherIcon.classList = "col-3 text-center";
       weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/"+dailyForecast.weather[0].icon+"@2x.png"); 
       foreCast.appendChild(weatherIcon);
       
       let forecastTempEl = document.createElement("div");
       forecastTempEl.classList = "col-3 text-center";
       forecastTempEl.textContent = "Temperture: " + dailyForecast.main.temp + "°F";
       foreCast.appendChild(forecastTempEl);

       let forecastHumEl = document.createElement("div");
       forecastHumEl.classList = "col-3 text-wrap";
       forecastHumEl.textContent ="Humidity: " + dailyForecast.main.humidity + " %";

       foreCast.appendChild(forecastHumEl);
       fivedayForcast.appendChild(foreCast);
    }

}

//Past City Search
pastSearch = (pastSearch) => {
    let pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 mb-2 bg-primary text-white m-2 rounded";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");
    pastSearchBtn.prepend(pastSearchEl);
}

pastSearchHandler = (event) =>{
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}


citySearch.addEventListener("submit", formSumbitHandler);
pastSearchBtn.addEventListener("click", pastSearchHandler);
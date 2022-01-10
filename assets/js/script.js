var cities = [];
var citySearch=document.querySelector("#city-search");
var cityInput=document.querySelector("#city");
var weatherContainer=document.querySelector("#current-weather-container");
var citySearchInput = document.querySelector("#searched-city");
var fivedayForcast = document.querySelector("#fiveday");
var pastSearchBtn = document.querySelector("#past-search");
var clearEl = document.getElementById("clear-history");

var formSumbitHandler = function(event){
    event.preventDefault();
    var city = cityInput.value.trim();
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

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city){
    var apiKey = "941f4c56b7c9c603588882d255f6a98a"

    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=" + apiKey;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

var getUvIndex = function(lat,lon){
    var apiKey = "941f4c56b7c9c603588882d255f6a98a"
    var apiURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" +apiKey+ "&lat=" +lat + "&lon=" +lon;
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
};

var get5Day = function(city){
    var apiKey = "941f4c56b7c9c603588882d255f6a98a"
    var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=" +city+ "&units=imperial&appid=" +apiKey;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

//Display weather after search
var displayWeather = function(weather, searchCity){
   weatherContainer.textContent= "";  
   citySearchInput.textContent=searchCity;

   var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   citySearchInput.appendChild(currentDate);


   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/"+ weather.weather[0].icon + "@2x.png");
   citySearchInput.appendChild(weatherIcon);


   var tempEl = document.createElement("span");
   tempEl.textContent = "Temperature: " + weather.main.temp + " °F";
   
  
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   
   var windSpeed = document.createElement("span");
   windSpeed.textContent = "Wind Speed: " + weather.wind.speed + " MPH";

   weatherContainer.appendChild(tempEl);
   weatherContainer.appendChild(humidityEl);
   weatherContainer.appendChild(windSpeed);

   var lat =weather.coord.lat;
   var lon = weather.coord.lon;
   getUvIndex(lat,lon)
}

//UV Index display with color 
var displayUvIndex = function(index){
    var uvIndex = document.createElement("div");
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
var display5Day = function(weather){
    fivedayForcast.textContent = "";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       var foreCast=document.createElement("div");
       foreCast.classList = "d-flex flex-row card text-white bg-primary mb-3 text-white m-2 rounded";

       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM DD,YYYY");
       forecastDate.classList = "col-3 text-center"
       foreCast.appendChild(forecastDate);

       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "col-3 text-center";
       weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/"+dailyForecast.weather[0].icon+"@2x.png"); 
       foreCast.appendChild(weatherIcon);
       
       var forecastTempEl=document.createElement("div");
       forecastTempEl.classList = "col-3 text-center";
       forecastTempEl.textContent = "Temperture: " + dailyForecast.main.temp + " °F";
       foreCast.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("div");
       forecastHumEl.classList = "col-3 text-wrap";
       forecastHumEl.textContent ="Humidity: " + dailyForecast.main.humidity + " %";

       foreCast.appendChild(forecastHumEl);
       fivedayForcast.appendChild(foreCast);
    }

}

//Past City Search
var pastSearch = function(pastSearch){
    var pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 mb-2 bg-primary text-white m-2 rounded";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");
    pastSearchBtn.prepend(pastSearchEl);
}

var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}


citySearch.addEventListener("submit", formSumbitHandler);
pastSearchBtn.addEventListener("click", pastSearchHandler);
var cityEl = document.getElementById("city");
var searchEl = document.getElementById("search-btn");
var clearHistory = document.getElementById("clear-btn");
var cityHistory = document.getElementById("city-history");
var currentWeather = document.getElementById("current-weather");
var cityName = document.getElementById("city-name");
var weatherPic = document.getElementById("weather-pic");
var currentTemp = document.getElementById("temp");
var currentWindSpeed = document.getElementById("wind-speed");
var currentHumidity = document.getElementById("humidity");
var currentUVIndex = document.getElementById("index");
var fiveDay = document.getElementById("fiveday");
var cityHistory = JSON.parse(localStorage.getItem("search")) || [];
var weatherAPIKey ="14fdde9a48764c9224278cdcd6a22f3f";
  
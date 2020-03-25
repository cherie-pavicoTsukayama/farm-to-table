var marketPlaceData = null;
var userZip = null;
var weatherData = null;
var allWeatherData = null;
var marketId = null;
var marketDetails = null;

function getMarketResults(zip) {
    userZip = zip;
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
        dataType: 'jsonp',
        success: displayMarketData,
        error: console.error
    });
}

function getWeather(userZip) {
    $.ajax({
        method: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?zip=" + userZip + "&appid=762a2b6309b12de4fe77c3fb7fb27b5f",
        success: displayWeather,
        error: console.error
    })
}

function displayMarketData(data) {
    marketPlaceData = data.results;
    for (var i = 0; i < data.results.length; i++) {
        var div = document.createElement('div');
        div.textContent = data.results[i].marketname;
        document.body.appendChild(div)
    }
    getWeather(userZip);
}

function displayWeather(data) {
    allWeatherData = data;
    weatherData = data.weather[0];
    console.log(weatherData);
    console.log(allWeatherData);
    // .weather.main;
    // var div = document.createElement('div');
    // div.textContent = data.weather.main;
    // document.body.appendChild(div);
}

function getMarketDetails(id){
    $.ajax({
        method: "GET",
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id,
        dataType: 'jsonp',
        success: displayMarketDetails,
        error: console.error
    })
}



function displayMarketDetails(id){
    marketDetails = id;
    var div = document.createElement('div');
    div.textContent = marketDetails.marketdetails.address;
    document.body.appendChild(div);
}

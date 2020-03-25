var marketPlaceData = null;
var userZip = null;
var weatherData = null;
var allWeatherData = null;
var marketId = null;
var marketDetails = null;
var findMarketButton = document.getElementById('findMarket');
findMarketButton.addEventListener('click', getZipCode);


function getMarketResults(userZip) {
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
}

function displayWeather(data) {
    allWeatherData = data;
    weatherData = data.weather[0];
    console.log(weatherData);
    console.log("all Weather Datat:", allWeatherData);
    var weatherIcon = weatherData.icon;
    var weatherIconDiv = document.getElementById('weather');
    var image = document.createElement('img');
    image.setAttribute('src', "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
    weatherIconDiv.children[0].appendChild(image);
    var tempMinKelvin = allWeatherData.main.temp_min;
    var tempLowF = convertToFahrenheit(tempMinKelvin)
    var tempHighKelvin = allWeatherData.main.temp_max;
    var tempHighF = convertToFahrenheit(tempHighKelvin)
    weatherIconDiv.children[1].firstChild.textContent = "High " + tempHighF + "/" + "Low" + tempLowF;
    weatherIconDiv.children[2].firstChild.textContent = "Humidity: " + allWeatherData.main.humidity;
    weatherIconDiv.children[3].firstChild.textContent = allWeatherData.name;

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

// function eventListenters(){


function getZipCode(event){
    event.preventDefault();
    userZip = document.getElementById('zip').value;
    if(/^\d{5}(-\d{4})?$/.test(userZip) === false){
        alert("Please Enter Zip Code");
        return;
    }
    console.log("findMarket clicked:", userZip);
    getWeather(userZip);
}

function convertToFahrenheit(kelvin){
    return Math.round((kelvin - 273.15) * 9 / 5 + 32);

}

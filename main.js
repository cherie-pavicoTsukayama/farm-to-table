var marketPlaceData = null;
var userZip = null;
var weatherData = null;
var allWeatherData = null;
var marketId = null;
var marketDetails = null;
var findMarketButton = document.getElementById('findMarket');
findMarketButton.addEventListener('click', getZipCode);


function getMarketResults() {
    var zipNum = parseInt(userZip);
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zipNum,
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
    var marketId = null;
    console.log("displayMarketData", marketPlaceData);

    var marketName = null;

    for (var i = 0; i < marketPlaceData.length; i++) {
        marketName = marketPlaceData[i].marketname;
        var marketNameOnly = marketName.slice(4);
        var distance = marketName.slice(0, 3);
        var farmersMarketList = document.getElementById('farmersMarketList');
        var singleMarketContainer = document.createElement('div')
        singleMarketContainer.setAttribute('class', 'd-felx');
        var distanceDiv = document.createElement('div');
        distanceDiv.setAttribute('class', 'distance col-3')
        var distanceText = document.createElement('p');
        distanceText.textContent = distance;
        distanceDiv.appendChild(distanceText);

        singleMarketContainer.appendChild(distanceDiv);
        farmersMarketList.appendChild(singleMarketContainer);


        // marketId = marketPlaceData[i].id;
        // getMarketDetails(marketId)
        // console.log("market Id:", marketId)
        // var div = document.createElement('div');
        // div.setAttribute('class', "container col")
        // div.textContent = data.results[i].marketname;
        // document.body.appendChild(div)
    }
}

function displayWeather(data) {
    allWeatherData = data;
    weatherData = data.weather[0];
    console.log(weatherData);
    console.log("all Weather Datat:", allWeatherData);
    var weatherIcon = weatherData.icon;
    var weatherIconDiv = document.getElementById('weather');
    weatherIconDiv.children[0].firstElementChild.setAttribute("class", "icon-div  col-12 weather-icon-" + weatherIcon);
    weatherIconDiv.children[0].lastElementChild.textContent = weatherData.description;
    var tempMinKelvin = allWeatherData.main.temp_min;
    var tempLowF = convertToFahrenheit(tempMinKelvin)
    var tempHighKelvin = allWeatherData.main.temp_max;
    var tempHighF = convertToFahrenheit(tempHighKelvin)
    weatherIconDiv.children[1].firstElementChild.textContent = "High " + tempHighF + "/" + "Low" + tempLowF;
    weatherIconDiv.children[2].firstElementChild.textContent = "Humidity: " + allWeatherData.main.humidity;
    weatherIconDiv.children[3].firstElementChild.textContent = allWeatherData.name;

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


function displayMarketDetails(singleMarketDetail){
    console.log(singleMarketDetail)
    // marketDetails = id;
    // var div = document.createElement('div');
    // div.textContent = marketDetails.marketdetails.address;
    // document.body.appendChild(div);
}

function getZipCode(event){
    event.preventDefault();
    userZip = document.getElementById('zip').value;
    if(/^\d{5}(-\d{4})?$/.test(userZip) === false){
        alert("Please Enter Zip Code");
        return;
    }
    console.log("findMarket clicked:", userZip);
    getWeather(userZip);
    getMarketResults();
}

function convertToFahrenheit(kelvin){
    return Math.round((kelvin - 273.15) * 9 / 5 + 32);

}

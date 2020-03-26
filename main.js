var marketPlaceData = null;
var userZip = null;
var weatherData = null;
var allWeatherData = null;
var marketId = null;
var marketDetails = null;
var findMarketButton = document.getElementById('findMarket');
findMarketButton.addEventListener('click',getZipCode);


function getMarketResults() {
    userZip = parseInt(userZip);
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + userZip,
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

    var marketName = null;
    var marketInfo = document.getElementsByClassName('market-info');

    for (var i = 0; i < marketPlaceData.length; i++) {
        var classList = ['market-name', 'address', 'schedule', 'products']
        marketId = marketPlaceData[i].id;
        marketName = marketPlaceData[i].marketname;
        var marketNameOnly = marketName.slice(4);
        var distance = marketName.slice(0, 3);
        var farmersMarketList = document.getElementById('farmersMarketList');
        var singleMarketContainer = document.createElement('div')
        singleMarketContainer.setAttribute('class', 'd-flex flex-wrap');
        var distanceDiv = document.createElement('div');
        distanceDiv.setAttribute('class', 'distance d-flex justify-content-center col-2')
        var distanceText = document.createElement('p');
        distanceText.textContent = distance;
        distanceDiv.appendChild(distanceText);
        var marketInfoDiv = document.createElement('div');
        marketInfoDiv.setAttribute('class', 'market-info col-9');
        for (var list = 0; list < classList.length; list++) {
            var marketDetailDiv = document.createElement('div');
            marketDetailDiv.setAttribute('class', classList[list]);
            var marketDetailP = document.createElement('p');
            marketDetailDiv.appendChild(marketDetailP);
            marketInfoDiv.appendChild(marketDetailDiv);
        }
        singleMarketContainer.appendChild(distanceDiv);
        farmersMarketList.appendChild(singleMarketContainer);
        singleMarketContainer.appendChild(marketInfoDiv)
        marketInfo[i].children[0].firstElementChild.textContent = marketNameOnly;
        getMarketDetails(marketId,i);
    }
    // getMarketDetails(marketId);
    // marketInfo[i].children[1].firstElementChild.textContent = marketDetails.marketdetails.Address;
    // marketInfo[i].children[2].firstElementChild.textContent = marketDetails.marketdetails.Schedule;
    // marketInfo[i].children[3].firstElementChild.textContent = marketDetails.marketdetails.Products;

}

function displayWeather(data) {
    allWeatherData = data;
    weatherData = data.weather[0];
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

function getMarketDetails(id, iterationNum){
    $.ajax({
        method: "GET",
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id,
        dataType: 'jsonp',
        success: function(singleMarketDetail){
            displayMarketDetails(singleMarketDetail, iterationNum)},
        error: console.error
    })
}


function displayMarketDetails(singleMarketDetail, i){
    marketDetails = singleMarketDetail;
    var farmersMarketList = document.getElementById('farmersMarketList');
    farmersMarketList.children[i].children[1].children[1].textContent = marketDetails.marketdetails.Address;
    farmersMarketList.children[i].children[1].children[2].textContent = marketDetails.marketdetails.Schedule;
    farmersMarketList.children[i].children[1].children[2].textContent = marketDetails.marketdetails.Products;

}


function getZipCode(event){
    event.preventDefault();
    userZip = document.getElementById('zip').value;
    if(/^\d{5}(-\d{4})?$/.test(userZip) === false){
        alert("Please Enter Zip Code");
        return;
    }

    getWeather(userZip);
    getMarketResults();
    document.querySelector('form').reset();
}

function convertToFahrenheit(kelvin){
    return Math.round((kelvin - 273.15) * 9 / 5 + 32);

}

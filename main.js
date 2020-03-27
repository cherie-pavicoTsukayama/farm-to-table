var marketPlaceData = null;
var userZip = null;
var weatherData = null;
var allWeatherData = null;
var marketId = null;
var marketDetails = null;
var findMarketButton = document.getElementById('findMarket');
findMarketButton.addEventListener('click', getZipCode);


function getMarketResults() {
    userZip = parseInt(userZip);
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch",
        data: {
            zip: userZip
        },
        dataType: 'jsonp',
        success: displayMarketData,
        error: console.error
    });
}

function getWeather(userZip) {
    $.ajax({
        method: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather",
        data: {
            zip: userZip,
            appid: "762a2b6309b12de4fe77c3fb7fb27b5f",
        },
        success: displayWeather,
        error: console.error
    })
}

function displayMarketData(data) {
    marketPlaceData = data.results;
    var marketName = null;
    var marketInfo = document.getElementsByClassName('market-info');

    for (var i = 0; i < marketPlaceData.length; i++) {
        var classList = ['market-name font-weight-bold', 'address', 'schedule', 'products']
        marketId = marketPlaceData[i].id;
        marketName = marketPlaceData[i].marketname;
        var marketNameOnly = marketName.slice(4);
        var distance = marketName.slice(0, 3);
        var farmersMarketList = document.getElementById('farmersMarketList');
        var singleMarketContainer = document.createElement('div')
        singleMarketContainer.setAttribute('class', 'd-flex flex-wrap mb-5 col-xs-12 col-md-12 col-lg-12 justify-content-center');
        var distanceDiv = document.createElement('div');
        distanceDiv.setAttribute('class', 'distance d-flex justify-content-center align-content-center col-2 distance-style white accent-color pt-2 pb-2')
        var distanceText = document.createElement('h4');
        distanceText.setAttribute('class', 'align-self-center m-0')
        distanceText.textContent = distance + ' mi';
        distanceDiv.appendChild(distanceText);
        var marketInfoDiv = document.createElement('div');
        marketInfoDiv.setAttribute('class', 'market-info col-9 pt-2 pb-2');
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
        getMarketDetails(marketId, i);
    }

}

function displayWeather(data) {
    makeWeatherSection();
    allWeatherData = data;
    weatherData = data.weather[0];
    var weatherIcon = weatherData.icon;
    var weatherIconDiv = document.getElementById('weather');
    weatherIconDiv.children[0].firstElementChild.setAttribute("class", "icon-div  col-12 weather-icon-" + weatherIcon);
    weatherIconDiv.children[0].lastElementChild.textContent = weatherData.description;
    var tempMinKelvin = allWeatherData.main.temp_min;
    var tempLowF = convertToFahrenheit(tempMinKelvin);
    var tempHighKelvin = allWeatherData.main.temp_max;
    var tempHighF = convertToFahrenheit(tempHighKelvin);
    weatherIconDiv.classList.add("weather-container");
    weatherIconDiv.children[1].firstElementChild.textContent = "High " + tempHighF + "/" + "Low" + tempLowF;
    weatherIconDiv.children[1].classList.add('low-high');
    weatherIconDiv.children[2].firstElementChild.textContent = "Humidity: " + allWeatherData.main.humidity;
    weatherIconDiv.children[2].classList.add("humidity");
    weatherIconDiv.children[3].firstElementChild.textContent = allWeatherData.name;
}
function makeWeatherContainer(){
    var weatherContainer = document.createElement("div");
    weatherContainer.setAttribute('id', 'weather');
    weatherContainer.setAttribute('class', "container col-sm-5 col-md-8 col-lg-5 d-flex flex-wrap justify-content-around mt-3");
    return weatherContainer;
}
function makeWeatherSection() {
    var weatherSection = document.createElement("div");
    weatherSection.setAttribute('class', "container col-sm-5 col-md-8 col-lg-5 d-flex flex-wrap justify-content-around mt-3")

    var checkWeatherContainer = document.getElementById('weather')
    console.log("check weather container:", checkWeatherContainer);

    var weatherContainer = null;
    if (!checkWeatherContainer) {
        weatherContainer = makeWeatherContainer();
    } else {
        destroyWeatherContainer(checkWeatherContainer);
        weatherContainer = makeWeatherContainer();
    }


    var weatherIconContainer = document.createElement('div');
    weatherIconContainer.setAttribute('id', 'weatherIcon');
    weatherIconContainer.setAttribute('class', "d-flex flex-wrap justify-content-center col-12 mt-3");
    var weatherIcon = document.createElement('div');
    weatherIcon.setAttribute("class", "icon-div")
    var weatherIconDescription = document.createElement('div');
    weatherIconDescription.setAttribute('class', "white text-capitalize");
    weatherIconContainer.appendChild(weatherIcon);
    weatherIconContainer.appendChild(weatherIconDescription);
    weatherContainer.appendChild(weatherIconContainer);
    weatherSection.appendChild(weatherContainer);

    for (var i = 0; i < 2; i++){
        var temperatureContainer = document.createElement('div')
        temperatureContainer.setAttribute('class', "col-xl-5 font-weight-bold white d-flex justify-content-center pt-3 pb-3");
        var textInTempContainer = document.createElement('p');
        textInTempContainer.setAttribute("class", "align-self-center m-0")
        temperatureContainer.appendChild(textInTempContainer);
        weatherContainer.appendChild(temperatureContainer);
    }

    var locationContainer = document.createElement('div');
    locationContainer.setAttribute('class', 'col-12 text-center');
    var location = document.createElement('h2');
    location.setAttribute('class', 'mt-3 mb-3 white');

    locationContainer.appendChild(location);

    weatherContainer.appendChild(locationContainer);

    var section = document.querySelector('section');
    section.appendChild(weatherContainer);


}

function getMarketDetails(id, iterationNum) {
    $.ajax({
        method: "GET",
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail",
        dataType: 'jsonp',
        data: {
            id: id,
        },
        success: function (singleMarketDetail) {
            displayMarketDetails(singleMarketDetail, iterationNum)
        },
        error: console.error
    })
}


function displayMarketDetails(singleMarketDetail, i) {
    marketDetails = singleMarketDetail;
    var schedule = marketDetails.marketdetails.Schedule;
    var indexNum = schedule.indexOf(';')
    schedule = schedule.slice(0, indexNum);
    if (indexNum === -1){
        schedule =  " ";
    } else {
        schedule = schedule.slice(0, indexNum);
    }
    var farmersMarketList = document.getElementById('farmersMarketList');
    farmersMarketList.children[i].children[1].children[1].firstElementChild.textContent = marketDetails.marketdetails.Address;
    farmersMarketList.children[i].children[1].children[2].firstElementChild.textContent = schedule;
    farmersMarketList.children[i].children[1].children[3].firstElementChild.textContent = marketDetails.marketdetails.Products;

}


function getZipCode(event) {
    event.preventDefault();
    userZip = document.getElementById('zip').value;
    if (/^\d{5}(-\d{4})?$/.test(userZip) === false) {
        alert("Please Enter Zip Code");
        return;
    }
    getWeather(userZip);
    destroyFarmersMarketList();
    getMarketResults();
    document.querySelector('form').reset();
}

function convertToFahrenheit(kelvin) {
    return Math.round((kelvin - 273.15) * 9 / 5 + 32);
}

function destroyFarmersMarketList(){
    var farmersMarketList = document.getElementById('farmersMarketList');
    while(farmersMarketList.firstElementChild){
        farmersMarketList.firstElementChild.remove();
    }
}

function destroyWeatherContainer(element){
    element.remove();
}

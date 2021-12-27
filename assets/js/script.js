 

var fetchButton = document.getElementById("fetch-button");

function openWeatherApi() {
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=minutely&appid=b6170b33d7b8679161974696769e2bfb";

    fetch(requestUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
          
    })
    .catch(error => {
        console.log("error!");
        console.error(error);
    })
}

fetchButton.addEventListener('click', openWeatherApi);
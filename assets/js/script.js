var key =  "b6170b33d7b8679161974696769e2bfb";

var cityList =$("#city-list");
var cities = [];


var currentDay = new Date();
var todayDay = currentDay.toDateString();




start();


function start(){
    
    var storedCities = JSON.parse(localStorage.getItem("cities"));

  
    if (storedCities !== null) {
        cities = storedCities;
      }
   
    showCities();

}


function storeCities(){
  
  localStorage.setItem("cities", JSON.stringify(cities));
  console.log(localStorage);
}


function showCities() {
    
    cityList.empty();
    
    
    for (var i = 0; i < cities.length; i++) {
      var city = cities[i];
      
      var li = $("<li>").text(city);
      li.attr("id","listCity");
      li.attr("data-city", city);
      li.attr("class", "list-group-item");
      console.log(li);
      cityList.prepend(li);
    }
    
    if (!city){
        return
    } 
    else{
        getWeather(city)
    };
}   

  $("#add-city").on("click", function(event){
      event.preventDefault();

   
    var city = $("#city-input").val().trim();
    
    
    if (city === "") {
        return;
    }
   
    cities.push(city);
   
  storeCities();
  showCities();
  });

  //Function get Response Weather 
  
  function getWeather(cityName){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?&q=" +cityName+"&units=metric&appid="+key; 

    //Clear content of today-weather
    $("#today-weather").empty();
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        
      cityTitle = $("<h3>").text(response.name + " "+ " -" + todayDay);
      $("#today-weather").append(cityTitle);
      var temp = response.main.temp;
      var cityTemperature = $("<p>").text("Temperature: "+ temp + " °C");
      $("#today-weather").append(cityTemperature);
      var cityHumidity = $("<p>").text("Humidity: "+ response.main.humidity + " %");
      $("#today-weather").append(cityHumidity);
      var cityWindSpeed = $("<p>").text("Wind Speed: "+ response.wind.speed + " km/hr");
      $("#today-weather").append(cityWindSpeed);
      var coordLon = response.coord.lon;
      var coordLat = response.coord.lat;
    
        //UV index
        var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat="+ coordLat +"&lon=" + coordLon + "&appid=" + key;
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function(responseUV) {
            var cityUV = $("<span>").text(responseUV.current.uvi);
            var cityUVindex = $("<p>").text("UV Index: ");
            var riskCat = $("<span>")
            cityUVindex.append(cityUV);
            cityUV.append(riskCat);
            $("#today-weather").append(cityUVindex);
            console.log(typeof responseUV.value);
            if(responseUV.current.uvi <=2){
                cityUV.attr("class","green");
                riskCat.text(" - Low risk");
            }
            else if (responseUV.current.uvi > 2 && responseUV.current.uvi <= 5){
                cityUV.attr("class","yellow");
                riskCat.text(" - Moderate risk");
            }
            else if (responseUV.current.uvi >5 && responseUV.current.uvi <= 7){
                cityUV.attr("class","orange");
                riskCat.text(" - High risk");
            }
            else if (responseUV.current.uvi >7 && responseUV.current.uvi <= 10){
                cityUV.attr("class","red");
                riskCat.text(" - Very High risk");
            }
            else if (responseUV.current.uvi >10){
                cityUV.attr("class","purple");
                riskCat.text(" - Extreme risk");
            }
        });
    
        // 5-day forecast  
        var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=" + cityName + "&appid=" + key;
            $.ajax({
            url: queryURL3,
            method: "GET"
        }).then(function(response5day) { 
            $("#boxes").empty();
            console.log(response5day);
            for(var i=0, j=0; j<=5; i=i+6){
                var weatherInfo = response5day.list[i].dt;
                if(response5day.list[i].dt != response5day.list[i+1].dt){
                    var FivedayDiv = $("<div>")
                    FivedayDiv.attr("class","col-3 m-2 bg-dark opacity-75 overflow-visible");
                    FivedayDiv.attr("id", "fiveBoxes");
                    var d = new Date(0);
                    d.setUTCSeconds(weatherInfo);
                    var date = d;
                    var month = date.getMonth()+1;
                    var day = date.getDate()
                    var dayOutput = date.getFullYear() + '/' +
                    (month<10 ? '0' : '') + month + '/' +
                    (day<10 ? '0' : '') + day;
                    var Fivedayh4 = $("<h3>").text(dayOutput);
                    var skyConditions = response5day.list[i].weather[0].main;
                    var imgConditions = $("<img>");
                    var iconConditions = response5day.list[i].weather[0].icon;
                    var weatherDesc = response5day.list[i].weather[0].description;
                   
                    var allIcons = imgConditions.attr("src", "https://openweathermap.org/img/wn/" + iconConditions + ".png");
                    var allDescription = $("<p>").text(weatherDesc);
                    var allTemperature = $("<p>").text("Temp: "+  response5day.list[i].main.temp  + " °C");
                    var allHumidity = $("<p>").text("Humidity: "+ response5day.list[i].main.humidity + " %");
                    var allWind  = $("<p>").text("Wind Speed: " + response5day.list[i].wind.speed);
                    console.log(skyConditions);
                    FivedayDiv.append(Fivedayh4);
                    FivedayDiv.append(allIcons);
                    FivedayDiv.append(allDescription);
                    FivedayDiv.append(allTemperature);
                    FivedayDiv.append(allHumidity);
                    FivedayDiv.append(allWind);
          
                    $("#boxes").append(FivedayDiv);
                    console.log(response5day);
                    j++;
                }
      
        }
      
    });
    });
    
  }

  $(document).on("click", "#listCity", function() {
    var thisCity = $(this).attr("data-city");
    getWeather(thisCity);
  });






function buildQueryURL() {
    console.log("inside build query function------------------------------------");
    console.log(this);
    // queryURL is the url we'll use to query the API
    //var queryURL = "https://api.openweathermap.org/data/2.5/forecast?";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?";
  
    // Begin building an object to contain our API call's query parameters
    // Set the API key
    var queryParams = { appid: "f00406ea1fec6bf20cddcb9568fdd2b1" };
  
    // Grab text the user typed into the search input, add to the queryParams object
    queryParams.q = $("#search-term")
      .val()
      .trim();
  
    // Logging the URL so we have access to it for troubleshooting
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
  }
  
  /**
   * takes API data (JSON/object) and turns it into elements on the page
   * @param {object} WeatherData - object containing NYT API data
    */
   
  function updatePage(WeatherData) {
    console.log("inside updatepage function------------------------------------");
    console.log(this);
    // Log the WeatherData to console, where it will show up as an object
    console.log(WeatherData);
    console.log("------------------------------------");

    var longitude = WeatherData.coord.lon;
    var latitude = WeatherData.coord.lat;
    var country = WeatherData.sys.country;
    var cityName = WeatherData.name + "," + country;
    var date = timeConverter();
    
    function timeConverter(test){
        var UNIX_timestamp = WeatherData.dt;
        var timeZone = WeatherData.timezone;
        var a = new Date((UNIX_timestamp + timeZone) * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = month + ' ' + date+ ' ' + year ;
        return time;  
      }

    if (WeatherData){
        console.log("before api call------------------------------------");
        console.log(this);
        let queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+
        "&lon="+longitude+"&exclude=minutely,hourly,alerts&appid=f00406ea1fec6bf20cddcb9568fdd2b1"
        
        $.ajax({
            url: queryURL,
            method: "GET"
          }).then(function(WeatherDaily){
            console.log(WeatherDaily)
            console.log("------------------------------------");

            var temperature = (((WeatherDaily.current.temp - 273.15) * 1.8) + 32).toFixed(1)+ " " + "°F" ;
            var humidity = WeatherDaily.current.humidity  + "%";
            var windSpeed = (WeatherDaily.current.wind_speed *  2.237).toFixed(1) + " " + "MPH";
            var UVindex = WeatherDaily.current.uvi;
            var weatherDescription = WeatherDaily.current.weather[0].description;
            var wIconId = WeatherDaily.current.weather[0].icon + "@2x.png";
            var iconAddress = "http://openweathermap.org/img/wn/";
            var iconSrc = iconAddress + wIconId;
           
            console.log("inside api------------------------------------");
    console.log(this);
            function UVbadge (){
                if(UVindex<=2){
                    return "badge-success"
                } else if (UVindex<=5){
                    return "badge-warning"
                } else if (UVindex<=7){
                    return "badge-warning"
                } else if (UVindex>=7){
                    return "badge-danger"
                } 
            };

            $('#cityValue').text(cityName);
            $("#date-value").text(date);
            $("#w-icon").attr("src",iconSrc);
            $("#weather-description").text(weatherDescription);
            $("#temp-value").text(temperature);
            $("#humi-value").text(humidity);
            $("#wind-value").text(windSpeed);
            $("#uv-value").text(UVindex);
            $("#uv-value").removeClass("badge-danger badge-warning badge-success");
            $("#uv-value").addClass(UVbadge ());
            
            for (var i = 1; i < 6; i++) {

                console.log(i);
                console.log("inside for loop------------------------------------");
    console.log(this);
                
                
                function dailyTimeConverter(){
                    let UNIX_timestamp = WeatherDaily.daily[i].dt;
                    let timeZone = WeatherData.timezone;
                    let a = new Date((UNIX_timestamp + timeZone) * 1000);
                    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                    let year = a.getFullYear();
                    let month = months[a.getMonth()];
                    let date = a.getDate();
                    let time = month + ' ' + date;
                    return time;  
                  }
                let wIconId = WeatherDaily.daily[i].weather[0].icon + ".png";
                let dailyDate = dailyTimeConverter();
                let dailyIconSrc = iconAddress + wIconId;
                let dailyTemp = (((WeatherDaily.daily[i].temp.day - 273.15) * 1.8) + 32).toFixed(1)+ " " + "°F" ;
                let dailyHumidity = WeatherDaily.daily[i].humidity + "%";

                let dailyCardCol = $("<div>");
                dailyCardCol.addClass("col")
                dailyCardCol.attr("style", "width: 8rem");

                let dailyForecastCard = $("<div>");
                dailyForecastCard.addClass("card");

                let cardBody = $("<div>");
                cardBody.addClass("card-body");
                
                let cardDate = $("<h6>");
                cardDate.addClass("card-subtitle mb-2");
                cardDate.text(dailyDate);
                cardBody.append(cardDate);

                let cardIcon = $("<h6>");
                cardIcon.addClass("card-subtitle mb-2 text-muted");
                let cardIconImg = $("<img>");
                cardIconImg.attr({
                    src: dailyIconSrc,
                    alt: "Weather icon"
                });
                cardIcon.append(cardIconImg);
                cardBody.append(cardIcon);

                let cardTemp = $("<h6>");
                cardTemp.addClass("card-subtitle mb-2 text-muted");
                cardTemp.text("Temp: " + dailyTemp);
                cardBody.append(cardTemp);

                let cardHumidity = $("<h6>");
                cardHumidity.addClass("card-subtitle mb-2 text-muted");
                cardHumidity.text("Humidity: " + dailyHumidity);
                cardBody.append(cardHumidity);

                dailyForecastCard.append(cardBody);
                dailyCardCol.append(dailyForecastCard);
                $("#dailyCardContainer").append(dailyCardCol);

                if(i==5){
                    $("#weather-card").css({ display: "initial" });
                    $("#weather-card").addClass("fade-in");
                };
            
              };
        });
          
        

    }

  }
 
  // Function to empty out the articles
  function clear() {
    $("#dailyCardContainer").empty();
  }
  
  // CLICK HANDLERS
  // ==========================================================
  
  // .on("click") function associated with the Search Button
  $("#run-search").on("click", function(event) {
    console.log("search btn fired------------------------------------");
    console.log(this);

    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();
    $("#weather-card").css({ display: "none" });
    // Empty the region associated with the articles
    clear();
  
    // Build the query URL for the ajax request to the NYT API
    var queryURL = buildQueryURL();
  
    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(updatePage);
  });
  

 
  
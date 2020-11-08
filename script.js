
function buildQueryURL() {
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
  
    // Log the WeatherData to console, where it will show up as an object
    console.log(WeatherData);
    console.log("------------------------------------");
    var longitude = WeatherData.coord.lon;
    console.log(longitude)
    console.log("------------------------------------");
    var latitude = WeatherData.coord.lat;
    console.log(latitude)
    console.log("------------------------------------");
    var country = WeatherData.sys.country;
    var cityName = WeatherData.name + "," + country;
    console.log(cityName)
    console.log("------------------------------------");
    var date = timeConverter();
    console.log(date)
    console.log("------------------------------------");
    
    function timeConverter(){
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
       
        let queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+
        "&lon="+longitude+"&exclude=minutely,hourly,alerts&appid=f00406ea1fec6bf20cddcb9568fdd2b1"
        
        $.ajax({
            url: queryURL,
            method: "GET"
          }).then(function(WeatherDaily){
            console.log(WeatherDaily)
            console.log("------------------------------------");

            var temperature = (((WeatherDaily.current.temp - 273.15) * 1.8) + 32).toFixed(1)+ " " + "°F" ;
            console.log(temperature)
            console.log("------------------------------------");
            
            var humidity = WeatherDaily.current.humidity  + "%";
            console.log(humidity)
            console.log("------------------------------------");

            var windSpeed = (WeatherDaily.current.wind_speed *  2.237).toFixed(1) + " " + "MPH";
            console.log(windSpeed)
            console.log("------------------------------------");

            var UVindex = WeatherDaily.current.uvi;
            console.log(UVindex)
            console.log("------------------------------------");

            var weatherDescription = WeatherDaily.current.weather[0].description;
            var wIconId = WeatherDaily.current.weather[0].icon + "@2x.png";
            var iconAddress = "http://openweathermap.org/img/wn/";
            var iconSrc = iconAddress + wIconId;
            console.log(iconSrc)
            console.log("------------------------------------");
            
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
            $("#weather-card").css({ display: "initial" });
            $("#weather-card").addClass("fade-in");
          
            for (var i = 0; i < numArticles; i++) {
                // Get specific article info for current index
                var article = NYTData.response.docs[i];
            
                // Increase the articleCount (track article # - starting at 1)
                var articleCount = i + 1;
            
                // Create the  list group to contain the articles and add the article content for each
                var $articleList = $("<ul>");
                $articleList.addClass("list-group");
            
                // Add the newly created element to the DOM
                $("#article-section").append($articleList);
            
                // If the article has a headline, log and append to $articleList
                var headline = article.headline;
                var $articleListItem = $("<li class='list-group-item articleHeadline'>");
            
                if (headline && headline.main) {
                  console.log(headline.main);
                  $articleListItem.append(
                    "<span class='label label-primary'>" +
                      articleCount +
                      "</span>" +
                      "<strong> " +
                      headline.main +
                      "</strong>"
                  );
                }
            
                // If the article has a byline, log and append to $articleList
                var byline = article.byline;
            
                if (byline && byline.original) {
                  console.log(byline.original);
                  $articleListItem.append("<h5>" + byline.original + "</h5>");
                }
            
                // Log section, and append to document if exists
                var section = article.section_name;
                console.log(article.section_name);
                if (section) {
                  $articleListItem.append("<h5>Section: " + section + "</h5>");
                }
            
                // Log published date, and append to document if exists
                var pubDate = article.pub_date;
                console.log(article.pub_date);
                if (pubDate) {
                  $articleListItem.append("<h5>" + article.pub_date + "</h5>");
                }
            
                // Append and log url
                $articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");
                console.log(article.web_url);
            
                // Append the article
                $articleList.append($articleListItem);
              }
        });
          
        

    }

  }
 
  // Function to empty out the articles
  function clear() {
    $("#article-section").empty();
  }
  
  // CLICK HANDLERS
  // ==========================================================
  
  // .on("click") function associated with the Search Button
  $("#run-search").on("click", function(event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();
    $("#weather-card").css({ display: "none" });
    // Empty the region associated with the articles
    //clear();
  
    // Build the query URL for the ajax request to the NYT API
    var queryURL = buildQueryURL();
  
    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(updatePage);
  });
  

 
  
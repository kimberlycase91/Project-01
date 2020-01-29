$(document).ready(function () {

    var firebaseConfig = {
        apiKey: "AIzaSyCeshwfwLmlh2uwM6BLs7J4SmoUbmZvoGQ",
        authDomain: "unboreme-b99d9.firebaseapp.com",
        databaseURL: "https://unboreme-b99d9.firebaseio.com",
        projectId: "unboreme-b99d9",
        storageBucket: "unboreme-b99d9.appspot.com",
        messagingSenderId: "1080038770107",
        appId: "1:1080038770107:web:4c8db7157faf340aaa309e"
    };

    firebase.initializeApp(firebaseConfig);

    database = firebase.database()


    // These variables hold will feed data to the querlyURL. The variable values will come from user input. Currently some of the variables hold temporary data for testing purposes.
    
    var API_KEY = "vMvwtd4qCcNr8hZL";
    var proxyURL = "https://cors-anywhere.herokuapp.com/"

    
    // Search query URL built from info from submitData. 
    const createQueryURL = (info) => {
        console.log(info);
        return `http://api.eventful.com/json/events/search?app_key=${API_KEY}&q=${info.searchTerm}&l=${info.location}&within=${info.radius}&t=future&c=${info.category}&page_size=25`;
      }

    function searchEvents(data) {
        // queryURL to pull data from Eventful.com. The proxy URL is necessary to circumvent CORS rejection.
        var queryURL = createQueryURL(data);
        console.log(queryURL);
        $.ajax({
            url: proxyURL + queryURL,
            method: "GET",
            crossDomain: true
        }).then(function (response) {

            // first the entire response must be parsed from its JSON origin
            temp = JSON.parse(response)
            // then we can grab the important event information from the nest
            eventData = temp.events.event
            console.log(eventData)
            // Dynamically inserts event info into web page

            for (var i = 0; i < eventData.length; i++) {

                newCountry = $("<p>")
                newCountry.text(eventData[i].country_name)

                newCity = $("<p>")
                newCity.text(eventData[i].city_name)

                newTime = $("<p>")
                newTime.text(eventData[i].start_time)

                newTitle = $("<h2>")
                newTitle.text(eventData[i].title)

                newAddress = $("<p>")
                newAddress.text(eventData[i].venue_address)
                newAddress.addClass("location")

                newImage = $("<img src='https://via.placeholder.com/150'>")
                newImage.addClass("eventPic")

                newMap = $("<div>")
                newMap.attr("id", "map")
                newMap.attr("style", "display:none")

                newButton = $("<button>")
                newButton.text("View Map")
                newButton.addClass("map")

                newEvent = $("<div>")
                newEvent.append(newImage, newTitle, newAddress, newTime, newButton, newMap)
                newEvent.addClass("cards")

                $("#resultCard").append(newEvent)

            }

            // Toggles event map display
            $('.map').click(function(e) {
                e.preventDefault();

                var $this = $(this).parent().find('div');
                $(".map div").not($this).hide();

                $this.toggle();
           });

        });
    
    };

    
    // Event handler for user clicking the submit button
    $("#submitSearch").click(function (event) {
        event.preventDefault()
        $("#resultCard").empty();
        // Storing the search queries
       var submitData =  {
             searchTerm : $("#searchTerm").val().trim(),
             category : $("#category").val().trim(),
             location : $("#state").val().trim(),
           //  city : $("#city").val().trim(),
             radius : $("#radius").val().trim(),
          //   where : state + city
        }
        
        // Running the searchEvents function(passing search queries as arguments)
        searchEvents(submitData);

        $("#searchTerm").val("");
        $("#category").val("");
       
    })



    database.ref().on("value", function (snapshot) {

        console.log(snapshot.val())

    })

});


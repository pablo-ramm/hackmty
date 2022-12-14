let map;


//initMap(): is a callback function,
//           will be executed after the Google Map API Async Script loads

window.initMap = function() {
  //default location is Google headquarters
  let location = {
    lat: 37.419857,
    lng: -122.078827,
  };

  let locationRest = location;

  let mapOptions = {
    center: location,
    zoom: 12
  };

  

  

  const mapContainer = document.getElementById('map');
  map = new google.maps.Map(mapContainer, mapOptions);

  const img = "https://img.icons8.com/plasticine/100/000000/user-location.png";

  function createMarker(location, map) {
    let marker = new google.maps.Marker({
      position: location,
      map: map,
      icon: img
    });
  }

  if (navigator.geolocation) {
    console.log("Geolocation is supported!");

    navigator.geolocation.getCurrentPosition(
      (currentPosition) => {
        location.lat = currentPosition.coords.latitude;
        location.lng = currentPosition.coords.longitude;
        map = new google.maps.Map(mapContainer, mapOptions);
        createMarker(location, map);
      },
      (err) => {
        console.log("Access to Geolocation is denied!");
        console.log("Map is centered at default location.");
        console.log(err.message);
        map = new google.maps.Map(mapContainer, mapOptions);
        createMarker(location, map);
      }
    );
  } else {
    console.log("Geolocation is not supported by the browser!");
    console.log("Map is centered at default location ");
    map = new google.maps.Map(mapContainer, mapOptions);
    createMarker(location, map);
  }

  // Add Autocomplete
  let autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("search-input"),
    {
      type: ["establishment"],
      fields: ["geometry", "name"],
    }
  );

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    //when user enters a location that is not suggested by autocomplete
    //or autocomplete fails to get a place
    if(!place.geometry){
        alert(`No details available for input: '${place.name}'\n
                Please select a location from the dropdown!`);
    } else {
        location = place.geometry.location;
        map = new google.maps.Map(mapContainer, {
                center: location,
                zoom: 12
        });
        console.log("location entered: " + location);
        createMarker(location,map);
        let latInput = document.getElementById("latitude")
        let lonInput = document.getElementById("longitude")

        latInput.value = location.lat();
        lonInput.value = location.lng();
        
        
    }
  });

}

//callback function passed into nearbySearch
function callback(results, status){
    if (status == google.maps.places.PlacesServiceStatus.OK){
        let currentInfoWindow = null;
        let qty = Math.min(3,results.length);
        for(let i = 0; i < qty; i++ ){
            let result = results[i];
            let contentString = 
                `<div style="color:black">`+
                `<h3>${result.name}</h3>` +
                `<p>Address: ${result.vicinity}</p>` +
                `<p>Price Level: ${result.price_level}/4</p>` +
                `<p>Rating: ${result.rating}/5 </p>`+
                `</div>`;
            let infoWindow = new google.maps.InfoWindow({
                content: contentString
            });
            let marker = new google.maps.Marker({
                position: result.geometry.location,
                map: map,
                label: result.name,
            });
            marker.addListener('click',() => {
                if (currentInfoWindow != null){
                    currentInfoWindow.close();
                };
                infoWindow.open({
                    anchor: marker,
                    map,
                    shouldFocus: false,
                });
                currentInfoWindow = infoWindow;
            });
            
        }
    }
}

  //imgSlider for thumbnail

function imgSlider(link) {
    document.querySelector('.food').src = link;
}


//this functions gets Latitude and Longitude from the location entered

function getLatLon(){
    let txt = document.getElementById("search-input").value;
    console.log(txt);
    let address = txt;
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+address+'&key='+"AIzaSyC1BtUCEK4iO1NVWK_E6gPqZzd-XgktYQs")
    .then(response => response.json())
    .then(data => {
        const latitude = data.results[0].geometry.location.lat;
        const longitude = data.results[0].geometry.location.lng;
        console.log({latitude, longitude})
    })
}
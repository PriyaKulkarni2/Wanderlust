var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

navigator.geolocation.watchPosition(success,error);

let marker,circle,zoomed;

function success(pos) {

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    if(marker){
        map.removeLayer(marker);
        map.remaveLayer(circle);
    }

    marker = L.marker([lat,lng]).addTo(map);
    circle = L.circle([lat,lng],{radius:accuracy}).addTo(map);

     //use from openStreetMap
    //for showing map it's necessary to use tiles
    let tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    let attribution = "&copy; WanderNest";
  
    //in map is working on layers . so our base layer is tilelayer and above this we can diffrent layers like circle layer and all
    // Add a tile layer (OpenStreetMap)
    L.tileLayer(tileUrl, { attribution }).addTo(map);

    if(!zoomed){
        zoomed = map.fitBounds(circle.getBounds());
    }
    
}

function error(err) {
    if(err.code === 1){
        alert("please allow your location access");
    }
    else{
        alert("cannot get your current location");
    }
}


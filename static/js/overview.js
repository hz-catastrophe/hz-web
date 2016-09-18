var map, heatmap, points;

var ok = "ok";
var medic = "injured";
var medic2 = "heavily_injured";


var need_shelter = "shelter";
var need_water = "water";
var need_medic = "medic";
var need_food = "food";


function redrawPoints(selector) {
    socket.emit('reports list', {}, function (data) {
        points.clear();

        for (var i = 0; i < data.length; i++) {
            var report = data[i];
            if (selector != null) {
                if (report.status != selector) {
                    continue;
                }
            }
            points.push({location: new google.maps.LatLng(report.location.lat, report.location.lng), weight: 0.65});
        }

        console.log('done redrawing');
    });
}


function redrawAllPoints() {
    socket.emit('reports list', {}, function (data) {
        points.clear();

        for (var i = 0; i < data.length; i++) {
            var report = data[i];
            points.push({location: new google.maps.LatLng(report.location.lat, report.location.lng), weight: 0.65});
        }

        console.log('done redrawing');
    });
}

function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: {lat: 47.39, lng: 8.515},
        zoom: 16,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        },
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {
                featureType: 'all',
                stylers: [
                    {saturation: -80}
                ]
            }, {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [
                    {hue: '#00ffee'},
                    {saturation: 50}
                ]
            }, {
                featureType: 'poi.business',
                elementType: 'labels',
                stylers: [
                    {visibility: 'off'}
                ]
            }
        ]
    });

    points = new google.maps.MVCArray([]);

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: points,
        map: map,
        radius: 32
    });
    redrawPoints();
}

var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function () {
    //socket.emit('my event', {data: 'I\'m connected!'});
    console.log("Established socket.io connection");
});

socket.on('reports new', function (data) {
    console.log('Reports NEW', data);
});

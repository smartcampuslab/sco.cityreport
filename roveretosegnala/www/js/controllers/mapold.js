angular.module('roveretoSegnala.controllers.map', [])

 //MAPPE
    .controller('MapCtrl', function ($scope, $ionicLoading, $compile) {
        $scope.init = function () {
//                    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
//                    var mapOptions = {
//                      center: myLatlng,
//                      zoom: 16,
//                      mapTypeId: google.maps.MapTypeId.ROADMAP
//                    };
//                    var map = new google.maps.Map(document.getElementById("map"),
//                        mapOptions);
//            
//                    //Marker + infowindow + angularjs compiled ng-click
//                    var contentString = "<div><a ng-click='clickTest()'>Clicca qui!</a></div>";
//                    var compiled = $compile(contentString)($scope);
//                    var infowindow = new google.maps.InfoWindow({
//                      content: compiled[0]
//                    });
//                    var marker = new google.maps.Marker({
//                      position: myLatlng,
//                      map: map,
//                      title: 'Uluru (Ayers Rock)'
//                    });
//                    google.maps.event.addListener(marker, 'click', function() {
//                      infowindow.open(map,marker);
//                    });
//                    $scope.map = map;
            		var map = L.map('map');

		L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-i875mjb7'
		}).addTo(map);

		function onLocationFound(e) {
			var radius = e.accuracy / 2;
var myLocationIcon = L.icon({
    iconUrl: 'img/marker-icon.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: 'img/marker-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

//L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
			L.marker(e.latlng, {icon: myLocationIcon}).addTo(map)
				.bindPopup("You are within " + radius + " meters from this point").openPopup();

			L.circle(e.latlng, radius).addTo(map);
		}

		function onLocationError(e) {
			alert(e.message);
		}

		map.on('locationfound', onLocationFound);
		map.on('locationerror', onLocationError);

		map.locate({setView: true, maxZoom: 16});

$scope.map = map;
        };
        // google.maps.event.addDomListener(window, 'load', initialize);
        $scope.centerOnMe = function () {
//            if (!$scope.map) {
//                return;
//            }
//
//            $scope.loading = $ionicLoading.show({
//                content: 'Getting current location...',
//                showBackdrop: false
//            });
//
//            navigator.geolocation.getCurrentPosition(function (pos) {
//                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
//                $scope.loading.hide();
//
//            }, function (error) {
//                alert('Unable to get location: ' + error.message);
//            });
        };
        $scope.clickTest = function () {
            alert('Example of infowindow with ng-click')
        };
    })
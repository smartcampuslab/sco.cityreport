angular.module('roveretoSegnala.controllers.map', [])
    .controller('MapCtrl',
        function ($scope, $location, leafletData, archiveService) {

            $scope.selectedMarker = "-";
            $scope.myMarkers = [];
            leafletData.getMap().then(function (map) {
                L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                    maxZoom: 18
                }).addTo(map);
            });
            archiveService.list().then(function (data) {
                $scope.mySignals = data;
                var markers = [];
                for (i = 0; i < $scope.mySignals.signals.length; i++) {
                    markers.push({
                        lat: $scope.mySignals.signals[i].lat,
                        lng: $scope.mySignals.signals[i].long,

                        message: '<div ng-controller="MapCtrl">' +
                            '<div><label><strong>{{\'popup_title\' | translate}}:</strong> <i>' + $scope.mySignals.signals[i].title + '</i></label></div>' +
                            '<div><label><strong>{{\'popup_description\' | translate}}:</strong> <i>' + $scope.mySignals.signals[i].description + '</i></label></div>' +
                            '<div><label><strong>{{\'popup_address\' | translate}}:</strong> <i>' + $scope.mySignals.signals[i].address + '</i></label></div>' +
                            '<div align="center" ><button class="button button-custom" ng-click="closeWin()" style="width:50%">Cancel</button>' +
                            '<button class="button button-custom" ng-click="detail(\'#/app/archiviodetail/' + $scope.mySignals.signals[i].id + '\')" style="width:50%">Detail</button>' +
                            '</div></form>' +
                            '</div>',

                        icon: {
                            iconUrl: 'img/segnala.png',
                            iconSize: [50, 50]
                        },
                        focus: true
                    });
                }
                $scope.markers = markers;
            });
            $scope.detail = function (view) {
                window.location.assign(view);
            }

            $scope.closeWin = function () {
                leafletData.getMap().then(function (map) {
                    map.closePopup();
                });
            }
            angular.extend($scope, {
                center: {
                    lat: 45.849036,
                    lng: 11.233380,
                    zoom: 8
                },
                markers: $scope.myMarkers,
                events: {}
            });

        })




//https://github.com/tombatossals/angular-leaflet-directive
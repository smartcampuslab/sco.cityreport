////https: //github.com/tombatossals/angular-leaflet-directive
angular.module('roveretoSegnala.controllers.map', [])
    .controller('MapCtrl',
        function ($ionicPlatform, $scope, $location, $rootScope, leafletData, archiveService, $ionicHistory, $ionicPlatform, $templateCache, $state, Config, $filter) {
            $scope.comefromarchivio = false;
            $scope.selectedMarker = "-";
            $scope.myMarkers = [];
            var mymap = document.getElementById('map-container');
            if (mymap != null) {
                resizeElementHeight(mymap);
            }
            window.onresize = function () {
                if (mymap != null) {
                    resizeElementHeight(mymap);
                }
            }
            $scope.init = function () {
                //log
                Restlogging.appLog("AppConsume", "map");
                $rootScope.$viewHistory = {
                    histories: {
                        root: {
                            historyId: 'root',
                            parentHistoryId: null,
                            stack: [],
                            cursor: -1
                        }
                    },
                    backView: null,
                    forwardView: null,
                    currentView: null,
                    disabledRegistrableTagNames: []
                };
                leafletData.getMap().then(function (map) {
                    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                        maxZoom: 18
                    }).addTo(map);
                    map.locate({
                        setView: false,
                        maxZoom: 8,
                        watch: false,
                        enableHighAccuracy: true
                    });
                    map.on('locationfound', onLocationFound);

                    function onLocationFound(e) {
                        $scope.myloc = e;
                        var radius = e.accuracy / 2;

                        L.marker(e.latlng).addTo(map);
                        //                        .bindPopup("You are within " + radius + " meters from this point").openPopup();

                        L.circle(e.latlng, radius).addTo(map);

                    }


                });
                archiveService.listForMap().then(function (data) {
                    $scope.mySignals = {
                        data: []
                    };
                    for (var i = 0; i < data.data.length; i++) {
                        if (data.data[i].location.coordinates[0] != 0 && data.data[i].location.coordinates[1] != 0) {
                            $scope.mySignals.data.push(data.data[i]);
                        }
                    }
                    //$scope.mySignals = data;
                    var markers = [];
                    for (i = 0; i < $scope.mySignals.data.length; i++) {
                        markers.push({
                            lat: $scope.mySignals.data[i].location.coordinates[0],
                            lng: $scope.mySignals.data[i].location.coordinates[1],

                            message: '<div ng-controller="MapCtrl">' +
                                '<div style="text-align:center;" ><label><strong> <i>' + $scope.mySignals.data[i].attribute.title + '</i></strong></label></div>' +
                                '<div ng-hide="' + ($scope.mySignals.data[i].location.address == "") + '"><label><i class="icon ion-location" style="font-size:25px;"></i> ' + $scope.mySignals.data[i].location.address + '</i></label></div>' +
                                '<div align="center" style="white-space:nowrap;" ><button class="button button-custom" ng-click="closeWin()" style="width:49%">' + $filter('translate')("button_cancel") + '</button>' +
                                '<button class="button button-custom" ng-click="detail(\'#/app/archiviodetail/' + $scope.mySignals.data[i].id + '\')" style="width:49%">' + $filter('translate')("button_detail") + '</button>' +
                                '</div></form>' +
                                '</div>',

                            icon: {
                                iconUrl: $scope.getIcon($scope.mySignals.data[i]),
                                iconSize: [50, 50]
                            },
                            //                        focus: true
                        });

                    }
                    $scope.myMarkers = markers;
                    leafletData.getMap().then(function (map) {
                        //                                            var bounds = [];
                        //                                            for (var i = 0; i < $scope.myMarkers.length; i++) {
                        //                                                bounds.push([$scope.myMarkers[i].lat, $scope.myMarkers[i].lng])
                        //                                            }
                        //                                            map.fitBounds(bounds);

                        $rootScope.showmap = true;
                    });
                    // $rootScope.showmap = true;

                });
            }
            $scope.detail = function (view) {
                window.location.assign(view);
            }

            $scope.closeWin = function () {
                leafletData.getMap().then(function (map) {
                    map.closePopup();
                });
            }
            $scope.getIcon = function (signal) {
                if (signal.status == 'open') {
                    return 'img/ic-segnalazione.png'
                } else if (signal.status == 'closed') {
                    return 'img/ic-done.png'
                } else {
                    return 'img/ic-progressing.png'
                }

            }



            if (archiveService.getMapCenterForSignal()) {
                angular.extend($scope, {
                    tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                    center: {
                        lat: archiveService.getMapCenterForSignal().lat,
                        lng: archiveService.getMapCenterForSignal().long,
                        zoom: 18
                    },
                    markers: $scope.myMarkers,
                    events: {}
                });
            } else {
                angular.extend($scope, {
                    tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                    center: {
                        lat: Config.getCenterCoordinates()[0],
                        lng: Config.getCenterCoordinates()[1],
                        zoom: Config.getZoomLevel()
                    },
                    markers: $scope.myMarkers,
                    events: {}
                });
            }
            //for refresh
            $ionicPlatform.ready(function () {
                $scope.init();
                //$rootScope.showmap = true;

            });

            function resizeElementHeight(element) {
                var height = 0;
                var body = window.document.body;
                if (window.innerHeight) {
                    height = window.innerHeight;
                } else if (body.parentElement.clientHeight) {
                    height = body.parentElement.clientHeight;
                } else if (body && body.clientHeight) {
                    height = body.clientHeight;
                }
                console.log('height' + height);
                element.style.height = ((height - element.offsetTop) + "px");
            }
        })

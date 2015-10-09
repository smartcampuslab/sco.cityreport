angular.module('roveretoSegnala.controllers.segnala', [])

.factory('Toast', function ($rootScope, $timeout, $ionicPopup, $cordovaToast) {
        return {
            show: function (message, duration, position) {
                message = message || "There was a problem...";
                duration = duration || 'short';
                position = position || 'top';

                if (!!window.cordova) {
                    // Use the Cordova Toast plugin
                    $cordovaToast.show(message, duration, position);
                } else {
                    if (duration == 'short') {
                        duration = 2000;
                    } else {
                        duration = 5000;
                    }

                    var myPopup = $ionicPopup.show({
                        template: "<div class='toast'>" + message + "</div>",
                        scope: $rootScope,
                        buttons: []
                    });

                    $timeout(function () {
                        myPopup.close();
                    }, duration);
                }
            }
        };
    })
    .factory('segnalaService', function ($http, $q, Config) {
        var clientId = 'b790f7d57013adb';
        var clientSecret = '55b0409e29c9461564ddaacc7fd10b23a6ffd507';
        var title = null;
        var description = null;
        var category = null;
        var latlong = [0, 0];
        var segnalaService = {};
        var signal = null;
        var name = '';
        var images = [];
        var imagesBase64 = [];
        segnalaService.setSignal = function (signalinput) {
            signal = signalinput;
        }
        segnalaService.setImages = function (imagesinput, imagesBase64input) {
            images = imagesinput;
            imagesBase64 = imagesBase64input;
        }
        segnalaService.getSignal = function () {
            return signal;
        };
        segnalaService.getImages = function () {
            return images;
        };
        segnalaService.getImagesBase64 = function () {
            return imagesBase64;
        };
        segnalaService.getclientId = function () {
            return clientId;
        };
        segnalaService.getclientSecret = function () {
            return clientSecret;
        };
        segnalaService.getName = function () {
            return name;
        };

        segnalaService.setName = function (nameinput) {
            name = nameinput;
        };
        segnalaService.getPosition = function () {
            return latlong;
        };
        segnalaService.setPosition = function (lat, long) {
            latlong[0] = lat;
            latlong[1] = long;
        };

        segnalaService.sendSignal = function (signal) {
            return $http({
                method: 'POST',
                url: Config.URL() + '/' + Config.provider() + '/services/' + Config.service() + '/user/issues',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'

                },
                data: signal
            }).
            success(function (data, status, headers, config) {

            }).
            error(function (data, status, headers, config) {


            });



        };

        return segnalaService;
    })

.controller('Map4AdrressCtrl', function ($scope, $location, $ionicHistory, $window, $q, $http, $filter, $ionicPopup, leafletData, archiveService, segnalaService, $ionicLoading) {

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
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18
            }).addTo(map);
        });
        $scope.$on("leafletDirectiveMap.click", function (event, args) {
            $ionicLoading.show();
            segnalaService.setPosition(args.leafletEvent.latlng.lat, args.leafletEvent.latlng.lng);
            //            alert(args.leafletEvent.latlng.lat + ' ' + args.leafletEvent.latlng.lng);
            var placedata = $q.defer();
            var places = {};
            var url = "https://os.smartcommunitylab.it/core.geocoder/spring/location?latlng=" + args.leafletEvent.latlng.lat + ',' + args.leafletEvent.latlng.lng;

            $http.get(encodeURI(url), {
                timeout: 5000
            }).
            success(function (data, status, headers, config) {
                $ionicLoading.hide();
                places = data.response.docs;
                name = '';
                if (data.response.docs[0]) {
                    if (data.response.docs[0].name) {
                        name = name + data.response.docs[0].name;
                    }
                    if (data.response.docs[0].street && (data.response.docs[0].name != data.response.docs[0].street)) {
                        if (name)
                            name = name + ', ';
                        name = name + data.response.docs[0].street;
                    }
                    if (data.response.docs[0].housenumber) {
                        if (name)
                            name = name + ', ';
                        name = name + data.response.docs[0].housenumber;
                    }
                    if (data.response.docs[0].city) {
                        if (name)
                            name = name + ', ';
                        name = name + data.response.docs[0].city;
                    }


                    $scope.showConfirm(name);
                } else {
                    $scope.showConfirm($filter('translate')("signal_send_lat_template") + args.leafletEvent.latlng.lat.toString().substring(0, 7) + " " + $filter('translate')("signal_send_long_template") + args.leafletEvent.latlng.lng.toString().substring(0, 7), args.leafletEvent.latlng.lat, args.leafletEvent.latlng.lng);
                    // showNoPlace(args.leafletEvent.latlng.lat, args.leafletEvent.latlng.lng);
                }
            }).
            error(function (data, status, headers, config) {
                $ionicLoading.hide();
                showNoConnection();

            });

            //$scope.showConfirm(name);
        });
        $scope.detail = function (view) {
            window.location.assign(view);
        }

        $scope.closeWin = function () {
            leafletData.getMap().then(function (map) {
                map.closePopup();
            });
        }

        $scope.showConfirm = function (name) {
            var confirmPopup = $ionicPopup.confirm({
                title: $filter('translate')("signal_send_confirm_place_title"),
                template: name,
                buttons: [
                    {
                        text: $filter('translate')("signal_send_popup_cancel"),
                        type: 'button-custom'
                            },
                    {
                        text: $filter('translate')("signal_send_popup_ok"),
                        type: 'button-custom',
                        onTap: function (res) {
                            if (res) {
                                segnalaService.setPosition(segnalaService.getPosition()[0], segnalaService.getPosition()[1]);
                                segnalaService.setName(name);
                                //                    window.history.back();
                                window.location.assign('#/app/segnala/' + name);
                                $ionicHistory.nextViewOptions({
                                    disableAnimate: true,
                                    disableBack: true
                                });
                            }
                        }
                    }
            ]
            });

        }

        angular.extend($scope, {
            center: {
                lat: 45.890931,
                lng: 11.041126,
                zoom: 12
            },
            events: {}
        });

    })
    .controller('SegnalaCtrl', function ($scope, $cordovaCamera, $cordovaFile, $ionicHistory, $window, $q, $http, $filter, $ionicPopup, $ionicLoading, Toast, $stateParams, segnalaService, PlacesRetriever, Config) {
        $scope.selectedcategory = null;
        $scope.signal = null;
        $scope.categories = Config.getCategories();
        if (!segnalaService.getSignal()) {
            $scope.signal = {

                location: {
                    coordinates: null,
                    address: null
                },
                media: null,
                attribute: {
                    title: null,
                    description: null,
                    category: null
                }
            };
            $scope.signal.attribute.category = $scope.categories[0];
            $scope.images = [];
            $scope.imagesBase64 = [];


        } else {
            $scope.signal = segnalaService.getSignal();
            $scope.images = segnalaService.getImages();
            $scope.imagesBase64 = segnalaService.getImagesBase64();
            $scope.signal.attribute.category = $scope.categories[$scope.signal.attribute.category.value];

            //$scope.images = $scope.signal.media;
            if ($scope.images == null) {
                $scope.images = [];
                $scope.imagesBase64 = [];
            }
            if (!$scope.signal.media) {
                $scope.signal.media = [];
            }
            //            $scope.signal.attribute.category = $scope.categories[0];


        }
        $scope.placesandcoordinates = {};

        $scope.openMap4Address = function () {
            segnalaService.setSignal($scope.signal);
            segnalaService.setImages($scope.images, $scope.imagesBase64);
            window.location.assign('#/app/map4address');
        }

        $scope.addImage = function (wherePic) {
            var options = {};

            // 2
            if (wherePic == 'Camera') {
                options = {
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
            } else {
                options = {
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY, // Camera.PictureSourceType.PHOTOLIBRARY
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
            }
            // 3
            $cordovaCamera.getPicture(options).then(function (imageData) {

                //I have to add to file array imageData and visualize
                // 4
                image = "data:image/jpeg;base64," + imageData;
                $scope.images.push(image);
                $scope.imagesBase64.push(imageData);

            }, function (err) {
                console.log(err);
            });
        }
        $scope.places = PlacesRetriever.getplaces("...");
        $scope.places.then(function (data) {
            $scope.places = data;
            $scope.placesandcoordinates = PlacesRetriever.getnames();
        });

        $scope.getplaces = function () {
            return $scope.places;
        }

        var distance = function (lat1, lon1, lat2, lon2, unit) {
            var radlat1 = Math.PI * lat1 / 180
            var radlat2 = Math.PI * lat2 / 180
            var radlon1 = Math.PI * lon1 / 180
            var radlon2 = Math.PI * lon2 / 180
            var theta = lon1 - lon2
            var radtheta = Math.PI * theta / 180
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            dist = Math.acos(dist)
            dist = dist * 180 / Math.PI
            dist = dist * 60 * 1.1515
            if (unit == "K") {
                dist = dist * 1.609344
            }
            if (unit == "N") {
                dist = dist * 0.8684
            }
            return dist
        }

        var compare = function (a, b) {
            if (distance(a.latlong.split(',')[0], a.latlong.split(',')[1], Config.getCenterCoordinates[0], Config.getCenterCoordinates[1], "K") < (distance(b.latlong.split(',')[0], b.latlong.split(',')[1], Config.getCenterCoordinates[0], Config.getCenterCoordinates[1], "K")))
                return -1;
            if (distance(a.latlong.split(',')[0], a.latlong.split(',')[1], Config.getCenterCoordinates[0], Config.getCenterCoordinates[1], "K") > (distance(b.latlong.split(',')[0], b.latlong.split(',')[1], Config.getCenterCoordinates[0], Config.getCenterCoordinates[1], "K")))
                return 1;
            return 0;
        }

        //objs.sort(compare);
        $scope.typePlace = function (typedthings) {
            $scope.result = typedthings;
            $scope.newplaces = PlacesRetriever.getplaces(typedthings);
            $scope.newplaces.then(function (data) {
                $scope.places = data;
                $scope.placesandcoordinates = PlacesRetriever.getnames();
                //order array by distance
                //$scope.placesandcoordinates.sort(compare);
            });
        }

        //        $scope.setNameParam = function (typed) {
        //            $scope.result = typed;
        //        }
        $scope.urlForImage = function (imageName) {
            var name = imageName.substr(imageName.lastIndexOf('/') + 1);
            var trueOrigin = cordova.file.dataDirectory + name;
            return trueOrigin;
        }
        $scope.removeImage = function (imageName) {
            var index = $scope.images.indexOf(imageName);
            if (index > -1) {
                $scope.images.splice(index, 1);
                $scope.imagesBase64.splice(index, 1);
            }

        }
        showNoPlace = function (lat, long) {
            var alertPopup = $ionicPopup.alert({
                title: $filter('translate')("signal_send_no_place_title"),
                template: $filter('translate')("signal_send_no_place_template") + $filter('translate')("signal_send_lat_template") + lat + $filter('translate')("signal_send_long_template") + long,
                buttons: [
                    {
                        text: $filter('translate')("signal_send_toast_alarm"),
                        type: 'button-custom'
                            }
            ]
            });
            alertPopup.then(function (res) {
                console.log('no place');
            });
        };

        showNoConnection = function () {
            var alertPopup = $ionicPopup.alert({
                title: $filter('translate')("signal_send_no_connection_title"),
                template: $filter('translate')("signal_send_no_connection_template"),
                buttons: [
                    {
                        text: $filter('translate')("signal_send_toast_alarm"),
                        type: 'button-custom'
                            }
            ]
            });
            alertPopup.then(function (res) {
                console.log('no place');
            });
        };

        showNoPlaceFound = function () {
            var alertPopup = $ionicPopup.alert({
                title: $filter('translate')("signal_send_no_place_title"),
                template: $filter('translate')("signal_send_no_place_template"),
                buttons: [
                    {
                        text: $filter('translate')("signal_send_toast_alarm"),
                        type: 'button-custom'
                            }

                        ]
            });
            alertPopup.then(function (res) {
                console.log('no place');
            });
        };
        $scope.locateMe = function () {
            $ionicLoading.show();
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.$apply(function () {
                        $scope.position = position;
                        //                        alert(position.coords.latitude + ' ' + position.coords.longitude);
                        var placedata = $q.defer();
                        var places = {};
                        var url = "https://os.smartcommunitylab.it/core.geocoder/spring/location?latlng=" + position.coords.latitude + ',' + position.coords.longitude;
                        //add timeout
                        $http.get(encodeURI(url), {
                            timeout: 5000
                        }).
                        success(function (data, status, headers, config) {
                            places = data.response.docs;
                            //show a pop up where u can choose if address is correct and set up in the bar
                            // A confirm dialog
                            name = '';
                            if (data.response.docs[0]) {
                                if (data.response.docs[0].street)
                                    name = name + data.response.docs[0].street;
                                if (data.response.docs[0].housenumber) {
                                    if (name)
                                        name = name + ', ';
                                    name = name + data.response.docs[0].housenumber;
                                }
                                if (data.response.docs[0].city) {
                                    if (name)
                                        name = name + ', ';
                                    name = name + data.response.docs[0].city;
                                }

                                $ionicLoading.hide();
                                $scope.showConfirm(name, position.coords.latitude, position.coords.longitude);
                            } else {
                                $ionicLoading.hide();
                                $scope.showConfirm(position.coords.latitude + " " + position.coords.longitude, position.coords.latitude, position.coords.longitude);

                                //showNoPlace(position.coords.latitude, position.coords.longitude);

                            }
                        }).
                        error(function (data, status, headers, config) {
                            //temporary
                            $ionicLoading.hide();
                            showNoConnection();
                        });


                    });
                },
                function (error) {
                    $ionicLoading.hide();
                    showNoPlaceFound();
                }, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
        };
        $scope.changeString = function (suggestion) {

            segnalaService.setPosition($scope.placesandcoordinates[suggestion].latlong.split(',')[0], $scope.placesandcoordinates[suggestion].latlong.split(',')[1]);
            segnalaService.setName(suggestion);

            $scope.signal.location.address = suggestion;
        }

        $scope.setAutocomplete = function () {
            if ($stateParams.place) {
                $scope.result = $stateParams.place;
            } else {
                $scope.result = '';
            }
        }
        $scope.goToMap = function () {
            segnalaService.setSignal(null);
            window.location.assign("#/app/map/");
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
        }
        $scope.submit = function () {
            var remoteURL = [];
            $scope.signal.location.coordinates = segnalaService.getPosition();
            $scope.signal.location.address = $scope.result;
            if ($scope.images) {
                $scope.signal.media = $scope.images;
            }
            //            $scope.signal.attribute.category = $scope.selectedcategory.value;
            if ($scope.checkForm($scope.signal)) {
                //show popup for confirm the insert
                var confirmPopup = $ionicPopup.confirm({
                    title: $filter('translate')("signal_send_confirm_issue_title"),
                    template: $scope.result,
                    buttons: [
                        {
                            text: $filter('translate')("signal_send_popup_cancel"),
                            type: 'button-custom'
                            },
                        {
                            text: $filter('translate')("signal_send_popup_ok"),
                            type: 'button-custom',
                            onTap: function () {
                                $ionicLoading.show({
                                    template: 'Loading...'
                                });
                                var uploadedimages = 0;
                                for (var i = 0; i < $scope.images.length; i++) {
                                    $http({
                                        method: 'POST',
                                        url: 'https://api.imgur.com/3/image',
                                        headers: {
                                            Authorization: 'Client-ID b790f7d57013adb',
                                            Accept: 'application/json'
                                        },
                                        data: {
                                            image: $scope.imagesBase64[i],
                                            type: 'base64'

                                        }
                                    }).
                                    success(function (data, status, headers, config) {
                                        // this callback will be called asynchronously
                                        // when the response is available
                                        remoteURL.push(data.data.link);
                                        uploadedimages++
                                        //send to ws the server
                                        if (uploadedimages == $scope.images.length) {
                                            $scope.signal.media = remoteURL;
                                            segnalaService.sendSignal($scope.signal).then(function (data) {
                                                //chiudi pop up bella la' e esci
                                                $ionicLoading.hide();
                                                console.log("upload images success. Now send data to server...." + segnalaService.getPosition());
                                                //torna indietro con toast successo
                                                //                                window.location.assign('#/app/map');
                                                window.location.assign('#/app/mysignals');
                                                $ionicHistory.nextViewOptions({
                                                    disableAnimate: true,
                                                    disableBack: true
                                                });
                                                Toast.show($filter('translate')("signal_send_toast_ok"), "short", "bottom");
                                                //log
                                                Restlogging.appLog("AppProsume", "newissue");
                                            }, function (error) {
                                                console.log("problems" + data + status + headers + config);
                                                //chiudi pop up ed errore sul server smarcommunity
                                                //toast error
                                                Toast.show($filter('translate')("signal_send_toast_error"), "short", "bottom");
                                                $ionicLoading.hide();

                                            });
                                        }
                                    }).
                                    error(function (data, status, headers, config) {
                                        $ionicLoading.hide();
                                        console.log("problems" + "data:" + JSON.stringify(data, null, 4) + "status:" + status + "headers:" + headers + "config:" + config);
                                        //chiudi pop up ed errore sul server immagini
                                        //toast error
                                        Toast.show($filter('translate')("signal_send_toast_error"), "short", "bottom");
                                        $ionicLoading.hide();

                                    });
                                }
                                if ($scope.images.length == 0) {
                                    //if no gallery u are here
                                    segnalaService.sendSignal($scope.signal).then(function (data) {
                                        //chiudi pop up bella la' e esci
                                        $ionicLoading.hide();
                                        console.log("upload images success. Now send data to server...." + segnalaService.getPosition());
                                        //torna indietro con toast successo
                                        //                                window.location.assign('#/app / map');
                                        window.location.assign('#/app/mysignals');
                                        $ionicHistory.nextViewOptions({
                                            disableAnimate: true,
                                            disableBack: true
                                        });
                                        Toast.show($filter('translate')("signal_send_toast_ok"), "short", "bottom");
                                        //log
                                        Restlogging.appLog("AppProsume", "newissue");

                                    }, function (error) {
                                        console.log("problems" + "data:" + data + "status:" + status + "headers:" + headers + "config:" + config);
                                        //chiudi pop up ed errore sul server smarcommunity
                                        //toast error
                                        Toast.show($filter('translate')("signal_send_toast_error"), "short", "bottom");
                                        $ionicLoading.hide();

                                    });
                                }
                            }
                    }
            ]
                });

            } else {
                //show popup
                var alertPopup = $ionicPopup.alert({
                    title: $filter('translate')("signal_error_send_form_title"),
                    template: $filter('translate')("signal_error_send_form_template"),
                    buttons: [
                        {
                            text: $filter('translate')("signal_send_toast_alarm"),
                            type: 'button-custom',
                            }
            ]
                });
                alertPopup.then(function (res) {
                    console.log('error');
                    Toast.show($filter('translate')("signal_send_toast_error"), "short", "bottom");

                });
            }
        }

        $scope.checkForm = function (signal) {
            var check = true;
            //check title
            if (!signal.attribute.title) {
                check = false;
            }
            //check coordinates
            if (!signal.location.coordinates || (signal.location.coordinates[0] == 0 && signal.location.coordinates[1] == 0)) {
                check = false;
            }
            return check;
        }


        $scope.getBase64Image = function (img) {

            Base64.encode(img.src);
            Base64.getBase64ImageFromInput(img.src, function (imageData) {
                //Process the image string.
                console.log(imageData);
            });
        }


        $scope.showConfirm = function (name, lat, long) {
            var confirmPopup = $ionicPopup.confirm({
                title: $filter('translate')("signal_send_confirm_place_title"),
                template: name,
                buttons: [
                    {
                        text: $filter('translate')("signal_send_popup_cancel"),
                        type: 'button-custom'
                            },
                    {
                        text: $filter('translate')("signal_send_popup_ok"),
                        type: 'button-custom',
                        onTap: function (res) {
                            if (res) {
                                $scope.result = name;
                                segnalaService.setPosition(lat, long);

                            }
                        }
                    }
            ]
            });

        }


    })


.factory('PlacesRetriever', function ($http, $q, $timeout, Config) {
    var PlacesRetriever = new Object();
    var roveretoLatLng = '45.886734, 11.033981';
    var distance = '6';
    var places = {};



    PlacesRetriever.getnames = function (i) {
        return places;
    }
    PlacesRetriever.getplaces = function (i) {

        var placedata = $q.defer();
        var names = [];
        i = i.replace(/\ /g, "+");
        var url = "https://os.smartcommunitylab.it/core.geocoder/spring/address?latlng=" + Config.getCenterCoordinates()[0] + ", " + Config.getCenterCoordinates()[1] + "&distance=" + distance + "&address=" + i;
        $http.get(url, {
            timeout: 5000
        }).
        success(function (data, status, headers, config) {
            places = [];
            //            places = data.response.docs;
            //store the data
            //return the labels
            k = 0;
            for (var i = 0; i < data.response.docs.length; i++) {
                temp = '';
                if (data.response.docs[i].name)
                    temp = temp + data.response.docs[i].name;
                if (data.response.docs[i].street != data.response.docs[i].name)
                    if (data.response.docs[i].street) {
                        if (temp)
                            temp = temp + ', ';
                        temp = temp + data.response.docs[i].street;
                    }
                if (data.response.docs[i].housenumber) {
                    if (temp)
                        temp = temp + ', ';
                    temp = temp + data.response.docs[i].housenumber;
                }
                if (data.response.docs[i].city) {
                    if (temp)
                        temp = temp + ', ';
                    temp = temp + data.response.docs[i].city;
                }

                //check se presente
                if (!places[temp]) {
                    //se non presente
                    names[k] = temp;
                    k++
                    places[temp] = {
                        latlong: data.response.docs[i].coordinate
                    }
                }
            }
            placedata.resolve(names);
        }).
        error(function (data, status, headers, config) {
            //            $scope.error = true;
        });
        return placedata.promise;
    }

    return PlacesRetriever;
})

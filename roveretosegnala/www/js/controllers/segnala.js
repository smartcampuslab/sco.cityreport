angular.module('roveretoSegnala.controllers.segnala', [])

.factory('segnalaService', function ($http, $q) {
    var clientId = 'b790f7d57013adb';
    var clientSecret = '55b0409e29c9461564ddaacc7fd10b23a6ffd507';
    var latlong = [0, 0];
    var segnalaService = {};
    var name = '';
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

    return segnalaService;
})

.controller('Map4AdrressCtrl', function ($scope, $location, $window, $q, $http, $ionicPopup, leafletData, archiveService, segnalaService) {

        leafletData.getMap().then(function (map) {
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18
            }).addTo(map);
        });
        $scope.$on("leafletDirectiveMap.click", function (event, args) {
            segnalaService.setPosition(args.leafletEvent.latlng.lat, args.leafletEvent.latlng.lng);
            alert(args.leafletEvent.latlng.lat + ' ' + args.leafletEvent.latlng.lng);
            var placedata = $q.defer();
            var places = {};
            var url = "https://os.smartcommunitylab.it/core.geocoder/spring/location?latlng=" + args.leafletEvent.latlng.lat + ',' + args.leafletEvent.latlng.lng;

            $http.get(encodeURI(url)).
            success(function (data, status, headers, config) {
                places = data.response.docs;
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


                    $scope.showConfirm(name);
                } else {
                    $scope.showNoPlace();
                }
            }).
            error(function (data, status, headers, config) {
                //            $scope.error = true;
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
                title: 'Is it the right place?',
                template: name
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    segnalaService.setPosition(segnalaService.getPosition()[0], segnalaService.getPosition()[1]);
                    segnalaService.setName(name);
                    //                    window.history.back();
                    window.location.assign('#/app/segnala/' + name);
                } else {

                    console.log('You are not sure');
                }
            });
        }
        $scope.showNoPlace = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Don\'t eat that!',
                template: 'It might taste good'
            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };
        angular.extend($scope, {
            center: {
                lat: 45.849036,
                lng: 11.233380,
                zoom: 8
            },
            events: {}
        });

    })
    .controller('SegnalaCtrl', function ($scope, $cordovaCamera, $cordovaFile, $window, $q, $http, $ionicPopup, $stateParams, segnalaService, PlacesRetriever) {

        // 1
        $scope.images = [];
        $scope.placesandcoordinates = {};
        $scope.openMap4Address = function () {
            window.location.assign('#/app/map4address');
        }

        $scope.addImage = function (wherePic) {
            var options = {};

            // 2
            if (wherePic == 'Camera') {
                options = {
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                    popoverOptions: CameraPopoverOptions,
                };
            } else {
                options = {
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY, // Camera.PictureSourceType.PHOTOLIBRARY
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                    popoverOptions: CameraPopoverOptions,
                };
            }
            // 3
            $cordovaCamera.getPicture(options).then(function (imageData) {

                // 4
                onImageSuccess(imageData);

                function onImageSuccess(fileURI) {
                    createFileEntry(fileURI);
                }

                function createFileEntry(fileURI) {
                    window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                }

                // 5
                function copyFile(fileEntry) {
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    var newName = makeid() + name;

                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
                            fileEntry.copyTo(
                                fileSystem2,
                                newName,
                                onCopySuccess,
                                fail
                            );
                        },
                        fail);
                }

                // 6
                function onCopySuccess(entry) {
                    $scope.$apply(function () {
                        $scope.images.push(entry.nativeURL);
                    });
                }

                function fail(error) {
                    console.log("fail: " + error.code);
                }

                function makeid() {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (var i = 0; i < 5; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    return text;
                }

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

        $scope.doSomething = function (typedthings) {
            console.log("Do something like reload data with this: " + typedthings);
            $scope.newplaces = PlacesRetriever.getplaces(typedthings);
            $scope.newplaces.then(function (data) {
                $scope.places = data;
                $scope.placesandcoordinates = PlacesRetriever.getnames();

            });
        }

        $scope.doSomethingElse = function (suggestion) {
            console.log("Suggestion selected: " + suggestion);

        }

        $scope.urlForImage = function (imageName) {
            var name = imageName.substr(imageName.lastIndexOf('/') + 1);
            var trueOrigin = cordova.file.dataDirectory + name;
            return trueOrigin;
        }

        $scope.locateMe = function () {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.$apply(function () {
                        $scope.position = position;
                        alert(position.coords.latitude + ' ' + position.coords.longitude);
                        var placedata = $q.defer();
                        var places = {};
                        var url = "https://os.smartcommunitylab.it/core.geocoder/spring/location?latlng=" + position.coords.latitude + ',' + position.coords.longitude;

                        $http.get(encodeURI(url)).
                        success(function (data, status, headers, config) {
                            places = data.response.docs;
                            //show a pop up where u can choose if address is correct and set up in the bar
                            // A confirm dialog
                            name = '';
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


                            $scope.showConfirm(name, position.coords.latitude, position.coords.longitude);
                        }).
                        error(function (data, status, headers, config) {
                            //            $scope.error = true;
                        });


                    });
                },
                function (error) {
                    alert(error);
                });
        };
        $scope.changeString = function (suggestion) {
            // segnalaService.setPosition(position.coords.latitude, position.coords.longitude);
            //            alert($scope.placesandcoordinates[suggestion].latlong);
            segnalaService.setPosition($scope.placesandcoordinates[suggestion].latlong.split(',')[0], $scope.placesandcoordinates[suggestion].latlong.split(',')[1]);
        }

        $scope.setAutocomplete = function () {
            if ($stateParams.place) {
                $scope.result = $stateParams.place;
            } else {
                $scope.resul = '';
            }
        }
        $scope.data = {
            firstname: "default",
            emailaddress: "default",
            gender: "default",
            member: false,
            file_profile: "default",
            file_avatar: "default"
        };
        $scope.submit = function () {
            alert("posting data...." + segnalaService.getPosition());
            //            $http.post('http://posttestserver.com/post.php?dir=jsfiddle', JSON.stringify(data)).success(function () { /*success callback*/ });
        }

        $scope.showConfirm = function (name, lat, long) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Is it the right place?',
                template: name
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    $scope.result = name;
                    segnalaService.setPosition(lat, long);

                } else {
                    console.log('You are not sure');
                }
            });
        }
    })


.factory('PlacesRetriever', function ($http, $q, $timeout) {
    var PlacesRetriever = new Object();
    var roveretoLatLng = '45.891575,11.037414';
    var distance = '50';
    var places = {};
    PlacesRetriever.getnames = function (i) {
        return places;
    }
    PlacesRetriever.getplaces = function (i) {
        var placedata = $q.defer();
        var names = [];
        var url = "https://os.smartcommunitylab.it/core.geocoder/spring/address?address=" + i + "&latlng=" + roveretoLatLng + "&distance=" + distance;

        $http.get(encodeURI(url)).
        success(function (data, status, headers, config) {
            places = [];
            //            places = data.response.docs;
            //store the data
            //return the labels
            k = 0;
            for (var i = 0; i < data.response.docs.length; i++) {
                temp = '';
                if (data.response.docs[i].street)
                    temp = temp + data.response.docs[i].street;
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
angular.module('roveretoSegnala.controllers.segnala', [])

.factory('segnalaService', function ($http, $q, Config) {
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

        //        return $http.post(Config.URL() + '/' + Config.provider() + '/services/' + Config.service() + '/issues')
        //            .then(function (response) {
        //                if (typeof response.data === 'object') {
        //                    return response.data;
        //                } else {
        //                    // invalid response
        //                    return $q.reject(response.data);
        //                }
        //
        //            }, function (response) {
        //                // something went wrong
        //                return $q.reject(response.data);
        //            });

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
                title: $filter('translate')("signal_send_confirm place_title"),
                template: name
            });
            confirmPopup.then(function (res) {
                if (res) {
                    segnalaService.setPosition(segnalaService.getPosition()[0], segnalaService.getPosition()[1]);
                    segnalaService.setName(name);
                    //                    window.history.back();
                    window.location.assign('#/app/segnala/' + name);
                }
            });
        }
        $scope.showNoPlace = function () {
            var alertPopup = $ionicPopup.alert({
                title: $filter('translate')("signal_send_no_place_title"),
                template: $filter('translate')("signal_send_no_place_template")
            });
            alertPopup.then(function (res) {
                console.log('no place');
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
    .controller('SegnalaCtrl', function ($scope, $cordovaCamera, $cordovaFile, $window, $q, $http, $filter, $ionicPopup, $ionicLoading, $stateParams, segnalaService, PlacesRetriever) {
        $scope.categories = [
            {
                label: $filter('translate')("segnala_category_1"),
                value: 1
            },
            {
                label: $filter('translate')("segnala_category_2"),
                value: 2
            },
            {
                label: $filter('translate')("segnala_category_3"),
                value: 2
            }
  ];
        $scope.selectedCategory = $scope.categories[1];
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
        $scope.removeImage = function (imageName) {
            var index = $scope.images.indexOf(imageName);
            if (index > -1) {
                $scope.images.splice(index, 1);
            }

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
            $scope.signal.location.address = suggestion;
        }

        $scope.setAutocomplete = function () {
            if ($stateParams.place) {
                $scope.result = $stateParams.place;
            } else {
                $scope.resul = '';
            }
        }

        $scope.submit = function () {
            var remoteURL = [];
            $scope.signal.location.coordinates = segnalaService.getPosition();
            $scope.signal.media = $scope.images;
            $scope.signal.attribute.category = $scope.selectedCategory.value;
            if ($scope.checkForm($scope.signal)) {
                $ionicLoading.show({
                    template: 'Loading...'
                });
                var uploadedimages = 0;
                for (var i = 0; i < $scope.signal.media.length; i++) {
                    $http({
                        method: 'POST',
                        url: 'https://api.imgur.com/3/image',
                        headers: {
                            Authorization: 'Client-ID b790f7d57013adb',
                            Accept: 'application/json'
                        },
                        data: {
                            image: $scope.getBase64Image($scope.signal.media[i]),
                            type: 'base64'

                        }
                    }).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        remoteURL.push(data.data.link);
                        uploadedimages++
                        //send to ws the server
                        if (uploadedimages == $scope.signal.media.length) {
                            $scope.signal.media = remoteURL;
                            segnalaService.sendSignal($scope.signal).then(function (data) {
                                //chiudi pop up bella la' e esci
                                $ionicLoading.hide();
                                alert("upload images success. No send data to server...." + segnalaService.getPosition());

                            }, function (error) {
                                $ionicLoading.hide();
                                alert("problems" + data + status + headers + config);

                                //chiudi pop up ed errore sul server smarcommunity
                            });
                        }
                    }).
                    error(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        alert("problems" + data + status + headers + config);
                        //chiudi pop up ed errore sul server immagini

                    });
                }
                //                $ionicLoading.hide();
            } else {
                //show popup 
                var alertPopup = $ionicPopup.alert({
                    title: $filter('translate')("signal_error_send_title"),
                    template: $filter('translate')("signal_error_send_template")
                });
                alertPopup.then(function (res) {
                    console.log('error');
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
            if (!signal.location.coordinates) {
                check = false;
            }
            return check;
        }
        $scope.getBase64Image = function (img) {
            var image = new Image();
            image.src = img;
            // Create an empty canvas element
            var canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;

            // Copy the image contents to the canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);

            // Get the data-URL formatted image
            // Firefox supports PNG and JPEG. You could check img.src to
            // guess the original format, but be aware the using "image/jpg"
            // will re-encode the image.
            var dataURL = canvas.toDataURL("image/png");

            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }
        $scope.showConfirm = function (name, lat, long) {
            var confirmPopup = $ionicPopup.confirm({
                title: $filter('translate')("signal_send_confirm place_title"),
                template: name
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.result = name;
                    segnalaService.setPosition(lat, long);

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
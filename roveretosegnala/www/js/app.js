// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('roveretoSegnala', [
    'ionic',
    'ngCordova',
    'leaflet-directive',
//    'openlayers-directive',
    'roveretoSegnala.controllers.common',
    'roveretoSegnala.controllers.archive',
    'roveretoSegnala.controllers.map',
    'roveretoSegnala.controllers.segnala',
    'roveretoSegnala.filters',
    'roveretoSegnala.directives',
    'roveretoSegnala.services.conf',
    'roveretoSegnala.services.login',

])

.run(function ($ionicPlatform, $rootScope, $state, Login) {
    $rootScope.userIsLogged = (localStorage.userId != null);

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        if (typeof navigator.globalization !== "undefined") {
            navigator.globalization.getPreferredLanguage(function (language) {
                if ((language.value).split("-")[0] == "it") {
                    $rootScope.lang = "it";
                } else if ((language.value).split("-")[0] == "de") {
                    $rootScope.lang = "de";
                } else {
                    $rootScope.lang = "en";
                }
            }, null);
        }
    });
    $rootScope.login = function () {
        Login.login();
    };

    $rootScope.logout = function () {
        Login.logout();

    };

})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })


    .state('app.segnala', {
            cache: false,
            url: "/segnala/:place",
            views: {
                'menuContent': {
                    templateUrl: "templates/segnala.html",
                    controller: 'SegnalaCtrl'

                }
            }
        })
        .state('app.tab', {
            cache: false,

            url: '/tab',
            abstract: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/tabs.html",
                    controller: 'ArchiveCtrl'

                }
            }
        })

    // Each tab has its own nav history stack:

    .state('app.tab.closed', {
        cache: false,

        url: '/closed',
        views: {
            'app-tab-closed': {
                templateUrl: 'templates/tab-closed.html',
                controller: 'ArchiveCtrl'
            }
        }
    })

    .state('app.tab.processing', {
            cache: false,

            url: '/processing',
            views: {
                'app-tab-processing': {
                    templateUrl: 'templates/tab-processing.html',
                    controller: 'ArchiveCtrl'
                }
            }
        })
        .state('app.tab.open', {
            cache: false,

            url: '/open',
            views: {
                'app-tab-open': {
                    templateUrl: 'templates/tab-open.html',
                    controller: 'ArchiveCtrl'
                }
            }
        })

    .state('app.archivio', {
        cache: false,
        url: "/archivio",
        views: {
            'menuContent': {
                templateUrl: "templates/archivio.html",
                controller: 'ArchiveCtrl'
            }
        }
    })

    .state('app.mysignals', {
            cache: false,
            url: "/mysignals",
            views: {
                'menuContent': {
                    templateUrl: "templates/mysignals.html",
                    controller: 'MySignalsCtrl'
                }
            }
        })
        .state('app.archiviodetail', {
            cache: false,
            url: '/archiviodetail/:id',
            views: {
                'menuContent': {
                    templateUrl: 'templates/archiviodetail.html',
                    controller: 'ArchivioDetailCtrl'
                }
            }
        })

    .state('app.map4address', {
            cache: false,

            url: "/map4address",
            views: {
                'menuContent': {
                    templateUrl: "templates/map4address.html",
                    controller: 'Map4AdrressCtrl'
                }
            }
        })
        .state('app.map', {
            cache: false,
            url: "/map",
            views: {
                'menuContent': {
                    templateUrl: "templates/map.html",
                    controller: 'MapCtrl'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/map');
});
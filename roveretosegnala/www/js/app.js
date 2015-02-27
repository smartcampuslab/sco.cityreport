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

.run(function ($ionicPlatform) {
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
    });
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
        url: "/segnala/:place",
        views: {
            'menuContent': {
                templateUrl: "templates/segnala.html",
                controller: 'SegnalaCtrl'

            }
        }
    })


    .state('app.archivio', {
        url: "/archivio",
        views: {
            'menuContent': {
                templateUrl: "templates/archivio.html",
                controller: 'ArchiveCtrl'
            }
        }
    })

    .state('app.mysignals', {
            url: "/mysignals",
            views: {
                'menuContent': {
                    templateUrl: "templates/mysignals.html",
                    controller: 'MySignalsCtrl'
                }
            }
        })
        .state('app.archiviodetail', {
            url: '/archiviodetail/:id',
            views: {
                'menuContent': {
                    templateUrl: 'templates/archiviodetail.html',
                    controller: 'ArchivioDetailCtrl'
                }
            }
        })

    /* .state('app.credits', {
     url: "/credits",
     views: {
         'menuContent': {
             templateUrl: "templates/credits.html",
         }
     }
 })*/
    .state('app.map4address', {
            url: "/map4address",
            views: {
                'menuContent': {
                    templateUrl: "templates/map4address.html",
                    controller: 'Map4AdrressCtrl'
                }
            }
        })
        .state('app.map', {
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
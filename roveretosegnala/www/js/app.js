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
    'pascalprecht.translate',
    'roveretoSegnala.controllers.common',
    'roveretoSegnala.controllers.archive',
    'roveretoSegnala.controllers.map',
    'roveretoSegnala.controllers.segnala',
    'roveretoSegnala.filters',
    'roveretoSegnala.directives',
    'roveretoSegnala.services.conf',
    'roveretoSegnala.services.login',
 'services.geo'

])

.run(function ($ionicPlatform, $rootScope, $cordovaSplashscreen, $state, $translate, Login, GeoLocate) {
    $rootScope.showmap = false;
    $rootScope.userIsLogged = (localStorage.userId != null && localStorage.userId != "null");

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
                $translate.use((language.value).split("-")[0]).then(function (data) {
                    console.log("SUCCESS -> " + data);
                }, function (error) {
                    console.log("ERROR -> " + error);
                });
            }, null);
        }
        Restlogging.init("http://150.241.239.65:8080");
    });
    $rootScope.login = function () {
        Login.login();
    };

    $rootScope.logout = function () {
        Login.logout();

    };

    // for BlackBerry 10, WP8, iOS
    setTimeout(function () {
        $cordovaSplashscreen.hide();
        //navigator.splashscreen.hide();
    }, 3000);

    $rootScope.locationWatchID = undefined;
    //  ionic.Platform.fullScreen(false,true);
    if (typeof (Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        }
    }
    document.addEventListener("pause", function () {
        console.log('app paused');
        if (typeof $rootScope.locationWatchID != 'undefined') {
            navigator.geolocation.clearWatch($rootScope.locationWatchID);
            $rootScope.locationWatchID = undefined;
            GeoLocate.reset();
            console.log('geolocation reset');
        }
    }, false);
    document.addEventListener("resume", function () {
        console.log('app resumed');
        GeoLocate.locate();
    }, false);
    GeoLocate.locate().then(function (position) {
        $rootScope.myPosition = position;
        //console.log('first geolocation: ' + position);
    }, function () {
        console.log('CANNOT LOCATE!');
    });



})

.config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
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

    $translateProvider.translations('it', {
        map_title: "Mappa",
        credits_title: 'Credits',
        credits_app: 'Rovereto Segnala',
        credits_project: 'Un progetto di:',
        credits_sponsored: 'Con la collaborazione di:',
        credits_info: 'Per informazioni:',
        archive_title: 'Archivio',
        archive_closed: 'Chiusi',
        archive_waiting: 'Aperti',
        archive_running: 'In corso',
        map_title: 'Mappa',
        archivedetail_headtitle: 'Segnala',
        segnala_title: 'Segnala',
        my_signals_title: 'Le mie segnalazioni',
        segnala_input_title: 'Titolo',
        segnala_input_description: 'Descrizione',
        segnala_input_address: 'Indirizzo',
        segnala_label_categories: 'Categoria',
        segnala_label_public: 'Pubblica',
        segnala_button_send: 'Invia segnalazione',
        popup_title: 'Titolo',
        popup_description: 'Descrizione',
        popup_address: 'Indirizzo',
        popup_address: 'Indirizzo',
        archivedetail_headtitle: 'Segnalazione',
        archivedetail_title: 'Dettagli',
        archivedetail_images: 'Immagini',
        archivedetail_description: 'Descrizione',
        archivedetail_address: 'Indirizzo',
        archivedetail_category: 'Categoria',
        archivedetail_pictures: 'Immagini',
        segnala_category_1: 'Ambiente e territorio',
        segnala_category_2: 'Commercio e negozi',
        segnala_category_3: 'Cultura, turismo e tempo libero',
        segnala_category_4: 'Lavori pubblici',
        segnala_category_5: 'Lavoro',
        segnala_category_6: 'Trasporti',
        signal_error_send_title: 'Errore',
        signal_error_send_template: 'Errore nell\'inviare i dati',
        signal_send_confirm_place_title: 'Confermare l\'indirizzo trovato',
        signal_send_no_place_title: 'Nessun posto trovato',
        signal_send_no_place_template: 'Selezionare una posizione diversa',
        segnala_input_place_suggestion: 'Indirizzo...',
        signal_send_toast_ok: 'Nuova segnalazione inviata con successo',
        signal_send_toast_error: 'Problema nell\'invio della segnalazione',
        signal_send_popup_ok: 'OK',
        signal_send_popup_cancel: 'Chiudi',
        signal_send_toast_alarm: 'Chiudi',
        menu_map: 'Mappa',
        menu_segnala: 'Segnala',
        menu_archivio: 'Archivio',
        menu_lemiesegnalazioni: 'Le mie segnalazioni',
        menu_login: 'Login',
        menu_credits: 'Credits',
        status_open: 'Aperto',
        status_closed: 'Chiuso',
        status_processing: 'In corso',
        toast_must_login: 'Funzione disabilitata. Devi accedere al sistema',
        menu_logout: 'Esci',
        archive_empty_list: 'Nessuna segnalazione presente',
        signal_send_no_connection_title: 'Errore',
        signal_send_no_connection_template: 'Problemi di connessione'

    });
    $translateProvider.translations('en', {
        map_title: "Map",
        credits_title: 'Credits',
        credits_app: 'Rovereto Reports',
        credits_project: 'A project by:',
        credits_sponsored: 'In collaboration with:',
        credits_info: 'Further information:',
        archive_title: 'Archive',
        archive_closed: 'Closed',
        archive_waiting: 'Open',
        archive_running: 'Processing',
        map_title: 'Map',
        archivedetail_headtitle: 'Report',
        segnala_title: 'Report',
        my_signals_title: 'My issues',
        segnala_input_title: 'Title',
        segnala_input_description: 'Description',
        segnala_input_address: 'Address',
        segnala_label_categories: 'Category',
        segnala_label_public: 'Public',
        segnala_button_send: 'Send report',
        popup_title: 'Title',
        popup_description: 'Description',
        popup_address: 'Address',
        popup_address: 'Address',
        archivedetail_headtitle: 'Signal',
        archivedetail_title: 'Details',
        archivedetail_images: 'Images',
        archivedetail_description: 'Description',
        archivedetail_address: 'Address',
        archivedetail_category: 'Category',
        archivedetail_pictures: 'Pictures',
        segnala_category_1: 'Environment and territory',
        segnala_category_2: 'Market and shops',
        segnala_category_3: 'Culture, leisure and tourism',
        segnala_category_4: 'Public works',
        segnala_category_5: 'Work',
        segnala_category_6: 'Transportation',
        signal_error_send_title: 'Error',
        signal_error_send_template: 'Error sending data',
        signal_send_confirm_place_title: 'Please, confirm the address found',
        signal_send_no_place_title: 'No places found',
        signal_send_no_place_template: 'Please, select a different position',
        segnala_input_place_suggestion: 'Place...',
        signal_send_toast_ok: 'New issue submitted successfuylly',
        signal_send_toast_error: 'Error sending the issue',
        signal_send_popup_ok: 'OK',
        signal_send_popup_cancel: 'Close ',
        signal_send_toast_alarm: 'Close ',
        menu_map: 'Map',
        menu_segnala: 'New Issue',
        menu_archivio: 'Archive',
        menu_lemiesegnalazioni: 'My issues',
        menu_login: 'Login',
        menu_credits: 'Credits',
        status_open: 'Open',
        status_closed: 'Closed',
        status_processing: 'Processing',
        toast_must_login: 'Function disabled. You must login',
        menu_logout: 'Logout',
        archive_empty_list: 'No issues',
        signal_send_no_connection_title: 'Error',
        signal_send_no_connection_template: 'Connection problem'


    });
    $translateProvider.translations('de', {
        map_title: "Karte",
        credits_title: 'Credits',
        credits_app: 'Rovereto Berichte',
        credits_project: 'Ein projekt:',
        credits_sponsored: 'In Zusammenarbeit mit der:',
        credits_info: 'Informationen:',
        archive_title: 'Archivieren',
        archive_closed: 'Entschlossen',
        archive_waiting: 'Wartestellung',
        archive_running: 'Im Gange',
        map_title: 'Karte',
        archivedetail_headtitle: 'Berichte',
        segnala_title: 'Berichte',
        my_signals_title: 'Meine Berichte',
        segnala_input_title: 'Berichte',
        segnala_input_description: 'Berichte',
        segnala_input_address: 'Berichte',
        segnala_label_categories: 'Kategorie',
        segnala_label_public: 'Öffentlichkeit',
        segnala_button_send: 'Zukommen Lassen',
        popup_title: 'Titel',
        popup_description: 'Beschreibung',
        popup_address: 'Adresse',
        popup_address: 'Adresse',
        archivedetail_headtitle: 'Adresse',
        archivedetail_title: 'Adresse',
        archivedetail_images: 'Bilder',
        archivedetail_description: 'Adresse',
        archivedetail_address: 'Adresse',
        archivedetail_category: 'Adresse',
        archivedetail_pictures: 'Adresse',
        segnala_category_1: 'Umfeld und Gebiet',
        segnala_category_2: 'Handel und Geschäfte',
        segnala_category_3: 'Kultur, Freizeit und Tourismus',
        segnala_category_4: 'Öffentliche Arbeiten',
        segnala_category_5: 'Arbeit',
        segnala_category_6: 'Transport',
        signal_error_send_title: 'Fehler',
        signal_error_send_template: 'Fehler beim Senden der Daten',
        signal_send_confirm_place_title: 'Bitte, bestätigen Sie die Adresse gefunden',
        signal_send_no_place_title: 'Keine Unterkünfte gefunden',
        signal_send_no_place_template: 'Bitte wählen Sie eine andere Positione',
        segnala_input_place_suggestion: 'Straße...',
        signal_send_toast_ok: 'Neuer Bericht erfolgreich gesendet',
        signal_send_toast_error: 'Fehler beim Senden der Warnung',
        signal_send_popup_ok: 'OK',
        signal_send_popup_cancel: 'schließen',
        signal_send_toast_alarm: 'schließen',
        menu_map: 'Karte',
        menu_segnala: 'Neuer Bericht',
        menu_archivio: 'Archivieren',
        menu_lemiesegnalazioni: 'Meine Berichte',
        menu_login: 'Login',
        menu_credits: 'Credits',
        status_open: 'Geöffnet',
        status_closed: 'Geschlossen',
        status_processing: 'Wird bearbeitet',
        toast_must_login: 'Wird bearbeitet',
        menu_logout: 'Logout',
        archive_empty_list: 'kein Bericht',
        signal_send_no_connection_title: 'Fehler',
        signal_send_no_connection_template: 'Verbindungsprobleme'

    });




    $translateProvider.preferredLanguage("en");
    $translateProvider.fallbackLanguage("en");
});
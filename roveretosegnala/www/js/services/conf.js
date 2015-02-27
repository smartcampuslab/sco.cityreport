angular.module('roveretoSegnala.services.conf', [])

.factory('Config', function ($q, $http, $window, $filter, $rootScope) {

    var URL = 'https://dev.smartcommunitylab.it/cityreport';
    var provider = 'ComuneRovereto';
    var service = 'problems';

    var cityName = {
        'it': 'Trento',
        'en': 'Trento',
        'de': 'Trento'
    };


    var keys = {
        'credits_title': {
            it: 'Credits',
            en: 'Credits',
            de: 'Credits'
        },
        'credits_app': {
            it: 'Rovereto Segnala',
            en: 'Rovereto Reports',
            de: 'Rovereto Berichte'
        },

        'credits_project': {
            it: 'Un progetto di:',
            en: 'A project by:',
            de: 'Ein projekt:'
        },
        'credits_sponsored': {
            it: 'Con la collaborazione di:',
            en: 'In collaboration with:',
            de: 'In Zusammenarbeit mit der:'
        },
        'credits_info': {
            it: 'Per informazioni:',
            en: 'Further information:',
            de: 'Informationen:'
        },
        'archive_title': {
            it: 'Archivio',
            en: 'Archivieren',
            de: 'Archive'
        },
        'archive_closed': {
            it: 'Risolto',
            en: 'Solved',
            de: 'Entschlossen'
        },
        'archive_waiting': {
            it: 'In attesa',
            en: 'Waiting',
            de: 'Wartestellung'
        },
        'archive_running': {
            it: 'In corso',
            en: 'Running',
            de: 'Im Gange'
        },
        'map_title': {
            it: 'Mappa',
            en: 'Map',
            de: 'Karte'
        },
        'archivedetail_headtitle': {
            it: 'Segnala',
            en: 'Report',
            de: 'Berichte'
        },
        'segnala_title': {
            it: 'Segnala',
            en: 'Report',
            de: 'Berichte'
        },
        'segnala_input_title': {
            it: 'Titolo',
            en: 'Title',
            de: 'Berichte'
        },
        'segnala_input_description': {
            it: 'Descrizione',
            en: 'Description',
            de: 'Berichte'
        },
        'segnala_input_address': {
            it: 'Indirizzo',
            en: 'Address',
            de: 'Berichte'
        },
        'segnala_label_categories': {
            it: 'Categoria',
            en: 'Category',
            de: 'Kategorie'
        },
        'segnala_label_public': {
            it: 'Pubblica',
            en: 'Public',
            de: 'Öffentlichkeit'
        },
        'segnala_button_send': {
            it: 'Invia segnalazione',
            en: 'Send report',
            de: 'Zukommen Lassen'
        },
        'popup_title': {
            it: 'Titolo',
            en: 'Title',
            de: 'Titel'
        },
        'popup_description': {
            it: 'Descrizione',
            en: 'Description',
            de: 'Beschreibung'
        },
        'popup_address': {
            it: 'Indirizzo',
            en: 'Address',
            de: 'Adresse'
        },
        'popup_address': {
            it: 'Indirizzo',
            en: 'Address',
            de: 'Adresse'
        },
        'archivedetail_headtitle': {
            it: 'Segnalazione',
            en: 'Signal',
            de: 'Adresse'
        },
        'archivedetail_title': {
            it: 'Dettagli',
            en: 'Details',
            de: 'Adresse'
        },
        'archivedetail_description': {
            it: 'Descrizione',
            en: 'Description',
            de: 'Adresse'
        },
        'archivedetail_address': {
            it: 'Indirizzo',
            en: 'Address',
            de: 'Adresse'
        },
        'archivedetail_category': {
            it: 'Cateoria',
            en: 'Category',
            de: 'Adresse'
        },
        'archivedetail_pictures': {
            it: 'Immagini',
            en: 'Pictures',
            de: 'Adresse'
        },
        'segnala_category_1': {
            it: 'Categoria 1',
            en: 'Category 1',
            de: 'Categorien 1'
        },
        'segnala_category_2': {
            it: 'Categoria 2',
            en: 'Category 2',
            de: 'Categorien 2'
        },
        'segnala_category_3': {
            it: 'Categoria 3',
            en: 'Category 3',
            de: 'Categorien 3'
        },
        'signal_error_send_title': {
            it: 'Errore',
            en: 'Error',
            de: 'Fehler'
        },
        'signal_error_send_template': {
            it: 'Errore nell\'inviare i dati',
            en: 'Error sending data',
            de: 'Fehler beim Senden der Daten'
        },
        'signal_send_confirm place_title': {
            it: 'Confermare l\'indirizzo trovato',
            en: 'Please, confirm the address found',
            de: 'Bitte, bestätigen Sie die Adresse gefunden'
        },
        'signal_send_no_place_title': {
            it: 'Nessun posto trovato',
            en: 'No places found',
            de: 'Keine Unterkünfte gefunden'
        },
        'signal_send_no_place_template': {
            it: 'Selezionare una posizione diversa',
            en: 'Please, select a different position',
            de: 'Bitte wählen Sie eine andere Positione'
        },
        'segnala_input_place_suggestion': {
            it: 'digita per ottenere suggerimenti...',
            en: 'type for place suggestions...',
            de: 'geben Sie den Text für Anregungen...'
        },
        'signal_send_toast_ok': {
            it: 'Nuova segnalazione inviata con successo',
            en: 'New issue submitted successfuylly',
            de: 'Neuer Bericht erfolgreich gesendet'
        },
        'signal_send_toast_error': {
            it: 'Problema nell\'invio della segnalazione',
            en: 'Error sending the issue',
            de: 'Fehler beim Senden der Warnung'
        },
        'menu_map': {
            it: 'Mappa',
            en: 'Map',
            de: 'Karte'
        },
        'menu_segnala': {
            it: 'Segnala',
            en: 'New Issue',
            de: 'Neuer Bericht'
        },
        'menu_archivio': {
            it: 'Archivio',
            en: 'Archive',
            de: 'Archivieren'
        },
        'menu_lemiesegnalazioni': {
            it: 'Le mie segnalazioni',
            en: 'My issues',
            de: 'Meine Berichte'
        },
        'menu_login': {
            it: 'Login',
            en: 'Login',
            de: 'Login'
        },
        'menu_credits': {
            it: 'Credits',
            en: 'Credits',
            de: 'Credits'
        }

    }

    return {

        getVersion: function () {
            return 'v ' + APP_VERSION + (APP_BUILD && APP_BUILD != '' ? '<br/>(' + APP_BUILD + ')' : '');
        },
        getLang: function () {
            var browserLanguage = '';
            // works for earlier version of Android (2.3.x)
            var androidLang;
            if ($window.navigator && $window.navigator.userAgent && (androidLang = $window.navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
                browserLanguage = androidLang[1];
            } else {
                // works for iOS, Android 4.x and other devices
                browserLanguage = $window.navigator.userLanguage || $window.navigator.language;
            }
            var lang = browserLanguage.substring(0, 2);
            if (lang != 'it' && lang != 'en' && lang != 'de') lang = 'en';
            return lang;
        },
        getProfile: function () {
            //console.log('getProfile()');
            var profileLoaded = $q.defer();
            //console.log('localStorage.cachedProfile: '+localStorage.cachedProfile);
            if (localStorage.cachedProfile && localStorage.cachedProfile != 'undefined' && localStorage.cachedProfile != 'null') {
                //console.log('using locally cached profile');
                profileLoaded.resolve(parseConfig(JSON.parse(localStorage.cachedProfile)));
            } else {
                //console.log('getting predefined profile');
                $http.get('data/' + LOCAL_PROFILE + '.json').success(function (data, status, headers, config) {
                    localStorage.cachedProfile = JSON.stringify(data);
                    $rootScope.$emit('profileUpdated');
                    profileLoaded.resolve(parseConfig(data));
                }).error(function (data, status, headers, config) {
                    console.log('error getting predefined config "data/' + LOCAL_PROFILE + '.json"!');
                    profileLoaded.reject();
                });
            }
            return profileLoaded.promise;
        },

        highlights: function () {
            return this.getProfile().then(function (data) {
                //console.log(data.highlights[0].image);
                //data.highlights._parent={ id: 'highlights' };
                return data.highlights;
            });
        },
        navigationItems: function () {
            return this.getProfile().then(function (data) {
                return data.navigationItems;
            });
        },
        navigationItemsGroup: function (label) {
            return this.navigationItems().then(function (items) {
                for (gi = 0; gi < items.length; gi++) {
                    if (items[gi].id == label) return items[gi];
                }
                return null;
            });
        },

        keys: function () {
            return keys;
        },
        URL: function () {
            return URL;
        },
        provider: function () {
            return provider;
        },
        service: function () {
            return service;
        },

        schemaVersion: function () {
            return SCHEMA_VERSION;
        },
        getHomeHighlightsMax: function () {
            return HOME_HIGHLIGHTS_MAX;
        },
        syncUrl: function () {
            //console.log('$rootScope.TEST_CONNECTION: '+(!!$rootScope.TEST_CONNECTION));
            var SYNC_MODE = (!!$rootScope.TEST_CONNECTION ? 'syncdraft' : 'sync');
            //console.log('SYNC_MODE: '+SYNC_MODE);
            return 'https://' + SYNC_HOST + '.smartcommunitylab.it/' + SYNC_WEBAPP + '/' + SYNC_MODE + '/' + WEBAPP_MULTI + '?since=';
        },
        syncTimeoutSeconds: function () {
            //return 60 * 60; /* 60 times 60 seconds = EVERY HOUR */
            return 60 * 60 * 8; /* 60 times 60 seconds = 1 HOUR --> x8 = THREE TIMES A DAY */
            //return 60 * 60 * 24; /* 60 times 60 seconds = 1 HOUR --> x24 = ONCE A DAY */
            //return 60 * 60 * 24 * 10; /* 60 times 60 seconds = 1 HOUR --> x24 = 1 DAY x10 */
        },
        syncingOverlayTimeoutMillis: function () {
            return 50 * 1000; /* seconds before automatically hiding syncing overlay */
        },
        loadingOverlayTimeoutMillis: function () {
            return 20 * 1000; /* seconds before automatically hiding loading overlay */
        },
        fileDatadirMaxSizeMB: function () {
            return 100;
        },
        fileCleanupTimeoutSeconds: function () {
            return 60 * 60 * 12; /* 60 times 60 seconds = 1 HOUR --> x12 = TWICE A DAY */
        },
        fileCleanupOverlayTimeoutMillis: function () {
            return 20 * 1000; /* seconds before automatically hiding cleaning overlay */
        },
        contentTypesList: function () {
            return contentTypes;
        },
        contentKeyFromDbType: function (dbtype) {
            for (var contentType in contentTypes) {
                if (contentTypes.hasOwnProperty(contentType)) {
                    if (contentTypes[contentType] == dbtype) return contentType;
                }
            }
            return '';
        },
        textTypesList: function () {
            return textTypes;
        },



        cityName: function () {
            return cityName;
        },
        imagePath: function () {
            return imagePath;
        },
        dbName: function () {
            return dbName;
        },
        doProfiling: function () {
            return false;
        }
    }
})

.factory('Profiling', function (Config) {
    var reallyDoProfiling = Config.doProfiling();
    var startTimes = {};
    return {
        start2: function (label) {
            startTimes[label] = (new Date).getTime();
        },
        start: function (label) {
            if (reallyDoProfiling) this.start2(label);
        },

        _do2: function (label, details, info) {
            var startTime = startTimes[label] || -1;
            if (startTime != -1) {
                var nowTime = (new Date).getTime();
                console.log('PROFILING: ' + label + (details ? '(' + details + ')' : '') + '=' + (nowTime - startTime));
                //if (details) startTimes[label]=nowTime;
                if (!!info) console.log(info);
            }
        },
        _do: function (label, details, info) {
            if (reallyDoProfiling) this._do2(label, details);
        }
    };
})
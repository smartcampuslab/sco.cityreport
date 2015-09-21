angular.module('roveretoSegnala.services.login', [])

.factory('Login', function ($q, $http, $rootScope) {
    var UserID = null

    return {
        login: function () {
            var login_deferred = $q.defer();
            //log into the system and set UserID
            var authapi = {
                authorize: function (url) {
                    var deferred = $q.defer();

                    //Build the OAuth consent page URL
                    var authUrl = url + '/cityreport/userlogin';
                    //Open the OAuth consent page in the InAppBrowser
                    var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');
                    authWindow.addEventListener('loadstart', function (e) {
                        console.log(e);
                        var url = e.url;
                        var success = /userloginsuccess\?profile=(.+)$/.exec(url);
                        var error = /userloginerror\?error=(.+)$/.exec(url);

                        if (success || error) {
                            //Always close the browser when match is found
                            authWindow.close();
                        }

                        if (success) {
                            console.log('success:' + decodeURIComponent(success[1]));
                            deferred.resolve(JSON.parse(decodeURIComponent(success[1])));
                        } else if (error) {
                            //The user denied access to the app
                            deferred.reject({
                                error: error[1]
                            });
                        }
                    });

                    return deferred.promise;
                }
            };
            authapi.authorize("https://tn.smartcommunitylab.it").then(function (data) {
                console.log("success:" + data.userId);
                //prendi google id , metti in local storage e abilita menu
                //log
                Restlogging.appLog("AppCollaborate", "login");
                $rootScope.userIsLogged = true;
                localStorage.userId = data.userId;
                login_deferred.resolve(true);
            }, function (reason) {
                alert('Failed: ' + reason);
                //reset data
                $rootScope.userIsLogged = false;
                localStorage.userId = "null";
                login_deferred.reject(false);
            });
            return login_deferred.promise;
        },
        logout: function () {
            //return UserID
            $rootScope.userIsLogged = false;
            localStorage.userId = "null";
        },
        getUserId: function () {
            //return UserID
            return localStorage.userId;
        }

    };

})

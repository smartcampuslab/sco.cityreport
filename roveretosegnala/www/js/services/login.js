angular.module('roveretoSegnala.services.login', [])

.factory('Login', function ($q, $http) {
    var UserID = null
    return {
        login: function () {
            //log into the system and set UserID
        },
        getUserId: function () {
            //return UserID
            return 1;
        },

    };
})
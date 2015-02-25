angular.module('roveretoSegnala.controllers.archive', [])

.controller('ArchiveCtrl', function ($scope, archiveService) {

    $scope.list = {};
    archiveService.list().then(function (items) {
        $scope.list = items;
    });
    angular.extend($scope, {
        list: $scope.list
    });

})


.controller('ArchivioDetailCtrl', function ($scope, $stateParams, $filter, archiveService) {
    // "MovieService" is a service returning mock data (services.js)
    $scope.signal = archiveService.getItem($stateParams.id);
    $scope.myActiveSlide = 0;
    /*
        $scope.title = $filter('translate')("title_ar");
    */
})


.factory('archiveService', function ($http, $q, Config) {
    var items = null;
    var itemsMap = null;

    var itemsService = {};

    itemsService.getItem = function (itemId) {
        return itemsMap[itemId];
    };
    itemsService.list = function () {
        var deferred = $q.defer();
        if (items != null) {
            deferred.resolve(items);
        } else {
            items = [];

            $http({
                method: 'GET',
                url: Config.URL() + '/' + Config.provider() + '/services/' + Config.service() + '/issues'

            }).
            success(function (data, status, headers, config) {
                items = data;
                itemsMap = {};
                for (var i = 0; i < items.data.length; i++) {
                                    itemsMap[items.data[i].id] = items.data[i];
                                }
                                deferred.resolve(items);
            }).
            error(function (data, status, headers, config) {
                console.log(data + status + headers + config);
                deferred.reject(err);
            });
            //            $http.get('data/archive.json')
            //                .success(function (data) {
            //                    items = data;
            //                    itemsMap = {};
            //                    for (var i = 0; i < items.signals.length; i++) {
            //                        itemsMap[items.signals[i].id] = items.signals[i];
            //                    }
            //                    deferred.resolve(items);
            //                })
            //                .error(function (err) {
            //                    deferred.reject(err);
            //                });
        }
        return deferred.promise;
    };

    return itemsService;
});
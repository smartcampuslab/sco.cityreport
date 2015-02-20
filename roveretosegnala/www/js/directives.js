'use strict';
angular.module('roveretoSegnala.directives', [])

.directive('ngAutocomplete', function () {
        return {
            require: 'ngModel',
            scope: {
                ngModel: '=',
                options: '=?',
                details: '=?'
            },

            link: function (scope, element, attrs, controller) {

                //options for autocomplete
                var opts
                var watchEnter = false
                    //convert options provided to opts
                var initOpts = function () {

                    opts = {}
                    if (scope.options) {

                        if (scope.options.watchEnter !== true) {
                            watchEnter = false
                        } else {
                            watchEnter = true
                        }

                        if (scope.options.types) {
                            opts.types = []
                            opts.types.push(scope.options.types)
                            scope.gPlace.setTypes(opts.types)
                        } else {
                            scope.gPlace.setTypes([])
                        }

                        if (scope.options.bounds) {
                            opts.bounds = scope.options.bounds
                            scope.gPlace.setBounds(opts.bounds)
                        } else {
                            scope.gPlace.setBounds(null)
                        }

                        if (scope.options.country) {
                            opts.componentRestrictions = {
                                country: scope.options.country
                            }
                            scope.gPlace.setComponentRestrictions(opts.componentRestrictions)
                        } else {
                            scope.gPlace.setComponentRestrictions(null)
                        }
                    }
                }

                if (scope.gPlace == undefined) {
                    scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
                }
                google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                    var result = scope.gPlace.getPlace();
                    scope.latitude = result.geometry.location.lat();
                    scope.longitude = result.geometry.location.lng();
                    //                alert(latitude);
                    //                alert(longitude);
                    if (result !== undefined) {
                        if (result.address_components !== undefined) {

                            scope.$apply(function () {

                                //                            scope.details = result;
                                //                            controller.$setViewValue(element.val());
                                scope.details = result;
                                controller.$setViewValue(result);
                            });
                        } else {
                            if (watchEnter) {
                                getPlace(result)
                            }
                        }
                    }
                })

                //function to get retrieve the autocompletes first result using the AutocompleteService 
                var getPlace = function (result) {
                    var autocompleteService = new google.maps.places.AutocompleteService();
                    if (result.name.length > 0) {
                        autocompleteService.getPlacePredictions({
                                input: result.name,
                                offset: result.name.length
                            },
                            function listentoresult(list, status) {
                                if (list == null || list.length == 0) {

                                    scope.$apply(function () {
                                        scope.details = null;
                                    });

                                } else {
                                    var placesService = new google.maps.places.PlacesService(element[0]);
                                    placesService.getDetails({
                                            'reference': list[0].reference
                                        },
                                        function detailsresult(detailsResult, placesServiceStatus) {

                                            if (placesServiceStatus == google.maps.GeocoderStatus.OK) {

                                                scope.$apply(function () {

                                                    controller.$setViewValue(detailsResult.formatted_address);
                                                    element.val(detailsResult.formatted_address);

                                                    scope.details = detailsResult;

                                                    //on focusout the value reverts, need to set it again.
                                                    var watchFocusOut = element.on('focusout', function (event) {
                                                        element.val(detailsResult.formatted_address);
                                                        element.unbind('focusout')
                                                    })

                                                });
                                            }
                                        }
                                    );
                                }
                            });
                    }
                }

                controller.$render = function () {
                    var location = controller.$viewValue;
                    element.val(location);
                };

                //watch options provided to directive
                scope.watchOptions = function () {
                    return scope.options
                };
                scope.$watch(scope.watchOptions, function () {
                    initOpts()
                }, true);

            }
        };
    }

)

.directive('placeautocomplete', function () {
    var index = -1;

    return {
        restrict: 'E',
        scope: {
            searchParam: '=ngModel',
            suggestions: '=data',
            onType: '=onType',
            onSelect: '=onSelect',
            placeautocompleteRequired: '='
        },
        controller: ['$scope', function ($scope) {
            // the index of the suggestions that's currently selected
            $scope.selectedIndex = -1;

            $scope.initLock = true;

            // set new index
            $scope.setIndex = function (i) {
                $scope.selectedIndex = parseInt(i);
            };

            this.setIndex = function (i) {
                $scope.setIndex(i);
                $scope.$apply();
            };

            $scope.getIndex = function (i) {
                return $scope.selectedIndex;
            };

            // watches if the parameter filter should be changed
            var watching = true;

            // autocompleting drop down on/off
            $scope.completing = false;

            // starts autocompleting on typing in something
            $scope.$watch('searchParam', function (newValue, oldValue) {

                if (oldValue === newValue || (!oldValue && $scope.initLock)) {
                    return;
                }

                if (watching && typeof $scope.searchParam !== 'undefined' && $scope.searchParam !== null) {
                    $scope.completing = true;
                    $scope.searchFilter = $scope.searchParam;
                    $scope.selectedIndex = -1;
                }

                // function thats passed to on-type attribute gets executed
                if ($scope.onType)
                    $scope.onType($scope.searchParam);
            });

            // for hovering over suggestions
            this.preSelect = function (suggestion) {

                watching = false;

                // this line determines if it is shown
                // in the input field before it's selected:
                //$scope.searchParam = suggestion;

                $scope.$apply();
                watching = true;

            };

            $scope.preSelect = this.preSelect;

            this.preSelectOff = function () {
                watching = true;
            };

            $scope.preSelectOff = this.preSelectOff;

            // selecting a suggestion with RIGHT ARROW or ENTER
            $scope.select = function (suggestion) {
                if (suggestion) {
                    $scope.searchParam = suggestion;
                    $scope.searchFilter = suggestion;
                    if ($scope.onSelect)
                        $scope.onSelect(suggestion);
                }
                watching = false;
                $scope.completing = false;
                setTimeout(function () {
                    watching = true;
                }, 1000);
                $scope.setIndex(-1);
            };


    }],
        link: function (scope, element, attrs) {

            setTimeout(function () {
                scope.initLock = false;
                scope.$apply();
            }, 250);

            var attr = '';

            // Default atts
            scope.attrs = {
                "placeholder": "start typing...",
                "class": "",
                "id": "",
                "inputclass": "",
                "inputid": ""
            };

            for (var a in attrs) {
                attr = a.replace('attr', '').toLowerCase();
                // add attribute overriding defaults
                // and preventing duplication
                if (a.indexOf('attr') === 0) {
                    scope.attrs[attr] = attrs[a];
                }
            }

            if (attrs.clickActivation) {
                element[0].onclick = function (e) {
                    if (!scope.searchParam) {
                        setTimeout(function () {
                            scope.completing = true;
                            scope.$apply();
                        }, 200);
                    }
                };
            }

            var key = {
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                enter: 13,
                esc: 27,
                tab: 9
            };

            document.addEventListener("keydown", function (e) {
                var keycode = e.keyCode || e.which;

                switch (keycode) {
                case key.esc:
                    // disable suggestions on escape
                    scope.select();
                    scope.setIndex(-1);
                    scope.$apply();
                    e.preventDefault();
                }
            }, true);

            document.addEventListener("blur", function (e) {
                // disable suggestions on blur
                // we do a timeout to prevent hiding it before a click event is registered
                setTimeout(function () {
                    scope.select();
                    scope.setIndex(-1);
                    scope.$apply();
                }, 150);
            }, true);

            element[0].addEventListener("keydown", function (e) {
                var keycode = e.keyCode || e.which;

                var l = angular.element(this).find('li').length;

                // this allows submitting forms by pressing Enter in the autocompleted field
                if (!scope.completing || l == 0) return;

                // implementation of the up and down movement in the list of suggestions
                switch (keycode) {
                case key.up:

                    index = scope.getIndex() - 1;
                    if (index < -1) {
                        index = l - 1;
                    } else if (index >= l) {
                        index = -1;
                        scope.setIndex(index);
                        scope.preSelectOff();
                        break;
                    }
                    scope.setIndex(index);

                    if (index !== -1)
                        scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

                    scope.$apply();

                    break;
                case key.down:
                    index = scope.getIndex() + 1;
                    if (index < -1) {
                        index = l - 1;
                    } else if (index >= l) {
                        index = -1;
                        scope.setIndex(index);
                        scope.preSelectOff();
                        scope.$apply();
                        break;
                    }
                    scope.setIndex(index);

                    if (index !== -1)
                        scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

                    break;
                case key.left:
                    break;
                case key.right:
                case key.enter:
                case key.tab:

                    index = scope.getIndex();
                    // scope.preSelectOff();
                    if (index !== -1) {
                        scope.select(angular.element(angular.element(this).find('li')[index]).text());
                        if (keycode == key.enter) {
                            e.preventDefault();
                        }
                    } else {
                        if (keycode == key.enter) {
                            scope.select();
                        }
                    }
                    scope.setIndex(-1);
                    scope.$apply();

                    break;
                case key.esc:
                    // disable suggestions on escape
                    scope.select();
                    scope.setIndex(-1);
                    scope.$apply();
                    e.preventDefault();
                    break;
                default:
                    return;
                }

            });
        },
        template: '\
        <div class="placeautocomplete {{ attrs.class }}" id="{{ attrs.id }}">\
          <input\
            type="text"\
            ng-model="searchParam"\
            placeholder="{{ attrs.placeholder }}"\
            class="{{ attrs.inputclass }}"\
            id="{{ attrs.inputid }}"\
            ng-required="{{ placeautocompleteRequired }}" />\
          <ul ng-show="completing && (suggestions | filter:searchFilter).length > 0">\
            <li\
              suggestion\
              ng-repeat="suggestion in suggestions | filter:searchFilter | orderBy:\'toString()\' track by $index"\
              index="{{ $index }}"\
              val="{{ suggestion }}"\
              ng-class="{ active: ($index === selectedIndex) }"\
              ng-click="select(suggestion)"\
              ng-bind-html="suggestion | highlight:searchParam"></li>\
          </ul>\
        </div>'
    };
})

.filter('highlight', ['$sce', function ($sce) {
    return function (input, searchParam) {
        if (typeof input === 'function') return '';
        if (searchParam) {
            var words = '(' +
                searchParam.split(/\ /).join(' |') + '|' +
                searchParam.split(/\ /).join('|') +
                ')',
                exp = new RegExp(words, 'gi');
            if (words.length) {
                input = input.replace(exp, "<span class=\"highlight\">$1</span>");
            }
        }
        return $sce.trustAsHtml(input);
    };
}])

.directive('suggestion', function () {
    return {
        restrict: 'A',
        require: '^placeautocomplete', // ^look for controller on parents element
        link: function (scope, element, attrs, autoCtrl) {
            element.bind('mouseenter', function () {
                autoCtrl.preSelect(attrs.val);
                autoCtrl.setIndex(attrs.index);
            });

            element.bind('mouseleave', function () {
                autoCtrl.preSelectOff();
            });
        }
    };
});
// JavaScript Document
var firstapp = angular.module('firstapp', [
    'ui.router',
    'phonecatControllers',
    'templateservicemod',
    'navigationservice',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'imageupload'
]);

firstapp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    // for http request with session
    $httpProvider.defaults.withCredentials = true;
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "frontend/views/template.html",
            controller: 'HomeCtrl'
        })
        .state('categories', {
            url: "/categories",
            templateUrl: "frontend/views/template.html",
            controller: 'CategoriesCtrl'
        })
        .state('photographer', {
            url: "/photographer",
            templateUrl: "frontend/views/template.html",
            controller: 'PhotographerCtrl'
        })
        .state('form', {
            url: "/form",
            templateUrl: "frontend/views/template.html",
            controller: 'FormCtrl'
        })
        .state('feature-photographer', {
            url: "/feature-photographer",
            templateUrl: "frontend/views/template.html",
            controller: 'FeaturPCtrl'
        })
        .state('users', {
            url: "/users",
            templateUrl: "frontend/views/template.html",
            controller: 'UsersCtrl'
        })
        .state('user-profile', {
            url: "/user-profile",
            templateUrl: "frontend/views/template.html",
            controller: 'UserProfileCtrl'
        }).state('wild-photographer', {
            url: "/wild-photographer",
            templateUrl: "frontend/views/template.html",
            controller: 'WildPhotoCtrl'
        });
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(isproduction);
});

firstapp.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
firstapp.directive('img', function ($compile, $parse) {
    return {
        restrict: 'E',
        replace: false,
        link: function ($scope, element, attrs) {
            var $element = $(element);
            if (!attrs.noloading) {
                $element.after("<img src='frontend/img/loading.gif' class='loading' />");
                var $loading = $element.next(".loading");
                $element.load(function () {
                    $loading.remove();
                    $(this).addClass("doneLoading");
                });
            } else {
                $($element).addClass("doneLoading");
            }
        }
    };
});

//image upload

firstapp.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                scope.$apply(attrs.imageonload);
            });
        }
    };
});

firstapp.directive('uploadImage', function($http, $filter) {
    return {
        templateUrl: 'frontend/views/directive/uploadFile.html',
        scope: {
            model: '=ngModel',
            callback: "=ngCallback"
        },
        link: function($scope, element, attrs) {
            $scope.isMultiple = false;
            $scope.inObject = false;
            if (attrs.multiple || attrs.multiple === "") {
                $scope.isMultiple = true;
                $("#inputImage").attr("multiple", "ADD");
            }
            if (attrs.noView || attrs.noView === "") {
                $scope.noShow = true;
            }
            if ($scope.model) {
                if (_.isArray($scope.model)) {
                    $scope.image = [];
                    _.each($scope.model, function(n) {
                        $scope.image.push({
                            url: $filter("uploadpath")(n)
                        });
                    });
                }

            }
            if (attrs.inobj || attrs.inobj === "") {
                $scope.inObject = true;
            }
            $scope.clearOld = function() {
                $scope.model = [];
            };
            $scope.uploadNow = function(image) {
                var Template = this;
                image.hide = true;
                var formData = new FormData();
                formData.append('file', image.file, image.name);
                $http.post(uploadurl, formData, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).then(function(data) {
                    console.log("success");
                    console.log("data",data);
                    if ($scope.callback) {
                        $scope.callback(data);
                    } else {
                        if ($scope.isMultiple) {
                            if ($scope.inObject) {
                                $scope.model.push({
                                    "image": data.data[0]
                                });
                            } else {
                                $scope.model.push(data.data[0]);
                            }
                        } else {
                            $scope.model = data.data[0];
                        }
                    }
                });
            };
        }
    };
});

// firstapp.directive('fancybox', function ($document) {
//     return {
//         restrict: 'EA',
//         replace: false,
//         link: function (scope, element, attr) {
//             var $element = $(element);
//             var target;
//             if (attr.rel) {
//                 target = $("[rel='" + attr.rel + "']");
//             } else {
//                 target = element;
//             }
//
//             target.fancybox({
//                 openEffect: 'fade',
//                 closeEffect: 'fade',
//                 closeBtn: true,
//                 padding: 0,
//                 helpers: {
//                     media: {}
//                 }
//             });
//         }
//     };
// });
firstapp.directive('fancyboxBox', function ($document) {
    return {
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attr) {
            var $element = $(element);
            var target;
            if (attr.rel) {
                target = $("[rel='" + attr.rel + "']");
            } else {
                target = element;
            }

            target.fancybox({
                openEffect: 'fade',
                closeEffect: 'fade',
                closeBtn: true,

                galleryNavigation: 'keys',
                helpers: {
                    media: {}
                }
            });
        }
    };
});

firstapp.directive('autoHeight', function ($compile, $parse) {
    return {
        restrict: 'EA',
        replace: false,
        link: function ($scope, element, attrs) {
            var $element = $(element);
            var windowHeight = $(window).height();
            $element.css("min-height", windowHeight);
        }
    };
});

firstapp.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

firstapp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
});

firstapp.filter('serverimage', function () {
    return function (image) {
        if (image && image !== null) {
            return adminurl + "upload/readFile?file=" + image;
        } else {
            return undefined;
        }
    }
});

firstapp.service('anchorSmoothScroll', function () {

    this.scrollTo = function (eID) {
        // this is scrolling function
        var startY = currentYPosition();
        var stopY = elemPosition(eID);
        //   alert(startY + '\n' + stopY);
        var distance = stopY > startY ? stopY - startY : startY - stopY;

        if (distance < 100) {
            scrollTo(0, stopY);
            return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for (var i = startY; i < stopY; i += step) {
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY += step;
                if (leapY > stopY) leapY = stopY;
                timer++;
            }
            return;
        }
        for (var i = startY; i > stopY; i -= step) {
            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
            leapY -= step;
            if (leapY < stopY) leapY = stopY;
            timer++;
        }

        function currentYPosition() {
            if (self.pageYOffset) return self.pageYOffset;

            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;

            // for ie 6, 7, 8 
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elemPosition(eID) {
            var elem = document.getElementById(eID);
            var y = elem.offsetTop;
            // alert('1st' + y);
            // console.log(y);
            var node = elem;

            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                console.log(node);
                y += node.offsetTop;
                // console.log('node elem', node.offsetTop);
                // alert(y);
            }
            return y;
        }
    };


});
// This function is used to show left sibar navigation when a user clicks on the X button. This direction is created in home.html file
firstapp.directive('sidebarDirective', function () {

    return {
        link: function (scope, element, attr) {

            scope.$watch(attr.sidebarDirective, function (newVal) {

                if (newVal) {

                    $('div.icon_float').children().removeClass(function (index, className) {
                        return (className.match(/\bicon_\S+/g) || []).join(' ');
                    });

                    $('div.icon_float').addClass('hamburger-cross');
                    $('div.icon_float > span.icon-bar').css({
                        'height': '3px',
                        'background-color': '#f4511e',
                        'width': '36px'
                    });
                    $('section .mg_lft').css('margin-left', '29%');
                    $('#sidenav-overlay').show();
                    // $('body').on({
                    //     'mousewheel': function (e) {
                    //         e.preventDefault();
                    //         e.stopPropagation();
                    //     }
                    // });

                    $('body').css('overflow-y', 'hidden');

                    element.addClass('show');
                    return;
                } else {
                    if ($('div.icon_float').hasClass('hamburger-cross')) {
                        $('div.icon_float').children().addClass(function (n) {
                            $('div.icon_float').removeClass('hamburger-cross');
                            $('div.icon_float > span.icon-bar').removeAttr('style');
                            $('section .mg_lft').css('margin-left', '0');
                            $('#sidenav-overlay').css('display', 'none');
                            $('body').css('overflow-y', 'scroll');
                            //  $('body').unbind('mousewheel'); // we can use .off() insted
                            // $('#sidenav-overlay').hide(300);
                            return 'icon_bar' + n;

                        });
                    }
                    element.removeClass('show');
                }
            });
        }
    };
});

// This function is used to show sibar menu for send enquiry 
firstapp.directive('enquiryDirective', function () {

    return {
        link: function (scope, element, attr) {
            scope.$watch(attr.enquiryDirective, function (newVal) {
                if (newVal) {
                    //console.log('new value', newVal);
                    element.addClass('showEnquery');
                    return;
                } else {
                    element.removeClass('showEnquery');
                }

            });
        }

    }
});
// JavaScript Document
var firstapp = angular.module('firstapp', [
    'ui.router',
    'phonecatControllers',
    'templateservicemod',
    'navigationservice',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'imageupload',
    'toastr'
]);

firstapp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, cfpLoadingBarProvider) {
    // for http request with session
    $httpProvider.defaults.withCredentials = true;
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.spinnerTemplate = '<div class="spinner-overlay"><img class="spinner" width="50%" src="frontend/img/default.gif"/></div>';
    $urlRouterProvider.otherwise("/");
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
            url: "/user-profile/:userid",
            templateUrl: "frontend/views/template.html",
            controller: 'UserProfileCtrl'
        })
        .state('virtual-gallery', {
            url: "/virtual-gallery",
            templateUrl: "frontend/views/template.html",
            controller: 'VirtualGalleryCtrl'
        })
        .state('wild-photographer', {
            url: "/wild-photographer/:catid/:catName/:photoLoc",
            templateUrl: "frontend/views/template.html",
            controller: 'WildPhotoCtrl'
        })
        .state('freemember', {
            url: "/freemember",
            templateUrl: "frontend/views/template.html",
            controller: 'FreeMemberCtrl'
        })
        .state('silversubscribe', {
            url: "/silversubscribe",
            templateUrl: "frontend/views/template.html",
            controller: 'SilverSubscribeCtrl'
        })
        .state('aboutus', {
            url: "/aboutus",
            templateUrl: "frontend/views/template.html",
            controller: 'aboutusCtrl'
        })
        .state('privacy-policy', {
            url: "/privacy-policy",
            templateUrl: "frontend/views/template.html",
            controller: 'privacyPolicyCtrl'
        })
        .state('terms', {
            url: "/terms",
            templateUrl: "frontend/views/template.html",
            controller: 'termsCtrl'
        })
        .state('contact-us', {
            url: "/contact-us",
            templateUrl: "frontend/views/template.html",
            controller: 'contactUsCtrl'
        })
        .state('competition', {
            url: "/competition",
            templateUrl: "frontend/views/template.html",
            controller: 'competitionCtrl'
        })
        .state('photo-contest', {
            url: "/photo-contest/:photoContestId",
            templateUrl: "frontend/views/template.html",
            controller: 'photoContestCtrl'
        })
        .state('thanks', {
            url: "/thanks/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'thanksCtrl'
        })
        .state('billpaygst', {
            url: "/billpaygst/:view",
            templateUrl: "frontend/views/template.html",
            controller: 'BillPayGst'
        })
        .state('thanks-contest', {
            url: "/thanks-contest",
            templateUrl: "frontend/views/template.html",
            controller: 'ThanksContestCtrl'
        })
        .state('thanks-silver', {
            url: "/thanks-silver",
            templateUrl: "frontend/views/template.html",
            controller: 'thanksSilverCtrl'
        })
        .state('error', {
            url: "/error",
            templateUrl: "frontend/views/template.html",
            controller: 'errorCtrl'
        })
        .state('becomefp', {
            url: "/becomefp",
            templateUrl: "frontend/views/template.html",
            controller: 'becomeFpCtrl'
        })
        .state('thanks-gold', {
            url: "/thanks-gold",
            templateUrl: "frontend/views/template.html",
            controller: 'thanksGoldCtrl'
        })
        .state('artist-of-the-month', {
            url: "/artist-of-the-month",
            templateUrl: "frontend/views/template.html",
            controller: 'ArtistCtrl'
        });
    $locationProvider.html5Mode(isproduction);
});

firstapp.filter('startFrom', function () {
    return function (input, start) {
        if (input != undefined) {
            start = +start; //parse to int
            return input.slice(start);
        }
    }
});

//url share profile
firstapp.filter('urlEncode', [function () {
    return window.encodeURIComponent;
}]);
//url share profile end

firstapp.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        preventOpenDuplicates: true,
        positionClass: "toast-top-center",
    });
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

firstapp.directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                scope.$apply(attrs.imageonload);
            });
        }
    };
});

firstapp.directive('uploadImage', function ($http, $filter) {
    return {
        templateUrl: 'frontend/views/directive/uploadFile.html',
        scope: {
            model: '=ngModel',
            callback: "=ngCallback",
            limit: "=limit"
        },
        link: function ($scope, element, attrs) {
            console.log("scope", $scope.limit);

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
                    _.each($scope.model, function (n) {
                        $scope.image.push({
                            url: $filter("uploadpath")(n)
                        });
                    });
                }

            }
            if (attrs.inobj || attrs.inobj === "") {
                $scope.inObject = true;
            }
            $scope.clearOld = function () {
                $scope.model = [];
            };
            $scope.uploadNow = function (image) {
                var Template = this;
                image.hide = true;
                var formData = new FormData();
                formData.append('file', image.file, image.name);
                var uploadUrl = uploadurl;
                if ($scope.limit != undefined) {
                    uploadUrl = uploadUrl + "?uploadLimit=" + $scope.limit;
                } else {
                    uploadurl = adminurl + "upload";
                }
                console.log("upload url", uploadUrl);
                console.log(uploadUrl);
                $http.post(uploadUrl, formData, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).then(function (data) {
                    data = data.data;
                    //console.log("success");
                    console.log("data", data);
                    if (data.value == false) {
                        if (data.error == "Please Upload File Size Upto 1 MB") {
                            $scope.callback("More than 1Mb", null);
                        } else {
                            $scope.callback("More than 3Mb", null);
                        }

                    } else if (data.value == true) {
                        // if ($scope.callback) {
                        //     $scope.callback(data);
                        // } else {
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
                    // }
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

// firstapp.filter('startFrom', function () {
//     return function (input, start) {
//         start = +start; //parse to int
//         return input.slice(start);
//     }
// });

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

firstapp.filter('serverimage1', function () {
    return function (input, width, height, style) {
        var other = "";
        if (width && width !== "") {
            other += "&width=" + width;
        }
        if (height && height !== "") {
            other += "&height=" + height;
        }
        if (style && style !== "") {
            other += "&style=" + style;
        }
        if (input) {
            if (input.indexOf('https://') == -1) {
                return adminurl + "upload/readFile?file=" + input + other;
            } else {
                return input;
            }
        }
    };
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
                var sidebarOpen = false;

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
                    $('body').css('overflow-y', 'hidden');
                    element.addClass('show');
                    $('.sidebar').on('click', function () {
                        sidebarOpen = true;
                        if (sidebarOpen) {
                            $('body').css('overflow-y', 'scroll');
                        }

                    });
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
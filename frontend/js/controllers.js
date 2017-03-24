angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'angular-flexslider', 'ui.swiper'])

    .controller('HomeCtrl', function ($scope, TemplateService, NavigationService, $timeout, $location, anchorSmoothScroll) {
        $scope.template = TemplateService.changecontent("home"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("ClickMania"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        NavigationService.callApi("ArtistOfMonth/search", function (data) {
            if (data.value === true) {
                console.log(data)
                $scope.artistOfMonth = data.data.results[0];
                console.log("$scope.ArtistOfMonth--", $scope.artistOfMonth)
            }
        });

        // NavigationService.callApi("Categories/search", function (data) {
        //             if (data.value === true) {
        //                 console.log(data)
        //                 $scope.Categories = data.data.results;
        //             console.log("$scope.Categories--", $scope.Categories)}
        // });

        NavigationService.callApi("Categories/search", function (data) {
            if (data.value === true) {
                console.log(data)
                $scope.category = data.data.results;
                //$scope.minCategoryL3Price = _.minBy(data.data, 'price')
                $scope.cat = _.chunk($scope.category, 3);
                console.log("$scope.categocacatry--.....", $scope.cat);
                // $scope.categoryLvl2 = _.remove($scope.category2, function (n) {
                //     return n.name != $scope.categoryLevel3[0][0].categoryLevel2.name;
                // });
                // console.log($scope.categoryLvl2)
                // $scope.categoryLvl2 = _.chunk($scope.categoryLvl2, 3);
            } else {
                //  toastr.warning('Error submitting the form', 'Please try again');
            }
        });

        $scope.mySlides = [
            // 'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg',
            // 'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg',
            // 'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg',
            // 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg'
            "frontend/img/bg1.jpg",
            "frontend/img/bg1.jpg",
            "frontend/img/bg1.jpg"

        ];

        $scope.fpUser = [{ // Featured Photographer
            profile: "frontend/img/pic1.png",
            background: "frontend/img/fp_bg1.png",
            title: "Zaroon Jaffrani | Pune",
            speciality: "wild life"
        }, {
            profile: "frontend/img/pic2.png",
            background: "frontend/img/fp_bg1.png",
            title: "Asmara Khan | Banglore",
            speciality: "wedding"
        }, {
            profile: "frontend/img/pic3.png",
            background: "frontend/img/fp_bg1.png",
            title: "Fatema | Delhi",
            speciality: "wild life"
        }, {
            profile: "frontend/img/clickm/pic1.png",
            background: "frontend/img/fp_bg1.png",
            title: "Zaroon Jaffrani | Pune",
            speciality: "wild life"
        }, {
            profile: "frontend/img/clickm/pic2.png",
            background: "frontend/img/fp_bg1.png",
            title: "Asmara Khan | Banglore",
            speciality: "Wedding"
        }, {
            profile: "frontend/img/pic3.png",
            background: "frontend/img/fp_bg1.png",
            title: "Fatema | Delhi",
            speciality: "wild life"
        }];

        $scope.testimonial = [{ // used for testimonials
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been 0the industry's standard dummy text ever since the 1500s, when an unknown printer took a gallery of type and scrambledLorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been",
            ceo: "manan vora, CEO & founder Ting"
        }, {
            text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been 0the industry's standard dummy text ever since the 1500s, when an unknown printer took a gallery of type and scrambledLorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been",
            ceo: " manan vora, CEO & founder Ting"
        }];

        // To scroll down to a particular div
        $scope.goToElemment = function (eID) { // para will take an elementId
            //  $location.hash('bottom');
            anchorSmoothScroll.scrollTo(eID);
        };

        // this function is used to move <div class="scroll_down"> bottom to the img when user scrolls down 
        var container = angular.element(document);
        container.on('scroll', function () {

            if (container.scrollTop() > 220) {
                $('.sliding_bg .scroll_down').css({

                    WebkitTransition: 'opacity 1s ease-in-out',
                    MozTransition: 'opacity 1s ease-in-out',
                    MsTransition: 'opacity 1s ease-in-out',
                    'transition': 'all 300ms linear',
                    'position': 'absolute',
                    'bottom': '60px'
                });
            } else {
                $('.sliding_bg .scroll_down').css({

                    WebkitTransition: 'opacity 1s ease-in-out',
                    MozTransition: 'opacity 1s ease-in-out',
                    MsTransition: 'opacity 1s ease-in-out',
                    'transition': 'all 300ms linear',
                    'position': 'absolute',
                    'bottom': '135px'
                });
            }
        });

        // used for left-sidebar navigation
        $scope.state = false;
        $scope.toggleState = function ($event) {
            $scope.state = !$scope.state;

        };

    })
    .controller('PhotographerCtrl', function ($scope, TemplateService, NavigationService, $timeout, $uibModal, $http) {
        $scope.template = TemplateService.changecontent("photographer"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Photographer"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.tab = 1;
        $scope.showForm = true;
        $scope.noEdit = true;
        $scope.hideAboutDesc = false;
        $scope.profileSelect = false;
        $scope.freeMember = false;
        $scope.silverSub = true;
        $scope.hideHistory = false;
        $scope.packageStatus = true;
        $scope.chooseSilverhis = function () {
            $scope.hideHistory = true;
            $scope.packageStatus = false;
            $scope.silverStatus = false;
            $scope.goldStatus = true;
        }
        $scope.chooseGoldhis = function () {
            $scope.hideHistory = true;
            $scope.packageStatus = false;
            $scope.goldStatus = false;
            $scope.silverStatus = true;
        }
        $scope.chooseSilver = function () {
            $scope.freeMember = true;
            $scope.silverSub = false;
        }
        $scope.goldSub = true;
        $scope.chooseGold = function () {
            $scope.freeMember = true;
            $scope.goldSub = false;
        }
        $scope.showForm = function () {
            $scope.noEdit = false;
            $scope.showForm = false;
            $scope.hideAboutDesc = true;
            $scope.profileSelect = true;
        }
        $scope.showMembership = false;
        $scope.goldenMember = true;
        $scope.silverMember = true;
        $scope.silverMember = function () {
            $scope.profileSelect = true;
            $scope.noEdit = false;
            $scope.showMembership = true;
            $scope.silverMember = false;
            $scope.goldenMember = true;
            $scope.showForm = false;
            $scope.hideAboutDesc = true;
        }
        $scope.goldMember = function () {
            $scope.noEdit = false;
            $scope.profileSelect = false;
            $scope.showMembership = true;
            $scope.goldenMember = false;
            $scope.silverMember = true;
            $scope.showForm = false;
            $scope.hideAboutDesc = true;
        }
        $scope.uploadImg = function () {
            $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/upload-photo.html",
                scope: $scope,
                windowClass: 'upload-pic',
                backdropClass: 'black-drop',
                size: 'lg'
            });
        };

        $scope.uploadList = [
            'frontend/img/photographer/img.jpg',
            'frontend/img/photographer/img.jpg',
            'frontend/img/photographer/img.jpg',
            'frontend/img/photographer/img.jpg',
            'frontend/img/photographer/img.jpg',
            'frontend/img/photographer/img.jpg'
        ];
        $scope.profileList = [
            'frontend/img/photographer/profile.png'
            //  ,'frontend/img/photographer/profile.jpg'

        ];
        $scope.subclick = {
            "background": "frontend/img/user-back.png",
            "titleOne": "Upgrade to",
            "titleTwo": "Gold"
        };

    })

    .controller('FormCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("form"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Form"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.formSubmitted = false;

        $scope.submitForm = function (data) {
            console.log(data);
            $scope.formSubmitted = true;
        };
    })
    .controller('FeaturPCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("feature-photographer"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Feature Photographer"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.activeTab = 1;
        $scope.toggleTab = function (val) {
            $scope.activeTab = val;
        };
        $scope.data = {
            "intro": "You could be a featured photographer on Clickmania and come under the lens of those who would love to harness your services. For as low as Rs. 1000 you could shoecase your work for a month.",
            "name": "Manan",
        };
        $scope.benefits = [{
            "list": "100 photos",
        }, {
            "list": "3mb per photo",
        }, {
            "list": "Photos can be edited by you.",
        }, {
            "list": "Valid till 1 year.",
        }];
    })
    .controller('UsersCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("users"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Users"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.tileList = {
            "titleOne": "Featured",
            "titleTwo": "Time freezers",

        };

        $scope.usersList = [{
            "profile": "frontend/img/pic/pic1.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "sagar",
            "surName": "roy",
            "place": "pune",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }, {
            "profile": "frontend/img/pic/pic3.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "zaroon",
            "surName": "jaffrani",
            "place": "pune",
            "content": " You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."

        }, {
            "profile": "frontend/img/pic/pic2.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "rayeesh",
            "surName": "khan",
            "place": "pune",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? "
        }, {
            "profile": "frontend/img/pic/pic5.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "sagar",
            "surName": "roy",
            "place": "pune",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }, {
            "profile": "frontend/img/pic/pic6.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "dipesh",
            "surName": "yask",
            "place": "pune",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }, {
            "profile": "frontend/img/pic/pic4.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }];
        $scope.subclick = {
            "background": "frontend/img/user-back.png",
            "titleOne": "If you wish to join as a",
            "titleTwo": "featured photographer"
        };


    })
    .controller('CategoriesCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("categories"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Categories"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        NavigationService.callApi("Categories/search", function (data) {
            if (data.value === true) {
                console.log(data)
                $scope.category = data.data.results;
                //$scope.minCategoryL3Price = _.minBy(data.data, 'price')
                $scope.cat = _.chunk($scope.category, 3);
                console.log("$scope.categocacatry--.....", $scope.cat);
                // $scope.categoryLvl2 = _.remove($scope.category2, function (n) {
                //     return n.name != $scope.categoryLevel3[0][0].categoryLevel2.name;
                // });
                // console.log($scope.categoryLvl2)
                // $scope.categoryLvl2 = _.chunk($scope.categoryLvl2, 3);
            } else {
                //  toastr.warning('Error submitting the form', 'Please try again');
            }
        });

    })
    .controller('UserProfileCtrl', function ($scope, TemplateService, NavigationService, $timeout, $uibModal) {
        $scope.template = TemplateService.changecontent("user-profile"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("User Profile"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.activeTab = 1;
        $scope.toggleTab = function (val) {
            $scope.activeTab = val;
            $scope.showSocial = false; // here showSocial will be display: none; 
        };
        $scope.userHead = {
            profile: "frontend/img/pic/pic1.jpg",
            background: "frontend/img/clickm/5.jpg",
            name: "zohn",
            surName: "carter",
            location: ['mumbai | ', 'pune | ', 'delhi'],
            speciality: ['wedding', 'wildlife', 'travel']
        };
        $scope.reviewList = [{
            "profile": "frontend/img/pic/pic1.jpg",
            "name": "sagar",
            "surName": "roy",
            "days": "1",
            "content": "Clickmania is an online mobile photo-sharing site that allows its users to share pictures and videos either publicly or privately on the app, as well as through a variety of other social networking platforms, such as Facebook,Twitter, Tumblr, and Flickr. "
        }, {
            "profile": "frontend/img/pic/pic3.jpg",
            "name": "zaroon",
            "surName": "jaffrani",
            "days": "3",
            "content": "Clickmania is an online mobile photo-sharing site that allows its users to share pictures and videos either publicly or privately on the app, as well as through a variety of other social networking platforms, such as Facebook, Twitter, Tumblr, and Flickr."
        }, {
            "profile": "frontend/img/pic/pic2.jpg",
            "name": "rayeesh",
            "surName": "khan",
            "days": "4",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? "
        }];

        $scope.fpUser = [{
            "profile": "frontend/img/pic/pic1.jpg",
            "background": "frontend/img/fp_bg1.png",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "speciality": "wild life"
        }, {
            "profile": "frontend/img/pic/pic2.jpg",
            "background": "frontend/img/fp_bg1.png",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "speciality": "wedding"
        }, {
            "profile": "frontend/img/pic/pic3.jpg",
            "background": "frontend/img/fp_bg1.png",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "speciality": "wild life"
        }, {
            "profile": "frontend/img/pic/pic4.jpg",
            "background": "frontend/img/fp_bg1.png",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "speciality": "wild life"
        }, {
            "profile": "frontend/img/pic/pic5.jpg",
            "background": "frontend/img/fp_bg1.png",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "speciality": "Wedding"
        }, {
            "profile": "frontend/img/pic/pic6.jpg",
            "background": "frontend/img/fp_bg1.png",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "speciality": "wild life"
        }];

        $scope.wildlife = ['frontend/img/photographer/wildlife1.jpg',
            'frontend/img/photographer/wildlife2.jpg',
            'frontend/img/photographer/wildlife3.jpg',
            'frontend/img/photographer/wildlife1.jpg',
            'frontend/img/photographer/wildlife2.jpg',
            'frontend/img/photographer/wildlife3.jpg',
            'frontend/img/photographer/wildlife1.jpg',
            'frontend/img/photographer/wildlife2.jpg',
            'frontend/img/photographer/wildlife3.jpg',
            'frontend/img/photographer/wildlife1.jpg',
            'frontend/img/photographer/wildlife2.jpg',
            'frontend/img/photographer/wildlife3.jpg'
        ];

        $scope.wedding = ['frontend/img/photographer/wedding1.jpg',
            'frontend/img/photographer/wedding2.jpg',
            'frontend/img/photographer/wedding3.jpg',
            'frontend/img/photographer/wedding1.jpg',
            'frontend/img/photographer/wedding2.jpg',
            'frontend/img/photographer/wedding3.jpg',
            'frontend/img/photographer/wedding1.jpg',
            'frontend/img/photographer/wedding2.jpg',
            'frontend/img/photographer/wedding3.jpg'
        ];

        $scope.travel = ['frontend/img/photographer/travel.jpg',
            'frontend/img/photographer/travel.jpg',
            'frontend/img/photographer/travel.jpg',
            'frontend/img/photographer/travel.jpg',
            'frontend/img/photographer/travel.jpg',
            'frontend/img/photographer/travel.jpg'
        ];

        // this function is used to show Send Enquiry navigation
        $scope.sendEnquiry = function ($event) {
            $scope.slide = !$scope.slide;
        };

        // this function is used for data submmiting
        $scope.enquiryData = {};
        $scope.dataSubmit = function (data) {
            console.log(data);
        };

        // tis function is used to open an UIB modal
        $scope.openModal = function (size) {
            $scope.openEnquiryModal = $uibModal.open({
                animation: true,
                templateUrl: 'frontend/views/modal/sendEnquiry.html',
                size: size,
                scope: $scope,
                //windowClass: "loginbox"
            });
        };
        $scope.showSocial = false; //here showSocial will be display: none; to display <div class="showSocial">
        // when a user selects 1 radio button the function showData will be execuited
        $scope.showData = function () {
            $scope.showSocial = true; //here showSocial will be display: block; to display <div class="showSocial">
        };

    })
    .controller('WildPhotoCtrl', function ($scope, TemplateService, NavigationService, $timeout, $filter) {
        $scope.template = TemplateService.changecontent("wild-photographer"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Wild Photographer"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.checkboxData = [{
            label: 'mumbai',
            value: true
        }, {
            label: 'banglor',
            value: false
        }, {
            label: 'pune',
            value: false
        }, {
            label: 'chennai',
            value: false
        }, {
            label: 'karnataka',
            value: false
        }, {
            label: 'barcelona',
            value: false
        }];
        $scope.checkall = false;
        $scope.toggleAll = function () {
            $scope.checkall = !$scope.checkall;
            for (var key in $scope.checkboxData) {
                $scope.checkboxData[key].value = $scope.checkall;
            }
        };
        $scope.currentPage = 0;
        $scope.pageSize = 9;
        $scope.data = [];
        $scope.q = '';

        $scope.getData = function () {
            return $filter('filter')($scope.data, $scope.q)

        }

        $scope.numberOfPages = function () {
            return Math.ceil($scope.getData().length / $scope.pageSize);
        }
        $scope.data = [{
            "profile": "frontend/img/pic/pic1.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "sagar",
            "surName": "roy",
            "place": "pune",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }, {
            "profile": "frontend/img/pic/pic3.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "zaroon",
            "surName": "jaffrani",
            "place": "pune",
            "content": " You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."

        }, {
            "profile": "frontend/img/pic/pic2.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "rayeesh",
            "surName": "khan",
            "place": "pune",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? "
        }, {
            "profile": "frontend/img/pic/pic5.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "sagar",
            "surName": "roy",
            "place": "pune",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }, {
            "profile": "frontend/img/pic/pic6.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "dipesh",
            "surName": "yask",
            "place": "pune",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }, {
            "profile": "frontend/img/pic/pic4.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }, {
            "profile": "frontend/img/pic/pic4.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }, {
            "profile": "frontend/img/pic/pic4.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }, {
            "profile": "frontend/img/pic/pic4.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }, {
            "profile": "frontend/img/pic/pic4.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }];



        $scope.fpUser = [{
            "profile": "frontend/img/pic/pic1.jpg",
            "background": "frontend/img/fp_bg1.png",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "speciality": "wild life"
        }, {
            "profile": "frontend/img/pic/pic2.jpg",
            "background": "frontend/img/fp_bg1.png",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "speciality": "wedding"
        }, {
            "profile": "frontend/img/pic/pic3.jpg",
            "background": "frontend/img/fp_bg1.png",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "speciality": "wild life"
        }, {
            "profile": "frontend/img/pic/pic4.jpg",
            "background": "frontend/img/fp_bg1.png",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "speciality": "wild life"
        }];

        //uib controller
        // $scope.totalItems = 64;
        // $scope.currentPage = 1;

        // $scope.setPage = function (pageNo) {
        //     $scope.currentPage = pageNo;
        // };

        // $scope.pageChanged = function () {
        //     $log.log('Page changed to: ' + $scope.currentPage);
        // };

        // $scope.maxSize = 1;
        // $scope.bigTotalItems = 175;
        // $scope.bigCurrentPage = 1;
        $scope.usersList = [{
            "profile": "frontend/img/pic/pic1.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "sagar",
            "surName": "roy",
            "place": "pune",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }, {
            "profile": "frontend/img/pic/pic3.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "zaroon",
            "surName": "jaffrani",
            "place": "pune",
            "content": " You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."

        }, {
            "profile": "frontend/img/pic/pic2.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "rayeesh",
            "surName": "khan",
            "place": "pune",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? "
        }, {
            "profile": "frontend/img/pic/pic5.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "sagar",
            "surName": "roy",
            "place": "pune",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }, {
            "profile": "frontend/img/pic/pic6.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "dipesh",
            "surName": "yask",
            "place": "pune",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }, {
            "profile": "frontend/img/pic/pic4.jpg",
            "background": "frontend/img/clickm/9.jpg",
            "name": "prachi",
            "surName": "ronsk",
            "place": "new mumbai",
            "content": "Would you like to insert and display separate images for intro text and full article in your blog? ... You can also specify placement for images, take a look at Intro Image Float and Full Text Image Float settings."
        }];
        $scope.categories = [{
            "background": "frontend/img/cat3.jpg"
        }, {
            "background": "frontend/img/cat4.jpg"
        }, {
            "background": "frontend/img/cat3.jpg"
        }, {
            "background": "frontend/img/cat4.jpg"
        }];

    })
    .controller('headerctrl', function ($scope, TemplateService, $uibModal) {
        $scope.template = TemplateService;
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $(window).scrollTop(0);
        });
        $.fancybox.close(true);
        $scope.uploadSignup = function () {
            console.log("signup");
            $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/signup-profile.html",
                scope: $scope,
                windowClass: '',
                backdropClass: 'black-drop'
            });
        };
        $scope.logIn = function () {
            console.log("login");
            $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/login.html",
                scope: $scope,
                windowClass: '',
                backdropClass: 'black-drop'
            });
        };

        //     $scope.signUp = function() {
        //       console.log(modal);
        //         $uibModal.open({
        //             animation: true,
        //             templateUrl: "frontend/views/modal/sign-up.html",
        //             scope: $scope,
        // windowClass: 'upload-pic'
        // backdropClass: 'black-drop'
        //         });
        //     };
    })

    .controller('languageCtrl', function ($scope, TemplateService, $translate, $rootScope) {

        $scope.changeLanguage = function () {
            console.log("Language CLicked");

            if (!$.jStorage.get("language")) {
                $translate.use("hi");
                $.jStorage.set("language", "hi");
            } else {
                if ($.jStorage.get("language") == "en") {
                    $translate.use("hi");
                    $.jStorage.set("language", "hi");
                } else {
                    $translate.use("en");
                    $.jStorage.set("language", "en");
                }
            }
            //  $rootScope.$apply();
        };


    })

;
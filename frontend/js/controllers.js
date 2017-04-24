angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ui.bootstrap', 'ngSanitize', 'angular-flexslider', 'ui.swiper', 'imageupload'])

    .controller('HomeCtrl', function ($state, $scope, $rootScope, TemplateService, NavigationService, $timeout, $location, anchorSmoothScroll, $uibModal) {
        $scope.template = TemplateService.changecontent("home"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("ClickMania"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.locString = [];
        $scope.navigation = NavigationService.getnav();

        NavigationService.callApi("ArtistOfMonth/search", function (data) {
            if (data.value === true) {
                //console.log(data)
                $scope.artistOfMonth = data.data.results[0];
                angular.forEach($scope.artistOfMonth.speciality, function (spec) {
                    //only required the students avilable projects
                    //console.log("spec---", spec.name)
                    if (_.isEmpty($scope.specialityStr)) {
                        $scope.specialityStr = spec.name;
                    } else {
                        $scope.specialityStr = $scope.specialityStr + ' | ' + spec.name;
                    }
                })
                //console.log("$scope.ArtistOfMonth--", $scope.artistOfMonth)
            }
        });

        NavigationService.callApi("HomePage/getAll", function (data) {
            //console.log("catdata", data);
            if (data.value === true) {
                $scope.bannerImageData = data.data;
                //console.log("$scope.bannerImageData", $scope.bannerImageData);
            }
        });

        NavigationService.callApi("Categories/getAll", function (data) {
            //console.log("catdata", data);
            if (data.value === true) {
                //console.log("Categories", data)
                $scope.category = data.data;
                $scope.bigImageCategory = [];
                $scope.smallImageCategory = [];

                i = 0;
                _.forEach($scope.category, function (value) {
                        i++;
                        //console.log("i", i);
                        //console.log("cat", value);
                        if (value.bigimage) {
                            $scope.bigImageCategory.push(value);
                            // console.log("$scope.bigImageCategory.", $scope.bigImageCategory);
                        } else {
                            $scope.smallImageCategory.push(value);
                            // console.log(" $scope.smallImageCategory", $scope.smallImageCategory);
                        }
                    }
                    //     //$scope.minCategoryL3Price = _.minBy(data.data, 'price')
                    //     // $scope.cat = _.chunk($scope.category, 3);
                    //     // console.log("$scope.categocacatry--.....", $scope.cat);
                    //     // // $scope.categoryLvl2 = _.remove($scope.category2, function (n) {
                    //     //     return n.name != $scope.categoryLevel3[0][0].categoryLevel2.name;
                    //     // });
                    //     // console.log($scope.categoryLvl2)
                    //     // $scope.categoryLvl2 = _.chunk($scope.categoryLvl2, 3);
                    // } else {
                    //     //  toastr.warning('Error submitting the form', 'Please try again');
                )
                $scope.bigImageCategory = _.orderBy($scope.bigImageCategory, ['order'], ['asc']);
                $scope.smallImageCategory = _.orderBy($scope.smallImageCategory, ['order'], ['asc']);
                //console.log("$scope.bigImageCategory.", $scope.bigImageCategory);
                //console.log(" $scope.smallImageCategory", $scope.smallImageCategory);
                $scope.smallCat = _.chunk($scope.smallImageCategory, 2);
                //console.log(" $scope.smallCat", $scope.smallCat)
            } else {
                toastr.warning('Error submitting the form', 'Please try again');
            }
        });


        $scope.date = new Date();
        var valMon = $scope.date.getMonth();
        var valyear = $scope.date.getFullYear();
        $scope.monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $scope.nextMonth = valMon + 1;
        $scope.mon = $scope.monthNames[$scope.nextMonth];
        formdata = {};
        formdata.month = $scope.mon;
        NavigationService.apiCallWithData("Photographer/getFeatPhotographer", formdata, function (data) {
            //console.log("getFeatPhotographer", data);
            if (data.value === true) {
                $scope.featrData = data.data;
                //console.log("featuePhoto", $scope.featrData);
                _.forEach($scope.featrData, function (spec) {

                    _.forEach(spec.speciality, function (spec1) {

                        //console.log("spec---", spec1.name);
                        if (_.isEmpty(spec.specialityString)) {
                            //console.log("$scope.specialityString---", spec.specialityString)
                            spec.specialityString = spec1.name;
                        } else {
                            spec.specialityString = spec.specialityString + ' | ' + spec1.name;
                            //console.log("$scope.specialityString---", spec.specialityString)
                        }
                    })
                })
            }
        });

        //signup modal 
        $scope.uploadSignup = function () {
            //console.log("signup");
            $scope.loginModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/signup-profile.html",
                scope: $scope,
                windowClass: '',
                backdropClass: 'black-drop'
            });
        };
        $scope.logIn = function () {
            if ($scope.loginModal) {
                $scope.loginModal.close();
            }
            //console.log("login");
            $scope.signupModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/login.html",
                scope: $scope,
                windowClass: '',
                backdropClass: 'black-drop'
            });
        };

        $scope.signUp = function (formdata, terms) {
                // formdata.serviceRequest = $scope.serviceList;
                if (!terms) {
                    // alert('check box error');
                    $('.condition-box p.alert-text').text('Please check the terms & condition checkbox').css('text-indent', '32px');
                } else {
                    //console.log(formdata);
                    NavigationService.sendLogin(formdata, function (data) {
                        if (data.data.value) {
                            //console.log(data.data.data);
                            $.jStorage.set("photographer", data.data.data);
                            $scope.template.profile = data.data.data;
                            if ($scope.signupModal) {
                                $scope.signupModal.close();
                            }
                            if ($scope.loginModal) {
                                $scope.loginModal.close();
                            }
                            $state.go('photographer');
                        }
                    });
                }
            },

            $scope.login = function (formdata) {
                // formdata.serviceRequest = $scope.serviceList;
                //console.log(formdata);
                NavigationService.checkLogin(formdata, function (data) {
                    if (data.data.value) {
                        //console.log(data.data.data);
                        $.jStorage.set("photographer", data.data.data);
                        $rootScope.showStep = 2;
                        $scope.template.profile = data.data.data;
                        $scope.signupModal.close();
                        $state.go("photographer");
                    }
                });
            }

        //signup modal close


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

    .controller('PhotographerCtrl', function ($scope, TemplateService, NavigationService, $timeout, $uibModal, $http, $state) {
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
        $scope.silverPackage = true;
        $scope.goldPackage = true;
        $scope.hideHistory = false;
        $scope.shSilver = false;
        $scope.shGold = false;
        $scope.termS = true;
        $scope.termG = true;
        $scope.packageStatus = true;
        $scope.serviceList = [];
        $scope.specialityList = [];
        $scope.arrLocation = [];
        $scope.showSixPhotos = [];
        if ($.jStorage.get("photographer")) {
            formdata = {};
            formdata._id = $.jStorage.get("photographer")._id;
            NavigationService.apiCallWithData("Photographer/getOne", formdata, function (data) {
                if (data.value === true) {
                    //console.log(data)
                    $scope.photographerData = data.data;
                    if ($scope.photographerData.package) {
                        $scope.packageShow = $scope.photographerData.package;
                    } else {
                        $scope.packageShow = '';
                    }

                    $scope.uploadImgData = $scope.photographerData.uploadedImages;
                    if (!_.isEmpty($scope.uploadImgData)) {
                        $scope.termS = false;
                        $scope.termG = false;
                    }
                    $scope.showSixPhotos = _.slice($scope.uploadImgData, 0, 6);
                    //console.log("$scope.showSixPhotos", $scope.showSixPhotos);
                    //console.log("$scope.uploadImgData", $scope.uploadImgData);
                    $scope.uniqueCategory = _.uniqBy($scope.uploadImgData, 'category');
                    //console.log("$scope.uniqueCategory", $scope.uniqueCategory);
                    $scope.uploadImgLength = $scope.uploadImgData.length;
                    //console.log("$scope.uploadImgLength", $scope.uploadImgLength);
                    $scope.arrLocation = $scope.photographerData.location;
                    angular.forEach($scope.photographerData.speciality, function (spec) {
                        //only required the students avilable projects
                        //console.log("spec---", spec.name)
                        if (_.isEmpty($scope.specialityString)) {
                            $scope.specialityString = spec.name;
                        } else {
                            $scope.specialityString = $scope.specialityString + ' | ' + spec.name;
                        }
                    })
                    angular.forEach($scope.photographerData.location, function (loc) {
                        //only required the students avilable projects
                        if (_.isEmpty($scope.locString)) {
                            $scope.locString = loc;
                        } else {
                            $scope.locString = $scope.locString + ' | ' + loc;
                        }
                        //console.log("$scope.locString", $scope.locString);
                    })
                    // console.log("$scope.photographerData--", $scope.photographerData)
                    $scope.formData = {}
                    NavigationService.callApi("Categories/getAll", function (data) {
                        if (data.value === true) {
                            console.log(data)
                            $scope.specialityData = data.data;
                            _.forEach($scope.specialityData, function (value1) {
                                _.forEach($scope.photographerData.speciality, function (value2) {
                                    if (_.isEqual(value1.name, value2.name)) {
                                        $scope.specialityList.push(value1._id)
                                        value1.value = true;
                                        $scope.formData[value1.name] = true;
                                    }
                                });
                            });
                            //console.log("$scope.specialityData--", $scope.specialityData)
                        }
                    });
                }
            });
        }

        $scope.LoadMore = function (data) {
            $scope.showSixPhotos = $scope.uploadImgData;
        };

        $scope.addMe = function (data) {
            // console.log(document.getElementById(data.name).checked)
            if (document.getElementById(data.name).checked) {
                $scope.specialityList.push(data._id);
            } else {
                var list = _.remove($scope.specialityList, function (n) {
                    return _.isEqual(n, data._id);
                });
                // console.log(list)
            }
            //console.log($scope.specialityList);
        };


        $scope.formData1 = {}
        NavigationService.callApi("Locations/getAll", function (data) {
            if (data.value === true) {
                //console.log("location data", data);
                $scope.LocationData = data.data;
                _.forEach($scope.LocationData, function (value1) {
                    _.forEach($scope.photographerData.location, function (value2) {
                        if (_.isEqual(value1.name, value2.name)) {
                            $scope.arrLocation.push(value1._id)
                            value1.value = true;
                            $scope.formData1[value1.name] = true;
                        }
                    });
                });
                //console.log("$scope.arrLocation--", $scope.arrLocation)
            }
        });

        //sid code 

        $scope.addLocation = function () {
            var valText = document.getElementById("locationCity").value;
            console.log(!/\d/.test(valText)); //returns true if contains numbers
            if (!/\d/.test(valText)) {
                valText = valText.split(",");
                $scope.arrLocation.push(valText[0]);
                document.getElementById("locationCity").value = null
            }
        }

        $scope.removeLocation = function (index) {
            $scope.arrLocation.splice(index, 1);
        }
        //sid code  end

        $scope.about = true;

        $scope.done = function (formdata) {
            formdata.speciality = $scope.specialityList;
            formdata.location = $scope.arrLocation;
            // console.log("doneFormData", formdata);
            NavigationService.apiCallWithData("Photographer/saveData", formdata, function (data) {
                if (data.value) {
                    NavigationService.apiCallWithData("Photographer/getOne", formdata, function (data) {
                        if (data.value === true) {
                            //console.log(data)
                            $scope.photographerData = data.data;
                            // console.log("$scope.photographerData--", $scope.photographerData);
                            $scope.uniqueCategory = _.uniqBy($scope.uploadImgData, 'category');
                            $.jStorage.flush();
                            $.jStorage.set("photographer", $scope.photographerData);
                            $scope.template.profile = $scope.photographerData;
                            $state.reload();
                        }
                    });
                }
                //console.log("dataaaaaaaaaa", data);
                $scope.about = true;

            });
        };

        $scope.showabout = function () {
            $scope.about = false;
        }

        //cover and profile pic update and set

        $scope.photographerData = {};
        $scope.coverPhoto = {};
        $scope.profilePic = {};


        if ($.jStorage.get('photographer') != null) {
            $scope.coverPhoto._id = $.jStorage.get("photographer")._id;
            $scope.profilePic._id = $.jStorage.get("photographer")._id;
        }

        $scope.photographerData = {
            coverPic: ""
        };

        $scope.photographerData = {
            profilePic: ""
        };

        $scope.photographerData.coverPic = {};
        $scope.photographerData.profilePic = {};

        $scope.$watch("photographerData.coverPic", function (newImage, oldImage) {
            //console.log("Change in image", newImage, oldImage);
            $scope.photographerData._id = $.jStorage.get("photographer")._id;
            $scope.photographerData.coverPic = newImage
            NavigationService.apiCallWithData("Photographer/saveData", $scope.photographerData, function (data) {
                //console.log("coverPhotoUpdate", data);

            });

        });

        $scope.$watch("photographerData.profilePic", function (newImage, oldImage) {
            //console.log("Change in image profile", newImage, oldImage);
            $scope.photographerData._id = $.jStorage.get("photographer")._id;
            $scope.photographerData.profilePic = newImage;
            NavigationService.apiCallWithData("Photographer/saveData", $scope.photographerData, function (data) {
                //console.log("profilePhotoUpdate", data);
                if (data.value == true) {
                    $.jStorage.flush();
                    $.jStorage.set("photographer", $scope.photographerData);
                    $scope.template.profile = $scope.photographerData;
                }
            });
        });

        //End cover and profile pic update and set//

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
        $scope.silverShow = function () {
            console.log($scope.termS);
            $scope.silverSub = true;
            $scope.termS = false;
            $scope.silverPackage = false;
            console.log($scope.termS);

        }
        $scope.goldShow = function () {
            $scope.termG = false;
            $scope.goldSub = true;
            $scope.goldPackage = false;
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
            $scope.freeMember = true;
            $scope.silverSub = false;
            $scope.shGold = true;
            $scope.silverMember = false;
            $scope.goldenMember = true;
            $scope.showForm = false;
            $scope.hideAboutDesc = true;
            formdata = {};
            formdata._id = $.jStorage.get("photographer")._id;
            formdata.package = 'Silver';
            NavigationService.apiCallWithData("Photographer/saveData", formdata, function (data) {
                //console.log("silver memeber", data);
                $scope.packageShow = data.data.package;
                $.jStorage.set("photographer", data.data);
                // console.log("package", data.data.package);
                $state.reload();
            });
        }
        $scope.goldMember = function () {
            $scope.noEdit = false;
            $scope.freeMember = true;
            $scope.profileSelect = false;
            $scope.showMembership = true;
            $scope.goldSub = false;
            $scope.goldenMember = false;
            $scope.silverMember = true;
            $scope.showForm = false;
            $scope.hideAboutDesc = true;
            formdata = {};
            formdata._id = $.jStorage.get("photographer")._id;
            formdata.package = 'Gold';
            NavigationService.apiCallWithData("Photographer/saveData", formdata, function (data) {
                //console.log("dataaaaaaaaaa", data);
                $scope.packageShow = data.data.package;
                $.jStorage.set("photographer", data.data);
                $state.reload();
            });
        }
        $scope.dataArr = [];

        $scope.fliterCheck = function (data) {
            $scope.uploadImgData = [];
            //console.log("Doc", document.getElementById(data).checked);
            if (document.getElementById(data).checked) {
                $scope.dataArr.push(data);
                _.forEach($scope.dataArr, function (value) {
                    //console.log("_.filter($scope.photographerData.uploadedImages, ['category', value])", _.filter($scope.photographerData.uploadedImages, ['category', value]).length)
                    var filteredData = _.filter($scope.photographerData.uploadedImages, ['category', value])
                    _.forEach(filteredData, function (value1) {
                        $scope.uploadImgData.push(value1);
                        //console.log("$scope.uploadImgDataasdsdasds", $scope.uploadImgData);
                        $scope.showSixPhotos = _.slice($scope.uploadImgData, 0, 6);
                    });
                });
            } else {
                $scope.dataArr = _.remove($scope.dataArr, function (n) {
                    return n != data;
                });
                _.forEach($scope.dataArr, function (value) {
                    var filteredData = _.filter($scope.photographerData.uploadedImages, ['category', value])
                    _.forEach(filteredData, function (value1) {
                        $scope.uploadImgData.push(value1);
                        //console.log("$scope.uploadImgDataasdsdasds", $scope.uploadImgData);
                        $scope.showSixPhotos = _.slice($scope.uploadImgData, 0, 6);
                    });
                });
            }
            if (_.isEmpty($scope.dataArr)) {
                $scope.uploadImgData = $scope.photographerData.uploadedImages;
                $scope.showSixPhotos = _.slice($scope.uploadImgData, 0, 6);
            }
        }

        $scope.uploadImg = function () {
            $scope.imgModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/upload-photo.html",
                scope: $scope,
                windowClass: 'upload-pic',
                backdropClass: 'black-drop',
                size: 'lg'
            });
        };


        $scope.uploadImage = function (formdata) {
            //console.log("im in upload image", formdata);
            formdata._id = $.jStorage.get("photographer")._id;
            NavigationService.apiCallWithData("Photographer/uploadPhotos", formdata, function (data) {
                //console.log("data", data);
                if (data.value) {
                    //console.log("dataaaaaaaaaa", data);
                    $scope.imgModal.close();
                    console.log("modal close");
                    NavigationService.apiCallWithData("Photographer/getOne", formdata, function (data) {
                        if (data.value === true) {
                            $scope.photographerData = data.data;
                            $scope.uploadImgData = $scope.photographerData.uploadedImages;
                            $scope.showSixPhotos = _.slice($scope.uploadImgData, 0, 6);
                            $scope.uploadImgLength = $scope.uploadImgData.length;
                            $scope.uniqueCategory = _.uniqBy($scope.uploadImgData, 'category');
                            $scope.dataArr = [];
                        }
                    })
                }
            });
        };

        $scope.deleteUploadImage = function (index) {
            var formdata = {};
            formdata._id = $.jStorage.get("photographer")._id;
            formdata.id = index._id;
            NavigationService.apiCallWithData("Photographer/removeUpldImg", formdata, function (data) {
                //console.log("data", data);
                if (data.value) {
                    //console.log("dataaaaaaaaaa", data);
                    NavigationService.apiCallWithData("Photographer/getOne", formdata, function (data) {
                        if (data.value === true) {
                            $scope.photographerData = data.data;
                            $scope.uploadImgData = $scope.photographerData.uploadedImages;
                            $scope.showSixPhotos = _.slice($scope.uploadImgData, 0, 6);
                            $scope.uploadImgLength = $scope.uploadImgData.length;
                            $scope.uniqueCategory = _.uniqBy($scope.uploadImgData, 'category');
                            $scope.dataArr = [];
                        }
                    })
                }
            });
        };

        //google api autocomplete
        $scope.autoLocation = function () {
            //console.log("hiiiiiiiiiiiiiiiiiiiiiii");
            var input = document.getElementById('locationCity');
            var autocomplete = new google.maps.places.Autocomplete(input);
            //console.log("autocomplete", autocomplete);
        }
        //google api autocomplete end



        $scope.fees = [{
            priceFrom: '1000',
            priceTo: '15000',
            name: 'Upto 10,000',
            value: 'Upto 10,000'
        }, {
            priceFrom: '15000',
            priceTo: '25000',
            name: 'Upto 20,000',
            value: 'Upto 20,000'
        }, {
            priceFrom: '25000',
            priceTo: '50000',
            name: 'Upto 50,000',
            value: 'Upto 50,000'
        }, {
            priceFrom: '50000',
            priceTo: '100000',
            name: 'Upto 1,00,000',
            value: 'Upto 1,00,000'
        }, {
            priceFrom: '100000',
            priceTo: 'above',
            name: '₹100000 and above',
            value: '₹100000 and above'
        }];

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
        $scope.displayOpacity = function () {
            $('.upload-trans span').css('display', 'block');

        };
        $scope.removeOpacity = function () {

            $('.upload-trans span').css('display', 'none');

        };

    })

    .controller('FormCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("form"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Form"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.formSubmitted = false;

        $scope.submitForm = function (data) {
            //console.log(data);
            $scope.formSubmitted = true;
        };
    })

    .controller('FeaturPCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, $rootScope) {
        $scope.template = TemplateService.changecontent("feature-photographer"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Feature Photographer"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        // $rootScope.showStep="";
        $scope.activeTab = 1;
        $scope.toggleTab = function (val) {
            $scope.activeTab = val;
        };
        $scope.steps = false;
        if ($.jStorage.get("photographer")) {
            if ($.jStorage.get("photographer").status == true) {
                $scope.fetrPhoto = true;
            } else {
                $scope.fetrPhoto = false;
                $scope.steps = true;
                $scope.showStep = 2;
            }
        } else {
            $scope.steps = false;
            $scope.showStep = 1;
        }
        $scope.signUp = function (formdata, terms) {

                // formdata.serviceRequest = $scope.serviceList;
                if (!terms) {
                    // alert('check box error');
                    $('.condition-box p.alert-text').text('Please check the terms & condition checkbox').css('text-indent', '32px');
                } else {
                    //console.log(formdata);
                    NavigationService.sendLogin(formdata, function (data) {
                        if (data.data.value) {
                            //console.log(data.data.data);
                            $rootScope.showStep = 2;
                            $.jStorage.set("photographer", data.data.data);
                            $scope.template.profile = data.data.data;
                            $state.reload();
                        }
                    });
                }
            },

            // $scope.signUp = function (formdata) {
            //         // formdata.serviceRequest = $scope.serviceList;
            //         console.log(formdata);
            //         NavigationService.sendLogin(formdata, function (data) {
            //             if (data.data.value) {
            //                 console.log(data.data.value);
            //             }
            //         });
            //     },

            $scope.login = function (formdata) {
                // formdata.serviceRequest = $scope.serviceList;
                //console.log(formdata);
                NavigationService.checkLogin(formdata, function (data) {
                    if (data.data.value) {
                        //console.log(data.data.data);
                        $rootScope.showStep = 2;
                        $.jStorage.set("photographer", data.data.data);
                        $scope.template.profile = data.data.data;
                        // $state.go("photographer");
                        $state.reload();
                        // console.log("im in");
                    }
                });
            }

        if ($.jStorage.get("photographer")) {
            formdata = {};
            formdata._id = $.jStorage.get("photographer")._id;
            NavigationService.apiCallWithData("Photographer/getOne", formdata, function (data) {
                if (data.value === true) {
                    //console.log(data)
                    $scope.photographerData = data.data;
                    //console.log("$scope.photographerData--", $scope.photographerData)
                }
            });
        }

        // $scope.updateToFeature = function () {
        //     // formdata.serviceRequest = $scope.serviceList;
        //     formdata = {};
        //     formdata._id = $.jStorage.get("photographer")._id;
        //     console.log(formdata);
        //     NavigationService.updateTofeaPho(formdata, function (data) {
        //         if (data.data.value) {
        //             console.log(data.data.data);
        //             $state.go("users");
        //         }
        //     });
        // }

        //feature 

        $scope.date = new Date();
        var valMon = $scope.date.getMonth();
        var valyear = $scope.date.getFullYear();
        $scope.monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $scope.nextMonth = valMon + 1;
        $scope.mon = $scope.monthNames[$scope.nextMonth];
        //console.log("$scope.mon", $scope.mon);

        formdata = {};
        // formdata.month = $scope.mon;
        //console.log("frrrrr", formdata);
        NavigationService.apiCallWithData("Photographer/getLastFeaturedPhotographer", formdata, function (data) {
            //console.log("getLastFeaturedPhotographer", data);
            if (data.value == true) {

                var monthIndex =
                    _.findIndex($scope.monthNames, function (o) {
                        return o == data.data.lastMonth;
                    });
                if (data.data.totalItems > 0) {
                    $scope.lastYearOfRegistartion = data.data.lastYear;
                    $scope.lastDateOfRegister = data.data.lastDateOfRegister;
                    $scope.totalCountOfLastDate = data.data.totalItems;
                    $scope.date = new Date();
                    //console.log("$scope.lastDateOfRegister", $scope.lastDateOfRegister);
                    //console.log("$scope.totalCountOfLastDate", $scope.totalCountOfLastDate);
                    if ($scope.lastYearOfRegistartion >= valyear && monthIndex >= $scope.nextMonth) {
                        if ($scope.totalCountOfLastDate >= 12) {
                            $scope.finalMonth = $scope.monthNames[monthIndex + 1];
                            //console.log("$scope.finalMonth", $scope.finalMonth);
                        } else {
                            $scope.finalMonth = $scope.monthNames[monthIndex];
                            // console.log("$scope.finalMonth", $scope.finalMonth);
                        }
                    } else {
                        $scope.finalMonth = $scope.monthNames[$scope.nextMonth];
                        //console.log("$scope.finalMonth", $scope.finalMonth);
                    }
                } else {
                    $scope.finalMonth = $scope.monthNames[$scope.nextMonth];
                    //console.log("$scope.finalMonth", $scope.finalMonth);
                }
            }

        });

        $scope.updateToFeature = function () {
            formdata = {};
            formdata._id = $.jStorage.get("photographer")._id;
            formdata.mon = $scope.finalMonth;
            formdata.yea = new Date().getFullYear();
            // console.log("frrrrr", formdata);
            NavigationService.apiCallWithData("Photographer/updateToFeaturePhotographer", formdata, function (data) {
                // console.log("updateToFeaturePhotographer", data);
                if (data.value === true) {
                    formData = {};
                    formData._id = $.jStorage.get("photographer")._id;
                    NavigationService.apiCallWithData("Photographer/getOne", formData, function (data) {
                        //console.log("catdata", data);
                        if (data.value === true) {
                            $.jStorage.set("photographer", data.data);
                        }
                    });
                    //console.log(data.data.data);
                    $state.go("users");
                }
            });
        }

        //feature end

        // if ($.jStorage.get("photographer")) {
        //     $scope.template.profile = $.jStorage.get("photographer");
        // }

        if ($.jStorage.get('photographer') != null) {
            $scope.template.profile = $.jStorage.get("photographer");
        }

        $scope.benefits = [{
            "list": "100 photos",
        }, {
            "list": "3mb per photo",
        }, {
            "list": "Photos can be edited by you.",
        }, {
            "list": "Valid till 1 year.",
        }];

        if ($.jStorage.get("photographer")) {
            $scope.template.profile = $.jStorage.get("photographer");
            $rootScope.showStep = 2;
        } else {
            $rootScope.showStep = 1;
        }
        //console.log($scope.template);
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

        $scope.date = new Date();
        var valMon = $scope.date.getMonth();
        var valyear = $scope.date.getFullYear();
        $scope.monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $scope.nextMonth = valMon + 1;
        $scope.mon = $scope.monthNames[$scope.nextMonth];
        formdata = {};
        formdata.month = $scope.mon;
        NavigationService.apiCallWithData("Photographer/getFeatPhotographer", formdata, function (data) {
            //console.log("getFeatPhotographer", data);
            if (data.value === true) {
                $scope.featrData = data.data;
                //console.log("featuePhoto", $scope.featrData);
                _.forEach($scope.featrData, function (spec) {

                    _.forEach(spec.speciality, function (spec1) {

                        //console.log("spec---", spec1.name);
                        if (_.isEmpty(spec.specialityString)) {
                            //console.log("$scope.specialityString---", spec.specialityString)
                            spec.specialityString = spec1.name;
                        } else {
                            spec.specialityString = spec.specialityString + ' | ' + spec1.name;
                            //console.log("$scope.specialityString---", spec.specialityString)
                        }
                    })
                })
            }
        });

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

        // NavigationService.callApi("Categories/search", function (data) {
        //     if (data.value === true) {
        //         console.log(data)
        //         $scope.category = data.data.results;
        //         //$scope.minCategoryL3Price = _.minBy(data.data, 'price')
        //         $scope.cat = _.chunk($scope.category, 3);
        //         console.log("$scope.categocacatry--.....", $scope.cat);
        //         // $scope.categoryLvl2 = _.remove($scope.category2, function (n) {
        //         //     return n.name != $scope.categoryLevel3[0][0].categoryLevel2.name;
        //         // });
        //         // console.log($scope.categoryLvl2)
        //         // $scope.categoryLvl2 = _.chunk($scope.categoryLvl2, 3);
        //     } else {
        //         //  toastr.warning('Error submitting the form', 'Please try again');
        //     }
        // });

        NavigationService.callApi("Categories/getAll", function (data) {
            if (data.value === true) {
                //console.log(data)
                $scope.category = data.data;
                $scope.bigImageCategory = [];
                $scope.smallImageCategory = [];

                i = 0;
                _.forEach($scope.category, function (value) {
                        i++;
                        // console.log("i", i);
                        // console.log("cat", value);
                        if (value.bigimage) {
                            $scope.bigImageCategory.push(value);
                            // console.log("$scope.bigImageCategory.", $scope.bigImageCategory);
                        } else {
                            $scope.smallImageCategory.push(value);
                            //  console.log(" $scope.smallImageCategory", $scope.smallImageCategory);
                        }
                    }
                    //     //$scope.minCategoryL3Price = _.minBy(data.data, 'price')
                    //     // $scope.cat = _.chunk($scope.category, 3);
                    //     // console.log("$scope.categocacatry--.....", $scope.cat);
                    //     // // $scope.categoryLvl2 = _.remove($scope.category2, function (n) {
                    //     //     return n.name != $scope.categoryLevel3[0][0].categoryLevel2.name;
                    //     // });
                    //     // console.log($scope.categoryLvl2)
                    //     // $scope.categoryLvl2 = _.chunk($scope.categoryLvl2, 3);
                    // } else {
                    //     //  toastr.warning('Error submitting the form', 'Please try again');
                )
                $scope.bigImageCategory = _.orderBy($scope.bigImageCategory, ['order'], ['asc']);
                $scope.smallImageCategory = _.orderBy($scope.smallImageCategory, ['order'], ['asc']);
                $scope.smallCat = _.chunk($scope.smallImageCategory, 2);
                // console.log(" $scope.smallCat", $scope.smallCat)
            }
        });


    })

    .controller('UserProfileCtrl', function ($scope, $rootScope, $state, TemplateService, NavigationService, $timeout, $uibModal, $stateParams) {
        $scope.template = TemplateService.changecontent("user-profile"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("User Profile"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.activeTab = 1;
        // $scope.locString = [];
        // $scope.specialityString = [];
        // $scope.specialityS = [];
        $scope.dataArr = [];
        $scope.toggleTab = function (val) {
            $scope.activeTab = val;
            $scope.showSocial = false; // here showSocial will be display: none;
        };

        //get single user
        formData = {};
        formData._id = $stateParams.userid;
        NavigationService.apiCallWithData("Photographer/getOne", formData, function (data) {
            // console.log("catdata", data);
            if (data.value === true) {
                // console.log(data)
                $scope.userData = data.data;
                //console.log(" $scope.userData", $scope.userData);
                $scope.uploadImgData = $scope.userData.uploadedImages;
                // console.log(" $scope.uploadImgData", $scope.uploadImgData);
                $scope.uniqueCategory = _.uniqBy($scope.uploadImgData, 'category');
                // console.log(" $scope.uniqueCategory", $scope.uniqueCategory);
                _.forEach($scope.userData.speciality, function (spec) {
                    //only required the students avilable projects
                    //console.log("spec---", spec.name)
                    if (_.isEmpty($scope.specialityString)) {
                        $scope.specialityString = spec.name;
                    } else {
                        $scope.specialityString = $scope.specialityString + ' | ' + spec.name;
                    }
                })
                _.forEach($scope.userData.location, function (loc) {
                    //only required the students avilable projects
                    if (_.isEmpty($scope.locString)) {
                        $scope.locString = loc;
                    } else {
                        $scope.locString = $scope.locString + ' | ' + loc;
                    }
                    // console.log("$scope.locString", $scope.locString);
                })
                //get all related photographers
                formdata1 = {}
                formdata1.speciality = $scope.userData.speciality;
                NavigationService.apiCallWithData("Photographer/getRelatedPhotographers", formdata1, function (data) {
                    if (data.value === true) {
                        // console.log("getRelatedPhotographers", data);
                        $scope.relatedPhotographerData = data.data;
                        //console.log("$scope.relatedPhotographerData--", $scope.relatedPhotographerData);
                    }
                });
                //get all related photographers end
            }
        });
        //get single user end

        //filter
        $scope.fliterCheck = function (data) {
            $scope.uploadImgData = [];
            // console.log("Doc", document.getElementById(data).checked);
            if (document.getElementById(data).checked) {
                $scope.dataArr.push(data);
                _.forEach($scope.dataArr, function (value) {
                    // console.log("_.filter($scope.userData.uploadedImages, ['category', value])", _.filter($scope.userData.uploadedImages, ['category', value]).length)
                    var filteredData = _.filter($scope.userData.uploadedImages, ['category', value])
                    _.forEach(filteredData, function (value1) {
                        $scope.uploadImgData.push(value1);
                        //console.log("$scope.uploadImgDataasdsdasds", $scope.uploadImgData);
                    });
                });
            } else {
                $scope.dataArr = _.remove($scope.dataArr, function (n) {
                    return n != data;
                });
                _.forEach($scope.dataArr, function (value) {
                    var filteredData = _.filter($scope.userData.uploadedImages, ['category', value])
                    _.forEach(filteredData, function (value1) {
                        $scope.uploadImgData.push(value1);
                        //console.log("$scope.uploadImgDataasdsdasds", $scope.uploadImgData);
                    });
                });
            }
            if (_.isEmpty($scope.dataArr)) {
                $scope.uploadImgData = $scope.userData.uploadedImages;
                $scope.showSixPhotos = _.slice($scope.uploadImgData, 0, 6);
            }
        }
        //filter end

        //reviews
        $scope.addReviews = function (data) {
            formData = {};
            if (!_.isEmpty($.jStorage.get("photographer"))) {
                formData.user = $.jStorage.get("photographer")._id;
                formData.review = data.review;
                formData.reviewComment = data.reviewComment;
                $scope.userData.reviewList.push(formData);
                NavigationService.apiCallWithData("Photographer/saveData", $scope.userData, function (data) {
                    if (data.value) {
                        console.log(data);
                        $state.reload();
                    }
                });
            } else {

                $scope.uploadSignup();
            }
        }
        //reviews end

        //signup modal 
        $scope.uploadSignup = function () {
            // console.log("signup");
            $scope.loginModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/signup-profile.html",
                scope: $scope,
                windowClass: '',
                backdropClass: 'black-drop'
            });
        };
        $scope.logIn = function () {
            if ($scope.loginModal) {
                $scope.loginModal.close();
            }
            // console.log("login");
            $scope.signupModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/login.html",
                scope: $scope,
                windowClass: '',
                backdropClass: 'black-drop'
            });
        };

        $scope.signUp = function (formdata, terms) {
                // formdata.serviceRequest = $scope.serviceList;
                if (!terms) {
                    // alert('check box error');
                    $('.condition-box p.alert-text').text('Please check the terms & condition checkbox').css('text-indent', '32px');
                } else {
                    //console.log(formdata);
                    NavigationService.sendLogin(formdata, function (data) {
                        if (data.data.value) {
                            //console.log(data.data.data);
                            $.jStorage.set("photographer", data.data.data);
                            $scope.template.profile = data.data.data;
                            if ($scope.signupModal) {
                                $scope.signupModal.close();
                            }
                            if ($scope.loginModal) {
                                $scope.loginModal.close();
                            }
                            $state.go('photographer');
                        }
                    });
                }
            },

            $scope.login = function (formdata) {
                // formdata.serviceRequest = $scope.serviceList;
                //console.log(formdata);
                NavigationService.checkLogin(formdata, function (data) {
                    if (data.data.value) {
                        // console.log(data.data.data);
                        $.jStorage.set("photographer", data.data.data);
                        $rootScope.showStep = 2;
                        $scope.template.profile = data.data.data;
                        $scope.signupModal.close();
                        $state.go("photographer");
                    }
                });
            }

        //signup modal close

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

        // this function is used for data submmiting enquiry
        $scope.enquiryData = {};
        $scope.dataSubmit = function (data) {
            //console.log("dataSubmit", data);
        };
        //data submit enquiry

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

    .controller('WildPhotoCtrl', function ($scope, TemplateService, NavigationService, $timeout, $filter, $stateParams) {
        $scope.template = TemplateService.changecontent("wild-photographer"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Wild Photographer"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.showlessCatImages = [];
        $scope.price = [];

        //category image     
        formData = {};
        formData._id = $stateParams.catid;
        NavigationService.apiCallWithData("Categories/findOneCategories", formData, function (data) {
            //console.log("catdata", data);
            if (data.value === true) {
                //console.log(data)
                $scope.categoryInsideImg = data.data;
            }
        });
        //category image end

        //all photographers
        $scope.loc = [];
        $scope.cityFilter = [];
        formdata = {};
        formdata.speciality = $stateParams.catName;
        NavigationService.apiCallWithData("Photographer/getPhotographersByCategories", formdata, function (data) {
            if (data.value === true) {
                //console.log("getPhotographersByCategories", data);
                $scope.photographerData = data.data;
                //console.log("$scope.photographerData ", $scope.photographerData);
                _.forEach($scope.photographerData, function (spec) {
                    _.forEach(spec.location, function (spec1) {
                        //console.log("spec---", spec1);
                        if (!~$scope.cityFilter.indexOf(spec1)) {
                            $scope.cityFilter.push(spec1);
                        }
                        // console.log("$scope.cityFilter", $scope.cityFilter);
                    })
                })
            }
        });
        //all Photographers end

        //feature photographer
        $scope.date = new Date();
        var valMon = $scope.date.getMonth();
        var valyear = $scope.date.getFullYear();
        $scope.monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $scope.nextMonth = valMon + 1;
        $scope.mon = $scope.monthNames[$scope.nextMonth];
        formdata = {};
        formdata.month = $scope.mon;
        NavigationService.apiCallWithData("Photographer/getFeatPhotographer", formdata, function (data) {
            // console.log("getFeatPhotographer", data);
            if (data.value === true) {
                $scope.featrData = data.data;
                // console.log("featuePhoto", $scope.featrData);
                _.forEach($scope.featrData, function (spec) {

                    _.forEach(spec.speciality, function (spec1) {

                        // console.log("spec---", spec1.name);
                        if (_.isEmpty(spec.specialityString)) {
                            //console.log("$scope.specialityString---", spec.specialityString)
                            spec.specialityString = spec1.name;
                        } else {
                            spec.specialityString = spec.specialityString + ' | ' + spec1.name;
                            //console.log("$scope.specialityString---", spec.specialityString)
                        }
                    })
                })
            }
        });
        //feature photographer end

        //all categories
        formData = {};
        formData._id = $stateParams.catid;
        NavigationService.apiCallWithData("Categories/getAll", formData, function (data) {
            console.log("catdata", data);
            if (data.value === true) {
                $scope.category = data.data;
                $scope.showlessCatImages = _.slice($scope.category, 0, 4);
                //console.log("Categories", $scope.category)
            }
        });
        //all categories end

        //loadmore for categories
        $scope.LoadMore = function () {
            $scope.showlessCatImages = $scope.category;
        };
        //loadmore for categories end

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

        $scope.categories = [{
            "background": "frontend/img/cat3.jpg"
        }, {
            "background": "frontend/img/cat4.jpg"
        }, {
            "background": "frontend/img/cat3.jpg"
        }, {
            "background": "frontend/img/cat4.jpg"
        }];

        // filter
        var formdata = {}
        $scope.priceRange = [];
        $scope.cityFill = [];
        $scope.priceList = ["₹1000-₹15000", "₹15000-₹25000", "₹25000-₹50000", "₹50000-₹100000", "₹100000 and above"];
        $scope.priceFil = function (data) {
            var check;
            if (/\d/.test(data)) {
                $scope.priceRange.push($scope.priceList[data]);
                check = $scope.priceList[data];

            } else {
                $scope.cityFill.push(data);
                check = data;
            }
            console.log("Doc", document.getElementById(check).checked);
            if (document.getElementById(check).checked) {
                // $scope.price.push(priceRange);
                formdata.pricing = $scope.priceRange;
                formdata.location = $scope.cityFill;
                NavigationService.apiCallWithData("Photographer/clickFilter", formdata, function (data) {
                    console.log("clickFilter", data);
                    if (data.value === true) {
                        $scope.photographerData = data.data;
                    }
                });
            } else {
                if (/\d/.test(data)) {
                    $scope.priceRange = _.remove($scope.priceRange, function (n) {
                        return n != $scope.priceList[data];
                    });
                } else {
                    $scope.cityFill = _.remove($scope.cityFill, function (n) {
                        return n != data;
                    });
                }
                console.log("$scope.priceRange", $scope.priceRange);
                // $scope.price.push(priceRange);
                if (!_.isEmpty($scope.priceRange) || !_.isEmpty($scope.cityFill)) {
                    formdata.pricing = $scope.priceRange;
                    formdata.location = $scope.cityFill;
                    NavigationService.apiCallWithData("Photographer/clickFilter", formdata, function (data) {
                        console.log("clickFilter", data);
                        if (data.value === true) {
                            $scope.photographerData = data.data;
                        }
                    });
                } else {
                    //all photographers
                    formdata = {};
                    formdata.speciality = $stateParams.catName;
                    NavigationService.apiCallWithData("Photographer/getPhotographersByCategories", formdata, function (data) {
                        if (data.value === true) {
                            //console.log("getPhotographersByCategories", data);
                            $scope.photographerData = data.data;
                            //console.log("$scope.photographerData--", $scope.photographerData)
                        }
                    });
                    //all Photographers end
                }
            }
        }
        // filter end

    })

    .controller('headerctrl', function ($scope, TemplateService, $uibModal, NavigationService, $state, $rootScope) {
        $scope.template = TemplateService;

        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $(window).scrollTop(0);
        });
        $.fancybox.close(true);
        $scope.uploadSignup = function () {
            console.log("signup");
            $scope.loginModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/signup-profile.html",
                scope: $scope,
                windowClass: '',
                backdropClass: 'black-drop'
            });
        };
        $scope.logIn = function () {
            if ($scope.loginModal) {
                $scope.loginModal.close();
            }
            console.log("login");
            $scope.signupModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/login.html",
                scope: $scope,
                windowClass: '',
                backdropClass: 'black-drop'
            });
        };

        $scope.signUp = function (formdata, terms) {
                // formdata.serviceRequest = $scope.serviceList;
                if (!terms) {
                    // alert('check box error');
                    $('.condition-box p.alert-text').text('Please check the terms & condition checkbox').css('text-indent', '32px');
                } else {
                    // console.log(formdata);
                    NavigationService.sendLogin(formdata, function (data) {
                        if (data.data.value) {
                            //console.log(data.data.data);
                            $.jStorage.set("photographer", data.data.data);
                            $scope.template.profile = data.data.data;
                            if ($scope.signupModal) {
                                $scope.signupModal.close();
                            }
                            if ($scope.loginModal) {
                                $scope.loginModal.close();
                            }
                            $state.go('photographer');
                        }
                    });
                }
            },

            $scope.subscribeData = function (formdata) {
                //  console.log("formdatafsgdvtrhejy", formdata);
                NavigationService.apiCallWithData("SubscribeEmail/save", formdata, function (data) {
                    if (data.value === true) {
                        // console.log(data);
                        $scope.subscribeModal = $uibModal.open({
                            animation: true,
                            templateUrl: "frontend/views/modal/subscribe.html",
                            scope: $scope,
                            windowClass: '',
                            size: 'sm',
                            backdropClass: 'black-drop'
                        });
                    }
                });
            },



            $scope.login = function (formdata) {
                // formdata.serviceRequest = $scope.serviceList;
                //  console.log(formdata);
                NavigationService.checkLogin(formdata, function (data) {
                    if (data.data.value) {
                        //  console.log(data.data.data);
                        $.jStorage.set("photographer", data.data.data);
                        $rootScope.showStep = 2;
                        $scope.template.profile = data.data.data;
                        $scope.signupModal.close();
                        $state.go("photographer");
                    }
                });
            }

        if ($.jStorage.get("photographer")) {
            $scope.template.profile = $.jStorage.get("photographer");
        }

        $scope.logout = function () {
            $.jStorage.flush();
            $scope.template.profile = null;
            $state.go("home");

        }
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

    .controller('aboutusCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("aboutus"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("About-Us"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

    })

    .controller('privacyPolicyCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("privacy-policy"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("privacy-policy"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

    })

    .controller('termsCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("terms"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Terms"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

    })

    .controller('contactUsCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("contact-us"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Contact"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

    })

    .controller('competitionCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("competition"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Photo-Contest"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();


    })

    .controller('photoContestCtrl', function ($scope, TemplateService, NavigationService, $timeout, $uibModal) {
        $scope.template = TemplateService.changecontent("photo-contest"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Photo-Contest"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.uploadImg = function () {
            $scope.imgModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/upload-photo.html",
                scope: $scope,
                windowClass: 'upload-pic',
                backdropClass: 'black-drop',
                size: 'lg'
            });
        };

    })
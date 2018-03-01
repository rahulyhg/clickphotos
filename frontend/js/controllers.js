angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ui.bootstrap', 'ngSanitize', 'angular-flexslider', 'ui.swiper', 'imageupload', 'toastr', 'ui.select',
        'angular-loading-bar'
    ])
    .run(function ($rootScope) {
        $rootScope.cartLength = 0;
    })

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
        // console.log("FormData--", formdata);
        NavigationService.apiCallWithData("Photographer/getFeatPhotographer", formdata, function (data) {
            //console.log("getFeatPhotographer", data);
            if (data.value === true) {
                $scope.featrData = data.data;
                //console.log("$scope.featrData-----", $scope.featrData);
                if (!_.isEmpty($.jStorage.get("photographer"))) {
                    var idToBeRemoved = $.jStorage.get("photographer")._id;
                    $scope.featrData = _.remove($scope.featrData, function (n) {
                        return n._id != idToBeRemoved;
                    });
                }
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

        // //signup modal 
        // $scope.uploadSignup = function () {
        //     //console.log("signup");
        //     $scope.loginModal = $uibModal.open({
        //         animation: true,
        //         templateUrl: "frontend/views/modal/signup-profile.html",
        //         scope: $scope,
        //         windowClass: '',
        //         backdropClass: 'black-drop'
        //     });
        // };
        // $scope.logIn = function () {
        //     if ($scope.loginModal) {
        //         $scope.loginModal.close();
        //     }
        //     //console.log("login");
        //     $scope.signupModal = $uibModal.open({
        //         animation: true,
        //         templateUrl: "frontend/views/modal/login.html",
        //         scope: $scope,
        //         windowClass: '',
        //         backdropClass: 'black-drop'
        //     });
        // };

        // $scope.signUp = function (formdata, terms) {
        //         // formdata.serviceRequest = $scope.serviceList;
        //         if (!terms) {
        //             // alert('check box error');
        //             $('.condition-box p.alert-text').text('Please check the terms & condition checkbox').css('text-indent', '32px');
        //         } else {
        //             //console.log(formdata);
        //             NavigationService.sendLogin(formdata, function (data) {
        //                 if (data.data.value) {
        //                     //console.log(data.data.data);
        //                     $.jStorage.set("photographer", data.data.data);
        //                     $scope.template.profile = data.data.data;
        //                     if ($scope.signupModal) {
        //                         $scope.signupModal.close();
        //                     }
        //                     if ($scope.loginModal) {
        //                         $scope.loginModal.close();
        //                     }
        //                     $state.go('photographer');
        //                 }
        //             });
        //         }
        //     },

        //     $scope.login = function (formdata) {
        //         // formdata.serviceRequest = $scope.serviceList;
        //         //console.log(formdata);
        //         NavigationService.checkLogin(formdata, function (data) {
        //             if (data.data.value) {
        //                 //console.log(data.data.data);
        //                 $.jStorage.set("photographer", data.data.data);
        //                 $rootScope.showStep = 2;
        //                 $scope.template.profile = data.data.data;
        //                 $scope.signupModal.close();
        //                 $state.go("photographer");
        //             }
        //         });
        //     }

        // //signup modal close


        $scope.testimonial = [{ // used for testimonials
            name: 'Naveen Kumar',
            text: "I am <b>Naveen Kumar</b> and I am a finance professional working for an MNC for over a decade now.Photography is my passion and I take special interest in Sports / Wedding / Pre-wedding and Studio Photography. I do photography independently as well as with other professional photographers.",
            thought: 'I keep upgrading my gear frequently without digging into my salary income. Clickmania is a perfect platform for me.'
            //ceo: "manan vora, CEO & founder Ting"
        }, {
            name: ' Palak Jain ',
            text: "I am <b> Palak Jain</b> and I am a model based in Mumbai.  I have done commercials for well known brands and appeared in music videos. It is extremely important to have a good portfolio shoot done for achieving the goals in the modelling and acting world. It was wonderful to shoot for Clickmania and getting a portfolio done at the same time. Thank you Clickmania.",


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
                    'transition': 'all 300ms ease-in-out',
                    'position': 'absolute',
                    'bottom': '60px'
                });

            } else {
                $('.sliding_bg .scroll_down').css({

                    WebkitTransition: 'opacity 1s ease-in-out',
                    MozTransition: 'opacity 1s ease-in-out',
                    MsTransition: 'opacity 1s ease-in-out',
                    'transition': 'all 300ms ease-in-out',
                    'position': 'absolute',
                    'bottom': '125px'
                });
            }
        });

        // used for left-sidebar navigation
        // $scope.state = false;
        // $scope.toggleState = function ($event) {
        //     $scope.state = !$scope.state;

        // };

    })

    .controller('PhotographerCtrl', function ($scope, TemplateService, NavigationService, $timeout, $uibModal, $http, $state, toastr) {
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
        $scope.adPricing = [];
        validDateForSilver = {};
        validDateForGold = {};
        $scope.amount = {};
        $scope.oneAtATime = true;

        //Function to change ths plus & minus sign in photo contest tab
        $scope.imgUrl = 'frontend/img/plus.png';
        $scope.changeSign = function (imgUrl) {
            if (imgUrl === 'frontend/img/plus.png') {
                return 'frontend/img/minus.png';
            } else {
                // $scope.imgUrl = 
                return 'frontend/img/plus.png';
            }
        }

        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };

        $scope.downloadInvoice = function () {
            var data = {};
            data.photographerId = $.jStorage.get("photographer")._id;
            NavigationService.apiCallWithData("GstDetails/findGstState", data, function (data) {
                // console.log(data)
            })

        }

        NavigationService.callApi("PayAmount/getAll", function (data) {
            $scope.amount = data.data;
        });

        //goldpackgeupdateDynamic
        if ($.jStorage.get("photographer")) {
            if ($.jStorage.get("photographer").package == "Silver") {
                formdata = {};
                formdata._id = $.jStorage.get("photographer")._id;
                NavigationService.apiCallWithData("Photographer/findTotalPriceOfGold", formdata, function (data) {
                    if (data.value === true) {
                        $scope.dyGoldAmount = data.data;
                        // console.log("$scope.dyGoldAmount++++++++++++++++++", $scope.dyGoldAmount);
                        if ($scope.amount[5]) {
                            formdata1 = {};
                            formdata1._id = $scope.amount[5]._id;
                            formdata1.name = 'GoldPack';
                            formdata1.state = 6;
                            formdata1.amount = $scope.dyGoldAmount;
                            // console.log("formdata1", formdata1);
                            NavigationService.apiCallWithData("PayAmount/save", formdata1, function (data) {
                                if (data.value === true) {
                                    // console.log("sucessss upadated");
                                }
                            });
                        } else {
                            formdata1 = {};
                            formdata1.name = 'GoldPackage';
                            formdata1.state = 7;
                            formdata1.amount = $scope.dyGoldAmount;
                            // console.log("formdata1", formdata1);
                            NavigationService.apiCallWithData("PayAmount/save", formdata1, function (data) {
                                if (data.value === true) {
                                    // console.log("sucessss");
                                }
                            });
                        }
                    }
                });

                $scope.dyGoldMemberPackage = function () {
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

                    formdata.photographer = $.jStorage.get("photographer")._id;
                    formdata.payAmount = '';
                    formdata.amount = $scope.dyGoldAmount;
                    formdata.email = $.jStorage.get("photographer").email;
                    formdata.return_url = adminurl + "Photographer/paymentGatewayResponce";
                    formdata.name = $.jStorage.get("photographer").name;
                    formdata.type = "Gold/" + $.jStorage.get("photographer")._id;
                    // console.log(formdata);
                    NavigationService.apiCallWithData("Photographer/checkoutPayment", formdata, function (data) {
                        // console.log(data);

                        window.location.href = adminurl + "photographer/sendToPaymentGateway?id=" + data.data._id;
                    });
                };
            }
        }

        //goldpackgeupdateDynamic end

        $scope.imageSize = function (data) {
            // console.log("data------", data);
            if (data == 'More than 3Mb') {
                toastr.error('Image Size Is More Than 3 Mb');
            } else {
                toastr.error('Image Size Is More Than 1 Mb');
            }
        }

        if ($.jStorage.get("photographer")) {
            formdata = {};
            formdata._id = $.jStorage.get("photographer")._id;
            NavigationService.apiCallWithData("Photographer/getOne", formdata, function (data) {
                // console.log($scope.tab4Hide);
                if (data.value === true) {
                    //console.log(data)
                    $scope.showAllTabs = {};
                    $scope.photographerData = data.data;

                    if (!_.isEmpty($scope.photographerData.package)) {
                        if (!_.isEmpty($scope.photographerData.silverPackageBroughtDate) && !_.isEmpty($scope.photographerData.goldPackageBroughtDate)) {
                            $scope.showAllTabs = 'show';
                        }
                        // else if (_.isEmpty($scope.photographerData.silverPackageBroughtDate) && !_.isEmpty($scope.photographerData.goldPackageBroughtDate)) {
                        //     $scope.showAllTabs = 'hide';
                        // }
                    }


                    if ($scope.photographerData) {
                        if ($scope.photographerData.photoContestPackage == "PackageUpdateForThree") {
                            var packages = [0, 1, 2];
                        } else if ($scope.photographerData.photoContestPackage == "PackageUpdateForSix") {
                            var packages = [0, 1, 2, 3, 4, 5];
                        } else if ($scope.photographerData.photoContestPackage == "PackageUpdateForNine") {
                            var packages = [0, 1, 2, 3, 4, 5, 6, 7, 8];
                        }
                        $scope.packageChunk = _.chunk(packages, 3);
                    }

                    $scope.uploadImageContest = function (imagesData, imageSize) {
                        // console.log("for ", imageSize);
                        var input = {
                            _id: $scope.contestIdModal,
                            id: $.jStorage.get("photographer")._id,
                            oid: $scope.orderIdModal,
                            photos: [imagesData.image]
                        }
                        // console.log("imageData", input)
                        NavigationService.uploadContestPhotos(input, function (data) {
                            var input = {
                                photographerId: $.jStorage.get('photographer')._id,
                            }
                            // console.log("for upload", data);
                            NavigationService.apiCallWithData("PhotoContest/findAllPhotographersInContest", input, function (data) {
                                //console.log("contestdata", data.data);
                                $scope.contestDetails = data.data;
                                toastr.success("image uploaded sucessfully");
                                $scope.imgModal.close();

                                /************************************************ */
                            });
                        });
                    }

                    if (!_.isEmpty($scope.photographerData.contest)) {
                        $scope.tab4Hide = $scope.photographerData.contest.length

                        //bring data for contest for particularuser
                        var input = {
                            photographerId: $.jStorage.get('photographer')._id,
                        }
                        /*****************getting all contest of give photographer***************** */
                        NavigationService.apiCallWithData("PhotoContest/findAllPhotographersInContest", input, function (data) {
                            $scope.contestDetails = data.data;
                            // console.log("contestdata", data.data);

                        });
                    }

                    $scope.validDateForSilver = new Date($scope.photographerData.silverPackageBroughtDate);
                    $scope.validDateForSilver.setYear($scope.validDateForSilver.getFullYear() + 1);
                    // console.log("$scope.validDateForSilver",$scope.validDateForSilver);
                    $scope.validDateForGold = new Date($scope.photographerData.goldPackageBroughtDate);
                    $scope.validDateForGold.setYear($scope.validDateForGold.getFullYear() + 1);
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
                    });
                    angular.forEach($scope.photographerData.location, function (loc) {
                        //only required the students avilable projects
                        if (_.isEmpty($scope.locString)) {
                            $scope.locString = loc;
                        } else {
                            $scope.locString = $scope.locString + ' | ' + loc;
                        }
                        //console.log("$scope.locString", $scope.locString);
                    });
                    $scope.adPricing = $scope.photographerData.pricing;
                    angular.forEach($scope.photographerData.pricing, function (pri) {
                        if (_.isEmpty($scope.priceDataa)) {
                            $scope.priceDataa = pri;
                        } else {
                            $scope.priceDataa = $scope.priceDataa + ' , ' + pri;
                        }
                    });
                    _.forEach($scope.fees, function (val) {
                        _.forEach($scope.photographerData.pricing, function (val1) {
                            if (_.isEqual(val1, val.name)) {
                                val.status = true;
                            }
                        })
                    })
                    // console.log("$scope.photographerData--", $scope.photographerData)
                    $scope.formData = {}
                    NavigationService.callApi("Categories/getAll", function (data) {
                        if (data.value === true) {
                            // console.log(data)
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

        //for specaility

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

        //for pricing

        $scope.addPricing = function (data) {
            if (document.getElementById(data.name).checked) {
                $scope.adPricing.push(data.name);
            } else {
                var list = _.remove($scope.adPricing, function (n) {
                    return _.isEqual(n, data.name);
                });
            }
            //console.log("adPricing-------",$scope.adPricing);
        };

        $scope.removePricing = function (index, name) {
            //console.log("name",name);
            document.getElementById(name).checked = false;
            $scope.adPricing.splice(index, 1);
        }

        // $scope.formData1 = {}
        // NavigationService.callApi("Locations/getAll", function (data) {
        //     if (data.value === true) {
        //         //console.log("location data", data);
        //         $scope.LocationData = data.data;
        //         _.forEach($scope.LocationData, function (value1) {
        //             _.forEach($scope.photographerData.location, function (value2) {
        //                 if (_.isEqual(value1.name, value2.name)) {
        //                     $scope.arrLocation.push(value1._id)
        //                     value1.value = true;
        //                     $scope.formData1[value1.name] = true;
        //                 }
        //             });
        //         });
        //         //console.log("$scope.arrLocation--", $scope.arrLocation)
        //     }
        // });

        //sid code 
        // for Plus to minus button
        $scope.iconChange = function () {
            $('.collapse').on('show.bs.collapse', function () {
                $('div.absolute-plus > img').attr('src', 'frontend/img/minus.png');
            });

            $('.collapse').on('hide.bs.collapse', function () {
                $('div.absolute-plus > img').attr('src', 'frontend/img/plus.png');
            });
        };
        $scope.dummy = {}
        $scope.addLocation = function () {
            // console.log("dummytext", $scope.dummy)
            if (!_.isEmpty(document.getElementById("locationCity").value)) {
                var valText = document.getElementById("locationCity").value;
                // console.log(valText)
                var valArr = [];
                //console.log(!/\d/.test(valText)); //returns true if contains numbers
                if (!/\d/.test(valText)) {
                    valArr = valText.split(",");
                    if (!/\d/.test(valArr[0])) {
                        $scope.arrLocation.push(valArr[0]);

                        $scope.$digest();
                    }
                    document.getElementById("locationCity").value = null
                }
            } else {
                // alert('Please enter the location');
                toastr.error('Please enter the location');
            }
        }

        $scope.removeLocation = function (index) {
            $scope.arrLocation.splice(index, 1);
        }
        //sid code  end

        $scope.about = true;

        $scope.done = function (formdata) {
            formdata.speciality = $scope.specialityList;
            formdata.pricing = $scope.adPricing;
            formdata.location = $scope.arrLocation;
            if (!_.isEmpty(formdata.location)) {
                // console.log("doneFormData", formdata);
                NavigationService.apiCallWithData("Photographer/allUpdate", formdata, function (data) {
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
            } else {
                // alert('Please enter the location');
                toastr.error('Please enter the location');
            }
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

        // $scope.photographerData = {
        //     coverPic: ""
        // };

        // $scope.photographerData = {
        //     profilePic: ""
        // };

        $scope.photographerData.coverPic = {};
        $scope.photographerData.profilePic = {};

        // $scope.$watch("photographerData.coverPic", function (newImage, oldImage) {
        //     //console.log("Change in image", newImage, oldImage);
        //     $scope.photographerData._id = $.jStorage.get("photographer")._id;
        //     $scope.photographerData.coverPic = newImage
        //     NavigationService.apiCallWithData("Photographer/saveData", $scope.photographerData, function (data) {
        //         //console.log("coverPhotoUpdate", data);

        //     });

        // });

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
            //console.log($scope.termS);
            $scope.silverSub = true;
            $scope.termS = false;
            $scope.silverPackage = false;
            //console.log($scope.termS);

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

            // ABS PAYMENT GATEWAY
            formdata.photographer = $.jStorage.get("photographer")._id;
            formdata.payAmount = $scope.amount[0]._id;
            formdata.amount = $scope.amount[0].amount;
            formdata.email = $.jStorage.get("photographer").email;
            formdata.return_url = adminurl + "Photographer/paymentGatewayResponce";
            formdata.name = $.jStorage.get("photographer").name;
            formdata.type = "Silver/" + $.jStorage.get("photographer")._id;
            // console.log(formdata);
            NavigationService.apiCallWithData("Photographer/checkoutPayment", formdata, function (data) {
                // console.log(data);
                window.location.href = adminurl + "photographer/sendToPaymentGateway?id=" + data.data._id;
            });

            // formdata._id = $.jStorage.get("photographer")._id;
            // formdata.package = 'Silver';
            // formdata.packageBroughtDate = new Date();
            // NavigationService.apiCallWithData("Photographer/updateToSilver", formdata, function (data) {
            //     $scope.packageShow = data.data.package;
            //     $.jStorage.set("photographer", data.data);
            //     $state.go("thanks-silver");
            // });

        };


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

            formdata.photographer = $.jStorage.get("photographer")._id;
            formdata.payAmount = $scope.amount[1]._id;
            formdata.amount = $scope.amount[1].amount;
            formdata.email = $.jStorage.get("photographer").email;
            formdata.return_url = adminurl + "Photographer/paymentGatewayResponce";
            formdata.name = $.jStorage.get("photographer").name;
            formdata.type = "Gold/" + $.jStorage.get("photographer")._id;
            // console.log(formdata);
            NavigationService.apiCallWithData("Photographer/checkoutPayment", formdata, function (data) {
                // console.log(data);
                window.location.href = adminurl + "photographer/sendToPaymentGateway?id=" + data.data._id;
            });

            // formdata._id = $.jStorage.get("photographer")._id;
            // formdata.package = 'Gold';
            // formdata.packageBroughtDate = new Date();
            // NavigationService.apiCallWithData("Photographer/updateToGold", formdata, function (data) {
            //     $scope.packageShow = data.data.package;
            //     $.jStorage.set("photographer", data.data);
            //     $state.go("thanks-gold");
            // });
        };

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

        //upload image

        $scope.imageData = {};
        $scope.addImages = function (val) {
            //console.log("val", val);
            $scope.imageData.category = val.name;
            //console.log("$scope.imageData", $scope.imageData.category);
            //     if (_.isEqual(type, "category")) {
            //         $scope.filterToBeApplied.category = val._id;
            //         $scope.filterToBeApplied.catName = val.name;
            //     } else {
            //         $scope.filterToBeApplied.city = val;
            //     }
            //   //  console.log("$scope.filterToBeApplied ", $scope.filterToBeApplied);
        }

        $scope.uploadImg = function (contest) {
            $scope.contestIdModal = contest;
            $scope.imgModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/upload-photo.html",
                scope: $scope,
                windowClass: 'upload-pic',
                backdropClass: 'black-drop',
                size: 'lg'
            });
        };

        $scope.uploadImgForContest = function (contest, order) {
            $scope.contestIdModal = contest;
            $scope.orderIdModal = order;
            $scope.imgModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/photoContestModal.html",
                scope: $scope,
                windowClass: 'upload-pic',
                backdropClass: 'black-drop',
                size: 'lg'
            });
        };


        $scope.uploadImagePic = function (formdata) {
            //console.log("im in upload image", formdata);
            formdata.category = $scope.imageData.category;
            formdata._id = $.jStorage.get("photographer")._id;
            NavigationService.apiCallWithData("Photographer/uploadPhotos", formdata, function (data) {
                //console.log("data", data);
                if (data.value) {
                    //console.log("dataaaaaaaaaa", data);
                    $scope.imgModal.close();
                    //console.log("modal close");
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
        //upload image end


        //upload profile pic

        $scope.userUploadImg = function () {
            $scope.profilePicModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/userupload-photo.html",
                scope: $scope,
                windowClass: 'upload-pic',
                backdropClass: 'black-drop',
                size: 'lg'
            });
        };

        $scope.photographerData = {};

        $scope.uploadProfilePic = function (formdata) {
            $scope.photographerData._id = $.jStorage.get("photographer")._id;
            $scope.photographerData.profilePic = formdata.profilePic;
            NavigationService.apiCallWithData("Photographer/allUpdate", $scope.photographerData, function (data) {
                //console.log("profilePhotoUpdate", data);
                if (data.value == true) {
                    $scope.profilePicModal.close();
                    $.jStorage.flush();
                    $.jStorage.set("photographer", $scope.photographerData);
                    $scope.template.profile = $scope.photographerData;
                }
            });
        };

        //upload profile pic end

        //delete modal
        $scope.deletePhoto = function (size, item) {
            $scope.deleteMe = item;
            //console.log( $scope.deleteMe )
            $scope.loginModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/delete-photo.html",
                scope: $scope,
                size: size,
                windowClass: '',
                backdropClass: 'black-drop'
            });

        };
        $scope.closeModal = function () {
            $scope.loginModal.close();
        };
        //delete modal end



        //delete upload image
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
            $scope.loginModal.close();
        };
        //delete upload image

        //google api autocomplete
        $scope.autoLocation = function () {
            //console.log("hiiiiiiiiiiiiiiiiiiiiiii");
            var input = document.getElementById('locationCity');
            var autocomplete = new google.maps.places.Autocomplete(input);
            // google.maps.event.addListener(autocomplete, 'click', function () {
            //     alert('CLicked');
            // // });
            autocomplete.addListener('place_changed', function () {
                $scope.addLocation();


            });

        }
        //google api autocomplete end



        $scope.fees = [{
            name: '5k-10k',
            value: '5k-10k'
        }, {
            name: '10k-25k',
            value: '10k-25k'
        }, {
            name: '25k-50k',
            value: '25k-50k'
        }, {
            name: '50k-1lakh',
            value: '50k-1lakh'
        }, {
            name: '1lakh plus',
            value: '1lakh plus'
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

    .controller('FeaturPCtrl', function ($scope, TemplateService, NavigationService, $timeout, $state, $rootScope, $uibModal, toastr) {
        $scope.template = TemplateService.changecontent("feature-photographer"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Feature Photographer"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.amount = {};


        NavigationService.callApi("PayAmount/getAll", function (data) {
            $scope.amount = data.data;
        });

        // $rootScope.showStep="";
        $scope.activeTab = 1;
        $scope.toggleTab = function (val) {
            $scope.activeTab = val;
        };
        $scope.steps = false;
        if ($.jStorage.get("photographer")) {

            $scope.showStep = 2;

        } else {
            $scope.steps = false;
            $scope.showStep = 1;
        }
        // $scope.signUp = function (formdata, terms) {

        //         // formdata.serviceRequest = $scope.serviceList;
        //         if (!terms) {
        //             // alert('check box error');
        //             $('.condition-box p.alert-text').text('Please check the terms & condition checkbox').css('text-indent', '32px');
        //         } else {
        //             //console.log(formdata);
        //             NavigationService.sendLogin(formdata, function (data) {
        //                 if (data.data.value) {
        //                     //console.log(data.data.data);
        //                     $rootScope.showStep = 2;
        //                     $.jStorage.set("photographer", data.data.data);
        //                     $scope.template.profile = data.data.data;
        //                     $state.reload();
        //                 }
        //             });
        //         }
        //     },

        //sign up functtionallity

        $scope.signUp = function () {
                $rootScope.showStep = 2;
                $state.reload();
            },

            //verify and send mail for signup password

            $scope.showOtpBox = false;
        $scope.showSucessBox = false;

        $scope.verifyAndSendSignUpEmail = function (formdata, terms) {
            // console.log("formdata", formdata);
            if (!terms) {
                // alert('check box error');
                $('.condition-box p.alert-text').text('Please check the terms & condition checkbox').css('text-indent', '32px');
            } else {
                // if (formdata.name && formdata.email && formdata.password && formdata.ConfirmPassword) {
                if (_.isEqual(formdata.password, formdata.ConfirmPassword)) {
                    $scope.registerData = formdata;
                    NavigationService.apiCallWithData("Photographer/checkPhotographersForOtp", formdata, function (data) {
                        //console.log("dataForOtp", data);
                        if (data.data.verifyAcc == false) {
                            //console.log(data.data);
                            $scope.signUpOTP();
                            setTimeout(function (data) {
                                $scope.signUpOTP.close();
                            }, 600000);
                        } else {
                            toastr.error('User already exist');
                        }
                    });
                } else {
                    toastr.error('Check password');
                }
                // } else {
                //     toastr.error('Please enter all details');
                // }

            }
        };

        $scope.checkOTPForSignUp = function (formdata) {
            $scope.registerData.otp = formdata.otp;
            NavigationService.apiCallWithData("Photographer/verifyOTP", $scope.registerData, function (data) {
                //console.log("dataForOtp", data);
                if (data.value == true) {
                    // console.log("email OTP verified");
                    $.jStorage.set("photographer", data.data);
                    $scope.showSucessBox = true;
                } else {
                    alert("Incorrect OTP!");
                }
            });
        }
        //verify and send mail for signup password


        //sign up otp verification modal
        $scope.signUpOTP = function () {
            $scope.signUpOTP = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/signup-otp.html",
                scope: $scope,
                windowClass: '',
                backdropClass: 'black-drop'
            });
            $scope.closeModal = function () { // to close modals for ALL OTP
                $scope.signUpOTP.close();
            };
        };
        //sign up otp verification modal end

        //sign up functtionallity end


        $scope.login = function (formdata) {
            // formdata.serviceRequest = $scope.serviceList;
            // console.log(formdata);
            NavigationService.checkLogin(formdata, function (data) {
                if (data.data.value) {
                    //console.log(data.data.data);
                    $rootScope.showStep = 2;
                    $.jStorage.set("photographer", data.data.data);
                    $scope.template.profile = data.data.data;
                    // $state.go("photographer");
                    $state.reload();
                    // console.log("im in");
                } else {
                    toastr.error('Incorrect credential');
                }
            });
        }


        //reset password Funct

        // Forgot password modal
        $scope.changePwd = function () {
            $scope.pwdModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/forgotpass.html",
                scope: $scope,
                // windowClass: 'modalWidth',
                backdropClass: 'black-drop'
            });
            $scope.closeModal = function () { // to close modals for ALL OTP
                $scope.pwdModal.close();
            };
        };
        //End of forgot password modal

        //verify and send mail for forgot password
        $scope.displayCnfirmBox = false;
        $scope.displayotpBox = false;
        $scope.displayThanksBox = false;
        $scope.verifyAndSendEmail = function (formdata) {
            $scope.displayotpBox = true;
            NavigationService.apiCallWithData("Photographer/sendOtp", formdata, function (data) {
                if (data.value) {
                    $scope.id = data.data._id;
                }
            });
        };

        $scope.checkOTP = function (otp) {
            NavigationService.apiCallWithData("Photographer/verifyOTPForResetPass", otp, function (data) {
                //console.log("dataForOtp", data.data);
                if (data.value == true) {
                    $scope.displayCnfirmBox = true;
                    $scope.displayotpBox = false;
                } else {
                    toastr.error('Incorrect OTP!');
                }
            });
        };

        $scope.resetPass = function (formdata) {
            if (_.isEqual(formdata.password, formdata.ConfirmPassword)) {
                formdata._id = $scope.id;
                NavigationService.apiCallWithData("Photographer/updatePass", formdata, function (data) {
                    if (data.value) {
                        $scope.displayCnfirmBox = false;
                        $scope.displayotpBox = false;
                        $scope.displayThanksBox = true;
                    }
                });
            } else {
                toastr.error('Check password');
            }
        };
        //verify and send mail for forgot password end
        //reset password funct end

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

        $scope.updateToFeature = function (order, phone) {

            formdata = {};

            formdata.photographer = $.jStorage.get("photographer")._id;
            formdata.payAmount = $scope.amount[2]._id;
            formdata.amount = $scope.amount[2].amount;
            formdata.email = $.jStorage.get("photographer").email;
            formdata.phone = phone;
            formdata.return_url = adminurl + "Photographer/paymentGatewayResponce";
            formdata.name = $.jStorage.get("photographer").name;
            formdata.type = "featured/" + $.jStorage.get("photographer")._id + "/" + $scope.finalMonth + "/" + new Date().getFullYear() + "/" + $scope.amount[2].amount + "/" + order;
            // console.log(formdata);
            NavigationService.apiCallWithData("Photographer/checkoutPayment", formdata, function (data) {
                // console.log(data);
                window.location.href = adminurl + "photographer/sendToPaymentGateway?id=" + data.data._id;
            });

            // formdata = {};
            // formdata._id = $.jStorage.get("photographer")._id;
            // formdata.mon = $scope.finalMonth;
            // formdata.yea = new Date().getFullYear();
            // NavigationService.apiCallWithData("Photographer/updateToFeaturePhotographer", formdata, function (data) {
            //     if (data.value === true) {
            //         formData = {};
            //         formData._id = $.jStorage.get("photographer")._id;
            //         NavigationService.apiCallWithData("Photographer/getOne", formData, function (data) {
            //             if (data.value === true) {
            //                 $.jStorage.set("photographer", data.data);
            //             }
            //         });
            //         $state.go("thanks");
            //     }
            // });
        };

        //feature end

        // if ($.jStorage.get("photographer")) {
        //     $scope.template.profile = $.jStorage.get("photographer");
        // }

        if ($.jStorage.get('photographer') != null) {
            $scope.template.profile = $.jStorage.get("photographer");
        }

        // $scope.benefits = [{
        //     "list": "100 photos",
        // }, {
        //     "list": "3mb per photo",
        // }, {
        //     "list": "Photos can be edited by you.",
        // }, {
        //     "list": "Valid till 1 year.",
        // }];

        if ($.jStorage.get("photographer")) {
            $scope.template.profile = $.jStorage.get("photographer");
            $rootScope.showStep = 2;
        } else {
            $rootScope.showStep = 1;
        }
        $scope.gstPayment = function (userdetails) {
            // console.log("userdetails", userdetails)
            $scope.userData = {};
            $scope.userData.firstName = userdetails.fname;
            $scope.userData.lastName = userdetails.lname;
            $scope.userData.address = userdetails.address;
            $scope.userData.phone = userdetails.phone;
            $scope.userData.state = userdetails.state;
            $scope.userData.city = userdetails.city;
            $scope.userData.pincode = userdetails.pin;
            $scope.userData.gstNumber = userdetails.GSTNumber;
            $scope.userData.photographer = $.jStorage.get("photographer")._id;
            var url = "GstDetails/save";
            NavigationService.apiCallWithData(url, $scope.userData, function (data) {
                // console.log(data)
                var order = data.data._id;
                $scope.updateToFeature(order, $scope.userData.phone)
            })

        }
        $scope.gotoPayment = function () {
            // console.log("inpaymenyt")
            $scope.showStep = 3;


        }
        //console.log($scope.template);
        $scope.states = ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Pondicherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Tripura", "Uttar Pradesh", "Uttaranchal", "West Bengal"]
    })

    .controller('UsersCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("users"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Users"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.tileList = {
            "titleOne": "Featured",
            "titleTwo": "Photographers",

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
                    });
                });
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
                            //console.log("$scope.bigImageCategory.", $scope.bigImageCategory);
                        } else {
                            $scope.smallImageCategory.push(value);
                            //console.log(" $scope.smallImageCategory", $scope.smallImageCategory);
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
                );
                $scope.bigImageCategory = _.orderBy($scope.bigImageCategory, ['order'], ['asc']);
                $scope.smallImageCategory = _.orderBy($scope.smallImageCategory, ['order'], ['asc']);
                $scope.smallCat = _.chunk($scope.smallImageCategory, 2);
                // console.log(" $scope.smallCat", $scope.smallCat)
            }
        });


    })

    .controller('UserProfileCtrl', function ($scope, $rootScope, $state, TemplateService, NavigationService, $timeout, $uibModal, $stateParams, $location) {
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
        $scope.currentProfile = $stateParams.userid;
        $scope.iconChange = function () {
            $('.collapse').on('show.bs.collapse', function () {
                $('div.absolute-plus > img').attr('src', 'frontend/img/minus.png');
            });

            $('.collapse').on('hide.bs.collapse', function () {
                $('div.absolute-plus > img').attr('src', 'frontend/img/plus.png');
            });
        };


        $scope.myUrl = $location.absUrl();
        // console.log("myUrl", $scope.myUrl);

        //get single user
        formData = {};
        formData._id = $stateParams.userid;
        NavigationService.apiCallWithData("Photographer/getOne", formData, function (data) {
            // console.log("catdata", data);
            if (data.value === true) {
                // console.log(data)
                $scope.userData = data.data;
                $rootScope.tempData = $scope.userData.name;
                TemplateService.getProfileName($scope.userData.name);
                //console.log(" $scope.userData",$scope.userData.reviewList);
                $scope.showLessReviews = _.slice($scope.userData.reviewList, 0, 3);
                //console.log(" $scope.showLessReviews", $scope.showLessReviews);
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
                });
                _.forEach($scope.userData.location, function (loc) {
                    //only required the students avilable projects
                    if (_.isEmpty($scope.locString)) {
                        $scope.locString = loc;
                    } else {
                        $scope.locString = $scope.locString + ' | ' + loc;
                    }
                    // console.log("$scope.locString", $scope.locString);
                });
                $scope.priceDataa = {};
                _.forEach($scope.userData.pricing, function (pri) {
                    if (_.isEmpty($scope.priceDataa)) {
                        $scope.priceDataa = pri;
                    } else {
                        $scope.priceDataa = $scope.priceDataa + ' , ' + pri;
                    }
                });
                //get all related photographers
                formdata1 = {};
                formdata1.speciality = $scope.userData.speciality;
                NavigationService.apiCallWithData("Photographer/getRelatedPhotographers", formdata1, function (data) {
                    if (data.value === true) {
                        // console.log("getRelatedPhotographers", data);
                        $scope.relatedPhotographerData = data.data;
                        //console.log("$scope.relatedPhotographerData--", $scope.relatedPhotographerData);
                        var idToBeRemoved = $stateParams.userid;
                        $scope.relatedPhotographerData = _.remove($scope.relatedPhotographerData, function (n) {
                            return n._id != idToBeRemoved;
                        });
                        //console.log("$scope.relatedPhotographerData",$scope.relatedPhotographerData);
                    }
                });
                //get all related photographers end
            }

            $scope.lengthOfReview = $scope.userData.reviewList.length;
            //console.log("$scope.lengthOfReview", $scope.lengthOfReview);
        });
        //get single user end

        //load more reviews
        $scope.LoadMoreReview = function () {
            $scope.showLessReviews = $scope.userData.reviewList;
            //console.log("LoadMoreReview", $scope.showLessReviews);
        };
        //load more reviews end

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
            formData.review = [];
            if (!_.isEmpty($.jStorage.get("photographer"))) {
                formData.user = $.jStorage.get("photographer")._id;
                data.selfUser = false;
                formData.review.push(data);
                $scope.userData.reviewList.push(formData);
                NavigationService.apiCallWithData("Photographer/allUpdate", $scope.userData, function (data) {
                    if (data.value) {
                        // console.log(data);
                        $state.reload();
                    }
                });
            } else {

                $scope.uploadSignup();
            }
        }
        //reviews end
        if ($.jStorage.get('photographer') != null) {
            $scope.template.profile = $.jStorage.get("photographer");
        }

        //  comment part on review 
        $scope.giveComment = function (data, indx) {
            formData = {};
            data.selfUser = false;
            formData.review = $scope.userData.reviewList[indx].review;
            // console.log("$.jStorage.get(photographer)._id",$.jStorage.get("photographer")._id);
            // console.log("$scope.userData.reviewList[0].user._id",$scope.userData.reviewList[indx]);
            if (_.isEqual($.jStorage.get("photographer")._id, $scope.userData.reviewList[indx].user._id)) {
                data.selfUser = false;
            } else {
                data.selfUser = true;
            }
            formData.review.push(data);
            $scope.userData.reviewList[indx].review = formData.review;
            NavigationService.apiCallWithData("Photographer/allUpdate", $scope.userData, function (data) {
                if (data.value) {
                    // console.log(data);
                    $state.reload();
                }
            });
        }
        // comment part on review end

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
                        } else {
                            toastr.error('User already exist');
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
                    } else {
                        toastr.error('Incorrect credential');
                    }
                });
            }

        //signup modal close

        // this function is used to show Send Enquiry navigation
        // $scope.sendEnquiry = function ($event) {
        //     $scope.slide = !$scope.slide;
        // };
        $scope.rightSideNav = false; // For toggle sidenavigation
        $scope.openRightSideNav = function () {
            if (!$scope.rightSideNav) {
                $('.enquiry-side-menu').addClass('enquiry-menu-in');
                $('.enquiry-side-menu').removeClass('enquiry-menu-out');
                $scope.rightSideNav = true;
            } else {
                $('.enquiry-side-menu').addClass('enquiry-menu-out');
                $('.enquiry-side-menu').removeClass('enquiry-menu-in');
                $scope.rightSideNav = false;
            }
        };
        $scope.popup1 = {
            opened: false
        }
        $scope.openDatePicker = function () { // to open datePicker for sendEnquiry popup
            $scope.popup1.opened = true;
        };

        $scope.dateOptions = {
            minDate: new Date()
        }

        $scope.toggleMin = function () {
            // To disable previous dates from current date
            $scope.dateOptions.minDate = $scope.dateOptions.minDate ? new Date() : null;

        };
        $scope.toggleMin(); //To disable previous dates from current date


        // this function is used for data submmiting enquiry
        $scope.formEnquiry = {};
        $scope.dataSubmit = function (data, currentProfile) {
            //console.log("dataaaa", data);
            $scope.slide = !$scope.slide;
            if (!_.isEmpty(data) || data != undefined) {
                $scope.enquiryData = {};
                $scope.enquiryData.enquiryUser = $stateParams.userid;
                $scope.enquiryData.enquirerName = data.enquirerName;
                $scope.enquiryData.enquirerEmail = data.enquirerEmail;
                $scope.enquiryData.enquirercntryCode = data.enquirercntryCode;
                $scope.enquiryData.enquirerMobileNo = data.enquirerMobileNo;
                $scope.enquiryData.enquirerMsg = data.enquirerMsg;
                $scope.enquiryData.enquirerDate = data.enquirerdate;
                $scope.userData.enquiry.push($scope.enquiryData);
                //console.log("enquiryData", $scope.enquiryData);
                if (!_.isEmpty($scope.enquiryData)) {
                    NavigationService.apiCallWithData("Photographer/allUpdate", $scope.userData, function (data) {
                        if (data.value == true) {
                            //console.log(data);
                            $scope.openModal();
                            $scope.enquiryInfo = null;
                            $scope.sendEnqu(currentProfile)
                        }
                    });
                }

                data.enquirerName = "";
                data.enquirerEmail = "";
                data.enquirerMobileNo = "";
                data.enquirerName = "";
                data.enquirerMsg = "";
                data.enquirerdate = "";
                data.enquirercntryCode = "";
            }
        };
        //data submit enquiry

        //enquiry email
        $scope.sendEnqu = function (id) {
            NavigationService.sendEnquiry(id, function (data) {
                // console.log("acceptdataa", data);
                if (data.data.value) {
                    // console.log(data.data.value);
                }
            })
        };
        //enquiry email end

        // tis function is used to open an UIB modal
        $scope.openModal = function (size) {
            $scope.openEnquiryModal = $uibModal.open({
                animation: true,
                templateUrl: 'frontend/views/modal/sendEnquiry.html',
                size: 'sm',
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
        $scope.cityFill = [];

        //category image     
        formData = {};
        formData._id = $stateParams.catid;
        NavigationService.apiCallWithData("Categories/findOneCategories", formData, function (data) {
            // console.log("catdata", data);
            if (data.value === true) {
                //console.log(data)
                $scope.categoryInsideImg = data.data;
            }
        });
        //category image end

        //on document load
        // angular.element(document).ready(function () {
        //     console.log("document.getElementById", $stateParams.photoLoc.toString().trim());
        //     console.log("---------------", document.getElementById($stateParams.photoLoc.toString().trim()));
        // });
        //on document load End

        //all photographers
        $scope.loc = [];
        $scope.cityFilter = [];
        formdata = {};
        formdata.speciality = $stateParams.catName;
        formdata.location = $stateParams.photoLoc;
        $scope.checkedLoc = $stateParams.photoLoc;
        // console.log("$stateParams.photoLoc", $stateParams.photoLoc);
        // $scope.cityFill.push(formdata.location);
        NavigationService.apiCallWithData("Photographer/getPhotographersByCategories", formdata, function (data) {
            if (data.value === true) {
                // console.log("getPhotographersByCategories", data);
                $scope.photographerData = data.data;
                if (!_.isEmpty($.jStorage.get("photographer"))) {
                    var idToBeRemoved = $.jStorage.get("photographer")._id;
                    $scope.photographerData = _.remove($scope.photographerData, function (n) {
                        return n._id != idToBeRemoved;
                    });
                }
                //console.log("$scope.photographerData ", $scope.photographerData);
                _.forEach($scope.photographerData, function (spec) {
                    _.forEach(spec.location, function (spec1) {
                        //console.log("spec---", spec1);
                        if (!~$scope.cityFilter.indexOf(spec1)) {
                            $scope.cityFilter.push(spec1);
                        }
                        // document.getElementById($stateParams.photoLoc).checked = true;
                        // console.log("$scope.cityFilter", $scope.cityFilter);
                    })
                })
            }

            // filter end
            $scope.currentPage = 0;
            $scope.pageSize = 9;
            $scope.data = $scope.photographerData;
            $scope.q = '';

            $scope.getData = function () {
                return $filter('filter')($scope.data, $scope.q)
            }

            $scope.numberOfPages = function () {
                return Math.ceil($scope.getData().length / $scope.pageSize);
            }


        });

        // NavigationService.callApi("Photographer/getAllPhotographers", function (data) {
        //     if (data.value === true) {
        //         //console.log("getAllPhotographers", data);
        //         $scope.allCities = data.data;
        //         //console.log("$scope.allCities ", $scope.allCities);
        //         _.forEach($scope.allCities, function (spec) {
        //             _.forEach(spec.location, function (spec1) {
        //                 //console.log("spec---", spec1);
        //                 if (!~$scope.cityFilter.indexOf(spec1)) {
        //                     $scope.cityFilter.push(spec1);
        //                     //console.log("$scope.cityFilter---", $scope.cityFilter);

        //                 }
        //             })
        //         })
        //     }
        // });


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
                if (!_.isEmpty($.jStorage.get("photographer"))) {
                    var idToBeRemoved = $.jStorage.get("photographer")._id;
                    $scope.featrData = _.remove($scope.featrData, function (n) {
                        return n._id != idToBeRemoved;
                    });
                }
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
        // formData = {};
        // formData._id = $stateParams.catid;
        NavigationService.callApi("Categories/getAll", function (data) {
            // console.log("catdata", data);
            if (data.value === true) {
                $scope.category = data.data;
                $scope.showlessCatImages = _.slice($scope.category, 0, 4);
            }
        });
        //all categories end
        $scope.shbtn = true;
        //loadmore for categories
        $scope.LoadMoreCat = function () {
            $scope.showlessCatImages = $scope.category;
            $scope.shbtn = false;
        };

        $scope.LoadLessCat = function () {
            $scope.showlessCatImages = $scope.showlessCatImages;
            $scope.shbtn = true;
        };
        //loadmore for categories end

        $scope.checkall = false;
        $scope.toggleAll = function () {
            $scope.checkall = !$scope.checkall;
            for (var key in $scope.checkboxData) {
                $scope.checkboxData[key].value = $scope.checkall;
            }
        };


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
        $scope.priceRange = [];
        $scope.priceList = ["5k-10k", "10k-25k", "25k-50k", "50k-1lakh", "1lakh plus"];
        $scope.filterPriceAndCity = function (data) {
            var check;
            if (/\d/.test(data)) {
                $scope.priceRange.push($scope.priceList[data]);
                check = $scope.priceList[data];

            } else {
                $scope.cityFill.push(data);
                check = data;
            }
            if (document.getElementById(check).checked) {
                // $scope.price.push(priceRange);
                var formdata = {}
                formdata.pricing = $scope.priceRange;
                formdata.location = $scope.cityFill;
                NavigationService.apiCallWithData("Photographer/clickFilter", formdata, function (data) {
                    //console.log("clickFilter", data);
                    if (data.value === true) {
                        $scope.photographerData = data.data;
                        if (!_.isEmpty($.jStorage.get("photographer"))) {
                            var idToBeRemove = $.jStorage.get("photographer")._id;
                            $scope.photographerData = _.remove($scope.photographerData, function (n) {
                                return n._id != idToBeRemove;
                            });
                        }
                    }
                    $scope.currentPage = 0;
                    $scope.pageSize = 9;
                    $scope.data = $scope.photographerData;
                    $scope.q = '';

                    $scope.getData = function () {
                        return $filter('filter')($scope.data, $scope.q)
                    }

                    $scope.numberOfPages = function () {
                        return Math.ceil($scope.getData().length / $scope.pageSize);
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
                // console.log(" $scope.cityFill------------", $scope.cityFill);
                //console.log("$scope.priceRange", $scope.priceRange);
                // $scope.price.push(priceRange);
                if (!_.isEmpty($scope.priceRange) || !_.isEmpty($scope.cityFill)) {
                    var formdata1 = {}
                    formdata1.pricing = $scope.priceRange;
                    formdata1.location = $scope.cityFill;
                    NavigationService.apiCallWithData("Photographer/clickFilter", formdata1, function (data) {
                        //console.log("clickFilter", data);
                        if (data.value === true) {
                            $scope.photographerData = data.data;
                            if (!_.isEmpty($.jStorage.get("photographer"))) {
                                var idToBeRemove = $.jStorage.get("photographer")._id;
                                $scope.photographerData = _.remove($scope.photographerData, function (n) {
                                    return n._id != idToBeRemove;
                                });
                            }
                        }
                        $scope.currentPage = 0;
                        $scope.pageSize = 9;
                        $scope.data = $scope.photographerData;
                        $scope.q = '';

                        $scope.getData = function () {
                            return $filter('filter')($scope.data, $scope.q)
                        }

                        $scope.numberOfPages = function () {
                            return Math.ceil($scope.getData().length / $scope.pageSize);
                        }
                    });
                } else {
                    //all photographers
                    var formdata2 = {};
                    formdata2.speciality = $stateParams.catName;
                    NavigationService.apiCallWithData("Photographer/getPhotographersByCategories", formdata2, function (data) {
                        if (data.value === true) {
                            //console.log("getPhotographersByCategories", data);
                            $scope.photographerData = data.data;
                            if (!_.isEmpty($.jStorage.get("photographer"))) {
                                var idToBeRemove = $.jStorage.get("photographer")._id;
                                $scope.photographerData = _.remove($scope.photographerData, function (n) {
                                    return n._id != idToBeRemove;
                                });
                            }
                            $scope.currentPage = 0;
                            $scope.pageSize = 9;
                            $scope.data = $scope.photographerData;
                            $scope.q = '';

                            $scope.getData = function () {
                                return $filter('filter')($scope.data, $scope.q)
                            }

                            $scope.numberOfPages = function () {
                                return Math.ceil($scope.getData().length / $scope.pageSize);
                            }
                        }
                    });
                    //all Photographers end
                }
            }
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
    })

    .controller('headerctrl', function ($scope, TemplateService, $uibModal, $location, $window, NavigationService, $state, $rootScope, toastr, AddToCartSerivce) {

        $scope.template = TemplateService;
        $scope.registerData = {};

        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $(window).scrollTop(0);
        });
        $.fancybox.close(true);


        $scope.sideNav = false; // For toggle sidenavigation
        $scope.openSideNav = function () { // For opening the leftside navigation

            if (!$scope.sideNav) {
                // $('div.icon_float').children().removeClass(function (index, className) {
                //     return (className.match(/\bicon_\S+/g) || []).join(' ');
                // });

                // $('div.icon_float').addClass('hamburger-cross');
                // // $('div.icon_float > span.icon-bar').css({
                // //     'height': '3px',
                // //     'background-color': '#f4511e',
                // //     'width': '36px'
                // // });
                $('#nav-icon').toggleClass('open');

                $('.side-menu').addClass('menu-in');
                $('.side-menu').removeClass('menu-out');
                $('.main-overlay').css('opacity', '1');
                //  $('.navbar-toggle').attr('ng-click', 'test1()');
                $scope.sideNav = true;
            } else {
                // if ($('div.icon_float').hasClass('hamburger-cross')) {
                //     $('div.icon_float').children().addClass(function (n) {
                //         $('div.icon_float').removeClass('hamburger-cross');
                //         $('div.icon_float > span.icon-bar').removeAttr('style');
                //         $('section .mg_lft').css('margin-left', '0');
                //         $('#sidenav-overlay').css('display', 'none');
                //         $('body').css('overflow-y', 'scroll');
                //         return 'icon_bar' + n;

                //     });
                // }
                $('#nav-icon').toggleClass('open');
                $('.side-menu').addClass('menu-out');
                $('.side-menu').removeClass('menu-in');
                $('.main-overlay').css('opacity', '0');
                $scope.sideNav = false;
            }
        };
        $scope.closeSideNav = function () {
            $('.side-menu').removeClass('menu-in');
            $('.side-menu').addClass('menu-out');
        };

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

            // console.log("login");
            $scope.signupModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/login.html",
                scope: $scope,
                windowClass: '',
                backdropClass: 'black-drop'
            });
        };

        $scope.signUp = function () {
                $state.go('photographer');
            },

            //verify and send mail for signup password

            $scope.showOtpBox = false;
        $scope.showSucessBox = false;
        $scope.verifyAndSendSignUpEmail = function (formdata, terms) {
            if (!terms) {
                // alert('check box error');
                $('.condition-box p.alert-text').text('Please check the terms & condition checkbox').css('text-indent', '32px');
            } else {
                if (formdata.name && formdata.email && formdata.password && formdata.ConfirmPassword) {
                    if (_.isEqual(formdata.password, formdata.ConfirmPassword)) {
                        $scope.registerData = formdata;
                        NavigationService.apiCallWithData("Photographer/checkPhotographersForOtp", formdata, function (data) {
                            // console.log("dataForOtp", data);
                            if (data.data.verifyAcc == false) {
                                $scope.signUpOTP();
                                setTimeout(function (data) {
                                    $scope.signUpOTP.close();
                                }, 600000);
                            } else {
                                toastr.error('User already exist');
                            }
                        });
                    } else {
                        toastr.error('Check password');
                    }
                } else {
                    toastr.error('Please enter all details');
                }
            }
        };

        $scope.checkOTPForSignUp = function (formdata) {
            $scope.registerData.otp = formdata.otp;
            //console.log("$scope.registerData", $scope.registerData);
            NavigationService.apiCallWithData("Photographer/verifyOTP", $scope.registerData, function (data) {
                //console.log("dataForOtp", data);
                if (data.value == true) {
                    $.jStorage.set("photographer", data.data);
                    $scope.showSucessBox = true;
                } else {
                    toastr.error('Incorrect OTP!');
                }
            });
        }
        //verify and send mail for signup password


        //sign up otp verification modal
        $scope.signUpOTP = function () {
            $scope.signUpOTP = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/signup-otp.html",
                scope: $scope,
                windowClass: '',
                backdropClass: 'black-drop'
            });
            $scope.closeModal = function () { // to close modals for ALL OTP
                $scope.signUpOTP.close();
            };
        };
        //sign up otp verification modal end

        $scope.subscribe = function (formdata) {
                //console.log("formdatafsgdvtrhejy", formdata);
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
                        setTimeout(function (data) {
                            $scope.subscribeModal.close();
                            formdata.email = "";
                        }, 3000);
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
                    } else {
                        toastr.error('Incorrect credential');
                    }
                });
            }

        if ($.jStorage.get("photographer")) {
            $scope.template.profile = $.jStorage.get("photographer");
        }

        $scope.logout = function () {
            $.jStorage.flush();
            $scope.template.profile = null;
            if ($state.current.name == 'home') {
                $state.reload();
            } else {
                $state.go("home");
            }
        }

        // Forgot password modal
        $scope.changePwd = function () {
            $scope.pwdModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/forgotpass.html",
                scope: $scope,
                // windowClass: 'modalWidth',
                backdropClass: 'black-drop'
            });
            $scope.closeModal = function () { // to close modals for ALL OTP
                $scope.pwdModal.close();
            };
        };
        //End of forgot password modal

        //verify and send mail for forgot password
        $scope.displayCnfirmBox = false;
        $scope.displayotpBox = false;
        $scope.displayThanksBox = false;
        $scope.verifyAndSendEmail = function (formdata) {
            $scope.displayotpBox = true;
            NavigationService.apiCallWithData("Photographer/sendOtp", formdata, function (data) {
                // console.log("dataForOtp", data);
                if (data.value) {
                    $scope.id = data.data._id;
                }
            });
        };

        $scope.checkOTP = function (otp) {
            NavigationService.apiCallWithData("Photographer/verifyOTPForResetPass", otp, function (data) {
                if (data.value == true) {
                    $scope.displayCnfirmBox = true;
                    $scope.displayotpBox = false;
                } else {
                    toastr.error('Incorrect OTP!');
                }
            });
        }

        $scope.resetPass = function (formdata) {
            if (_.isEqual(formdata.password, formdata.ConfirmPassword)) {
                formdata._id = $scope.id;
                // console.log("doneFormData", formdata);
                NavigationService.apiCallWithData("Photographer/updatePass", formdata, function (data) {
                    // console.log("doneFormDatadata", data);
                    if (data.value) {
                        $scope.displayCnfirmBox = false;
                        $scope.displayotpBox = false;
                        $scope.displayThanksBox = true;
                    }
                });
            } else {
                toastr.error('Check password');
            }
        };
        //verify and send mail for forgot password end

        //searchFilter 
        $scope.cityFilterForSearch = [];
        NavigationService.callApi("Photographer/findPhotographerCities", function (data) {
            if (data.value === true) {
                //console.log("findPhotographerCities", data);
                $scope.photographerData = data.data;
                //console.log("$scope.photographerData ", $scope.photographerData);
                _.forEach($scope.photographerData, function (spec) {
                    _.forEach(spec.location, function (spec1) {
                        //console.log("spec---", spec1);
                        if (!~$scope.cityFilterForSearch.indexOf(spec1)) {
                            $scope.cityFilterForSearch.push(spec1);
                        }
                        //console.log("$scope.cityFilterForSearch", $scope.cityFilterForSearch);
                    })
                })
            }
        });

        $scope.catSearchBar = [];
        NavigationService.callApi("Categories/getAll", function (data) {
            if (data.value === true) {
                //console.log(data)
                $scope.category = data.data;
                _.forEach($scope.category, function (value) {
                    $scope.catSearchBar.push(value);
                    //console.log("Cat-data", $scope.catSearchBar);
                });
            }
        });


        $scope.filterToBeApplied = {};
        $scope.addFilterValue = function (val, type) {
            // console.log("val-------", val);
            if (_.isEqual(type, "category")) {
                $scope.filterToBeApplied.category = val._id;
                $scope.filterToBeApplied.catName = val.name;
            } else {
                $scope.filterToBeApplied.city = val;

            }
            //  console.log("$scope.filterToBeApplied ", $scope.filterToBeApplied);
        }


        $scope.searchBarGo = function () {
            // console.log("formadata", $scope.filterToBeApplied);
            if (!_.isEmpty($scope.filterToBeApplied.category) && !_.isEmpty($scope.filterToBeApplied.catName) && !_.isEmpty($scope.filterToBeApplied.city)) {
                formdata = {};
                formdata.location = $scope.filterToBeApplied.city;
                NavigationService.apiCallWithData("Photographer/getPhotographersByCategories", formdata, function (data) {
                    //console.log("getPhotographersByCategories", data);
                    if (data.value === true) {
                        $scope.photographerData = data.data;
                        $state.go("wild-photographer", {
                            catid: $scope.filterToBeApplied.category,
                            catName: $scope.filterToBeApplied.catName,
                            photoLoc: $scope.filterToBeApplied.city,
                        })
                    }
                });
            }
        }
        //searchFilter end

        //verify and send mail for forgot password

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

        //To fetch the list of all country
        NavigationService.getAllCountryCode(function (data) {
            $scope.countryListData = data;
        })
        $scope.selectedCountry = $scope.countryListData;

        // It will give the particular country on selection
        $scope.selectCountry = function (item, model) {
            var selectedCountryName = model.name; // it will give the country name 
            var selectedCountryCode = model.callingCodes; // it will give the country  code 
            //  console.log("model", selectedCountryName);
        };
        // To update the amount if a user adds a photograph in the cart
        $rootScope.cartLength = AddToCartSerivce.getCart();
    })

    .controller('languageCtrl', function ($scope, TemplateService, $translate, $rootScope) {

        $scope.changeLanguage = function () {
            // console.log("Language CLicked");
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
        $scope.menutitle = NavigationService.makeactive("Privacy Policy"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

    })

    .controller('termsCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("terms"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Terms & Conditions"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

    })

    .controller('contactUsCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("contact-us"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Contact Us"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.initMap = function () {
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: 12.975916,
                    lng: 77.678441
                },
                scrollwheel: false,
                zoom: 10,
                styles: [{
                    "featureType": "landscape",
                    "stylers": [{
                        "color": "white"
                    }]
                }, {
                    "featureType": "poi.park",
                    "stylers": [{
                        "color": "white"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "color": "white"
                    }, {
                        "visibility": "simplified"
                    }]
                }, {
                    "featureType": "poi",
                    "elementType": "labels.icon",
                    "stylers": [{
                        "color": "#f0c514"
                    }, {
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "poi",
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                        "color": "#f16366"
                    }, {
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#f16366"
                    }, {
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#f16366"
                    }]
                }, {
                    "featureType": "administrative",
                    "elementType": "labels",
                    "stylers": [{
                        "visibility": "simplified"
                    }, {
                        "color": "#e84c3c"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "color": "white"
                    }, {
                        "visibility": "off"
                    }]
                }]
            });
            var marker = new google.maps.Marker({
                position: {
                    lat: 12.975916,
                    lng: 77.678441
                },
                title: "Clickmania",
                // icon: "http://gsourcedata.com/img/landing-logo.png/",
                map: map

            });
        };
        // google.maps.event.addDomListener(window, 'load', initMap);
        // initMap();

    })

    .controller('competitionCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("competition"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Photo-Contest"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        NavigationService.retriveContestResult(function (data) {

            $scope.contest = data.data.data;
            $scope.currentContest = _.find($scope.contest, {
                status: "true"
            });
            $scope.prizes = $scope.currentContest.winingPrice.split(",");

            $scope.previousContest = _.find($scope.contest, {
                status: "false"
            });

            // console.log("participent", $scope.previousContest.contestParticipant)
            // console.log($scope.previousContest.winner)
            // $scope.previousContestWinner = _.find($scope.previousContest.contestParticipant, {
            //     "photographerId._id": $scope.previousContest.winner,
            // });

            if (!_.isEmpty($scope.previousContest)) {
                $scope.previousContestWinner = _.find($scope.previousContest.contestParticipant, function (o) {
                    return o._id == $scope.previousContest.winner;
                });

            }
        })


    })

    .controller('photoContestCtrl', function ($stateParams, $scope, toastr, TemplateService, NavigationService, $timeout, $uibModal, $rootScope, $state) {
        $scope.template = TemplateService.changecontent("photo-contest"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Photo-Contest"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        NavigationService.callApi("PayAmount/getAll", function (data) {
            $scope.amount = data.data;
        });
        $.jStorage.deleteKey("contestImage");
        if ($.jStorage.get('photographer')) {
            var formdata = {
                _id: $.jStorage.get('photographer')._id
            }
            NavigationService.callApi("PayAmount/getAll", function (data) {

                $scope.ThreePhotos = data.data[3].amount;
                $scope.sixPhotos = data.data[4].amount;

            });
            NavigationService.apiCallWithData("Photographer/getOne", formdata, function (data) {
                // console.log(data);
                $.jStorage.set('photographer', data.data)
                if (!_.isEmpty($.jStorage.get('photographer').contest)) {
                    //bring data for contest for particularuser
                    var input = {
                        photographerId: $.jStorage.get('photographer')._id,
                    }
                    $scope.photoContestPackage = $.jStorage.get('photographer').photoContestPackage;
                    NavigationService.apiCallWithData("PhotoContest/findAllPhotographersInContest", input, function (data) {
                        // console.log("contestdata", data.data);
                        // console.log($stateParams.catid)
                        $scope.photographerContestData = data.data;
                        $scope.result = _.find($scope.photographerContestData, function (o) {
                            return o._id == $stateParams.photoContestId;
                        });
                        // console.log("result", $scope.result);
                    })
                }
                if ($.jStorage.get("photographer")) {
                    if ($.jStorage.get("photographer").photoContestPackage == "PackageUpdateForThree") {
                        var packages = [0, 1, 2];
                    } else if ($.jStorage.get("photographer").photoContestPackage == "PackageUpdateForSix") {
                        var packages = [0, 1, 2, 3, 4, 5];
                    } else if ($.jStorage.get("photographer").photoContestPackage == "PackageUpdateForNine") {
                        var packages = [0, 1, 2, 3, 4, 5, 6, 7, 8];
                    }
                    $scope.packageChunk = _.chunk(packages, 3);
                }
            })
        }


        $scope.uploadContestPhotos = function () {
            // var contestInput = {
            //     _id: $.jStorage.get("photographer")._id,
            //     contestId: [$stateParams.photoContestId]
            // }
            // NavigationService.apiCallWithData('Photographer/addcontestParticipant', contestInput, function (contestOutput) {

            //     if (contestOutput.value) {
            //         toastr.success("Participated Successfully", "Successful");
            //         $state.go("photographer");
            //     } else {
            //         toastr.error("There was some error in uploading your photos", "error");
            //     }
            //     $state.go("photographer");
            // })
            state.go();
        }



        $scope.uploadImage = function (imagesData) {
            var input = {
                _id: $stateParams.photoContestId,
                id: $.jStorage.get("photographer")._id,
                photos: [imagesData.image]
            }
            NavigationService.uploadContestPhotos(input, function (data) {
                var input = {
                    photographerId: $.jStorage.get('photographer')._id,
                }
                NavigationService.apiCallWithData("PhotoContest/findAllPhotographersInContest", input, function (data) {
                    // console.log("contestdata", data.data);
                    // console.log($stateParams.catid)
                    $scope.photographerContestData = data.data;
                    $scope.result = _.find($scope.photographerContestData, function (o) {
                        return o._id == $stateParams.photoContestId;
                    });
                    // console.log("result", $scope.result);
                    $scope.imgModal.close();
                    toastr.success("image uploaded successfully");
                })
            })
        }


        if ($.jStorage.get("photographer")) {
            $scope.isLoggedIn = $.jStorage.get("photographer");
        } else {
            $scope.isLoggedIn = null;
        }



        // $rootScope.showStep="";
        $scope.activeTab = 1;
        $scope.toggleTab = function (val) {
            $scope.activeTab = val;
        };
        $scope.steps = false;
        if ($.jStorage.get("photographer")) {
            $scope.steps = true;
            $scope.step = "2";
        } else {
            $scope.steps = false;
            $scope.step = "1";
        }
        // console.log("step",$scope.step)
        $scope.signUp = function () {
                $rootScope.showStep = 2;
                $state.reload();
            },

            //verify and send mail for signup password

            $scope.showOtpBox = false;
        $scope.showSucessBox = false;
        $scope.verifyAndSendSignUpEmail = function (formdata, terms) {
            if (!terms) {
                // alert('check box error');
                $('.condition-box p.alert-text').text('Please check the terms & condition checkbox').css('text-indent', '32px');
            } else {
                if (formdata.name && formdata.email && formdata.password && formdata.ConfirmPassword) {
                    if (_.isEqual(formdata.password, formdata.ConfirmPassword)) {
                        $scope.registerData = formdata;
                        NavigationService.apiCallWithData("Photographer/checkPhotographersForOtp", formdata, function (data) {
                            //console.log("dataForOtp", data);
                            if (data.data.verifyAcc == false) {
                                //console.log(data.data);
                                $scope.signUpOTP();
                                setTimeout(function (data) {
                                    $scope.signUpOTP.close();
                                }, 600000);
                            } else {
                                toastr.error('User already exist');
                            }
                        });
                    } else {
                        toastr.error('Check password');
                    }
                } else {
                    toastr.error('Please enter all details');
                }

            }
        };

        $scope.checkOTPForSignUp = function (formdata) {
            $scope.registerData.otp = formdata.otp;
            NavigationService.apiCallWithData("Photographer/verifyOTP", $scope.registerData, function (data) {
                //console.log("dataForOtp", data);
                if (data.value == true) {
                    // console.log("email OTP verified");
                    $.jStorage.set("photographer", data.data);
                    $scope.showSucessBox = true;
                } else {
                    alert("Incorrect OTP!");
                }
            });
        }
        //verify and send mail for signup password


        //sign up otp verification modal
        $scope.signUpOTP = function () {
            $scope.signUpOTP = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/signup-otp.html",
                scope: $scope,
                windowClass: '',
                backdropClass: 'black-drop'
            });
            $scope.closeModal = function () { // to close modals for ALL OTP
                $scope.signUpOTP.close();
            };
        };
        //sign up otp verification modal end

        //sign up functtionallity end


        $scope.logincontest = function (formdata) {
            // formdata.serviceRequest = $scope.serviceList;
            // console.log(formdata);
            NavigationService.checkLogin(formdata, function (data) {
                if (data.data.value) {
                    //console.log(data.data.data);
                    $rootScope.showStep = 2;
                    $.jStorage.set("photographer", data.data.data);
                    $scope.template.profile = data.data.data;
                    // $state.go("photographer");
                    $state.reload();
                    // console.log("im in");
                } else {
                    toastr.error('Incorrect credential');
                }
            });
        }


        //reset password Funct

        // Forgot password modal
        $scope.changePwd = function () {
            $scope.pwdModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/forgotpass.html",
                scope: $scope,
                // windowClass: 'modalWidth',
                backdropClass: 'black-drop'
            });
            $scope.closeModal = function () { // to close modals for ALL OTP
                $scope.pwdModal.close();
            };
        };
        //End of forgot password modal

        //verify and send mail for forgot password
        $scope.displayCnfirmBox = false;
        $scope.displayotpBox = false;
        $scope.displayThanksBox = false;
        $scope.verifyAndSendEmail = function (formdata) {
            $scope.displayotpBox = true;
            NavigationService.apiCallWithData("Photographer/sendOtp", formdata, function (data) {
                if (data.value) {
                    $scope.id = data.data._id;
                }
            });
        };

        $scope.checkOTP = function (otp) {
            NavigationService.apiCallWithData("Photographer/verifyOTPForResetPass", otp, function (data) {
                //console.log("dataForOtp", data.data);
                if (data.value == true) {
                    $scope.displayCnfirmBox = true;
                    $scope.displayotpBox = false;
                } else {
                    toastr.error('Incorrect OTP!');
                }
            });
        }

        $scope.resetPass = function (formdata) {
            if (_.isEqual(formdata.password, formdata.ConfirmPassword)) {
                formdata._id = $scope.id;
                NavigationService.apiCallWithData("Photographer/updatePass", formdata, function (data) {
                    if (data.value) {
                        $scope.displayCnfirmBox = false;
                        $scope.displayotpBox = false;
                        $scope.displayThanksBox = true;
                    }
                });
            } else {
                toastr.error('Check password');
            }
        };
        //verify and send mail for forgot password end
        //reset password funct end

        //PAYMENT

        // console.log("Stateparam----------", $stateParams.photoContestId);
        $scope.PackageUpdateForThree = function (order, phone) {
            formdata = {};
            formdata.photographer = $.jStorage.get("photographer")._id;
            formdata.payAmount = $scope.amount[3]._id;
            formdata.amount = $scope.amount[3].amount;
            formdata.email = $.jStorage.get("photographer").email;
            formdata.phone = phone;
            formdata.return_url = adminurl + "PhotoContest/paymentGatewayResponce";
            formdata.name = $.jStorage.get("photographer").name;
            formdata.type = "PackageUpdateForThree/" + $.jStorage.get("photographer")._id + "/" + $stateParams.photoContestId + "/" + $scope.amount[0].amount + "/" + order;
            // console.log(formdata);
            NavigationService.apiCallWithData("PhotoContest/checkoutPayment", formdata, function (data) {
                // console.log("--------------------------------------", data);
                window.location.href = adminurl + "PhotoContest/sendToPaymentGateway?id=" + data.data._id;
            });
        };

        $scope.PackageUpdateForSix = function (order, phone) {

            formdata = {};
            formdata.photographer = $.jStorage.get("photographer")._id;
            formdata.payAmount = $scope.amount[4]._id;
            formdata.amount = $scope.amount[4].amount;
            formdata.email = $.jStorage.get("photographer").email;
            formdata.phone = phone;
            formdata.return_url = adminurl + "PhotoContest/paymentGatewayResponce";
            formdata.name = $.jStorage.get("photographer").name;
            formdata.type = "PackageUpdateForSix/" + $.jStorage.get("photographer")._id + "/" + $stateParams.photoContestId + "/" + $scope.amount[0].amount + "/" + order;
            // console.log(formdata);
            NavigationService.apiCallWithData("PhotoContest/checkoutPayment", formdata, function (data) {
                // console.log(data);
                window.location.href = adminurl + "PhotoContest/sendToPaymentGateway?id=" + data.data._id;
            });
        };


        // $scope.PackageUpdateForNine = function () {

        //     formdata = {};
        //     formdata.photographer = $.jStorage.get("photographer")._id;
        //     formdata.payAmount = $scope.amount[5]._id;
        //     formdata.amount = $scope.amount[5].amount;
        //     formdata.email = $.jStorage.get("photographer").email;
        //     formdata.return_url = adminurl + "PhotoContest/paymentGatewayResponce";
        //     formdata.name = $.jStorage.get("photographer").name;
        //     formdata.type = "PackageUpdateForNine/" + $.jStorage.get("photographer")._id + "/" + $stateParams.photoContestId;
        //     console.log(formdata);
        //     NavigationService.apiCallWithData("PhotoContest/checkoutPayment", formdata, function (data) {
        //         console.log(data);
        //         window.location.href = adminurl + "PhotoContest/sendToPaymentGateway?id=" + data.data._id;
        //     });
        // };

        //PAYMENT End
        $scope.states = ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Pondicherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Tripura", "Uttar Pradesh", "Uttaranchal", "West Bengal"];
        $scope.showNext = function (nos) {
            $scope.numberOfSlot = nos;
            $scope.step = 3
        }
        $scope.gstPayment = function (userdetails) {
            // console.log("userdetails", userdetails);
            // console.log($scope.numberOfSlot);
            $scope.userData = {};
            $scope.userData.firstName = userdetails.fname;
            $scope.userData.lastName = userdetails.lname;
            $scope.userData.address = userdetails.address;
            $scope.userData.phone = userdetails.phone;
            $scope.userData.state = userdetails.state;
            $scope.userData.city = userdetails.city;
            $scope.userData.pincode = userdetails.pin;
            $scope.userData.gstNumber = userdetails.GSTNumber;
            $scope.userData.photographer = $.jStorage.get("photographer")._id;
            var url = "GstDetails/save";
            NavigationService.apiCallWithData(url, $scope.userData, function (data) {
                // console.log(data)
                var order = data.data._id;
                if ($scope.numberOfSlot == 3) {
                    $scope.PackageUpdateForThree(order, $scope.userData.phone)
                } else if ($scope.numberOfSlot == 6) {
                    $scope.PackageUpdateForSix(order, $scope.userData.phone);
                } else {
                    $scope.step = 2;
                }
            })

        }
    })

    .controller('thanksCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams) {

        $scope.template = TemplateService.changecontent("thanks"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Thank-You"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.msg = "";
        formData = {};
        formData._id = $stateParams.id;
        NavigationService.apiCallWithData("Order/getOne", formData, function (data) {
            $scope.amountFbq = data.data.amount;
            fbq('track', 'Purchase', {
                currency: 'INR',
                value: data.data.amount
            });
            if (data.value === true) {
                if (data.data.description.split('/')[0] == "featured") {
                    $scope.msg = "You are now registered as a Featured Photographer for the month of " + data
                        .data.photographer.month;
                    formData = {};
                    formData._id = $.jStorage.get("photographer")._id;
                    NavigationService.apiCallWithData("Photographer/getOne", formData, function (data) {
                        // console.log("data update", data)
                        if (data.value === true) {
                            $.jStorage.set("photographer", data.data);
                        }
                    });
                } else if (data.data.description.split('/')[0] == "PackageUpdateForThree") {
                    $scope.msg = "Thank you! You can start uploading your photos now!";
                    formData = {};
                    formData._id = $.jStorage.get("photographer")._id;
                    NavigationService.apiCallWithData("Photographer/getOne", formData, function (data) {
                        // console.log("data update", data)
                        if (data.value === true) {
                            $.jStorage.set("photographer", data.data);
                        }
                    });

                } else if (data.data.description.split('/')[0] == "PackageUpdateForSix") {
                    $scope.msg = "Thank you! You can start uploading your photos now!";
                    formData = {};
                    formData._id = $.jStorage.get("photographer")._id;
                    NavigationService.apiCallWithData("Photographer/getOne", formData, function (data) {
                        // console.log("data update", data)
                        if (data.value === true) {
                            $.jStorage.set("photographer", data.data);
                        }
                    });

                } else if (data.data.description.split('/')[0] == "PackageUpdateForNine") {
                    $scope.msg = "Thank you! You can start uploading your photos now!";
                    formData = {};
                    formData._id = $.jStorage.get("photographer")._id;
                    NavigationService.apiCallWithData("Photographer/getOne", formData, function (data) {
                        // console.log("data update", data)
                        if (data.value === true) {
                            $.jStorage.set("photographer", data.data);
                        }
                    });

                } else {
                    $scope.msg = "You have now been upgraded to a " + data.data.description.split('/')[0] + " Member.";
                    formData = {};
                    formData._id = $.jStorage.get("photographer")._id;
                    NavigationService.apiCallWithData("Photographer/getOne", formData, function (data) {
                        // console.log("data update", data)
                        if (data.value === true) {
                            $.jStorage.set("photographer", data.data);
                        }
                    });
                }
            }
        });
    })

    .controller('thanksGoldCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("thanks-gold"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Thank-You"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

    })

    .controller('BillPayGst', function ($scope, $stateParams, $state, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("billpaygst"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Bill Payment"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.states = ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Pondicherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Tripura", "Uttar Pradesh", "Uttaranchal", "West Bengal"];
        $scope.view = $stateParams.view;
        // console.log($scope.view);

        NavigationService.callApi("PayAmount/getAll", function (data) {
            $scope.amount = data.data;
            // console.log("PAy amount: ", $scope.amount);
        });
        var photographer = $.jStorage.get("photographer")
        // console.log("photographer", photographer);

        //goldpackgeupdateDynamic

        if ($.jStorage.get("photographer")) {
            if ($.jStorage.get("photographer").package == "Silver") {
                formdata = {};
                formdata._id = $.jStorage.get("photographer")._id;
                NavigationService.apiCallWithData("Photographer/findTotalPriceOfGold", formdata, function (data) {
                    if (data.value === true) {
                        $scope.dyGoldAmount = data.data;
                        // console.log("$scope.dyGoldAmount++++++++++++++++++", $scope.dyGoldAmount);
                    }
                });
            }
        }

        //goldpackgeupdateDynamic end

        $scope.goldMember = function (order, phone) {

            formdata = {};

            formdata.photographer = $.jStorage.get("photographer")._id;
            if (photographer.package == "Silver") {
                formdata.payAmount = null;
                formdata.amount = $scope.dyGoldAmount;
                formdata.phone = phone;
                // console.log("if")
            } else {
                formdata.payAmount = $scope.amount[1]._id;
                formdata.amount = $scope.amount[1].amount;
                // console.log("else")
            }
            formdata.email = $.jStorage.get("photographer").email;
            formdata.return_url = adminurl + "Photographer/paymentGatewayResponce";
            formdata.name = $.jStorage.get("photographer").name;
            formdata.type = "Gold/" + $.jStorage.get("photographer")._id + "/" + formdata.amount + "/" + order;
            // console.log(formdata);
            NavigationService.apiCallWithData("Photographer/checkoutPayment", formdata, function (data) {
                // console.log("resp data", data);
                formdata = {};
                formdata._id = $.jStorage.get("photographer")._id;
                NavigationService.apiCallWithData("Photographer/getOne", formdata, function (data) {
                    // console.log(data)
                    $.jStorage.set("photographer", data.data);
                })
                window.location.href = adminurl + "photographer/sendToPaymentGateway?id=" + data.data._id;
            });


        };

        $scope.silverMember = function (order, phone) {
            formdata = {};
            // ABS PAYMENT GATEWAY
            formdata.photographer = $.jStorage.get("photographer")._id;
            formdata.payAmount = $scope.amount[0]._id;
            formdata.amount = $scope.amount[0].amount;
            formdata.email = $.jStorage.get("photographer").email;
            formdata.phone = phone;
            formdata.return_url = adminurl + "Photographer/paymentGatewayResponce";
            formdata.name = $.jStorage.get("photographer").name;
            formdata.type = "Silver/" + $.jStorage.get("photographer")._id + "/" + $scope.amount[0].amount + "/" + order;
            // console.log(formdata);
            NavigationService.apiCallWithData("Photographer/checkoutPayment", formdata, function (data) {
                // console.log(data);
                formdata = {};
                formdata._id = $.jStorage.get("photographer")._id;
                NavigationService.apiCallWithData("Photographer/getOne", formdata, function (data) {
                    // console.log(data)
                    $.jStorage.set("photographer", data.data);
                })
                window.location.href = adminurl + "photographer/sendToPaymentGateway?id=" + data.data._id;
            });
        };

        $scope.gstPayment = function (userdetails) {
            // console.log("userdetails", userdetails.fname);
            // console.log($scope.numberOfSlot);
            $scope.userData = {};
            $scope.userData.firstName = userdetails.fname;
            $scope.userData.lastName = userdetails.lname;
            $scope.userData.address = userdetails.address;
            $scope.userData.phone = userdetails.phone
            $scope.userData.state = userdetails.state;
            $scope.userData.city = userdetails.city;
            $scope.userData.pincode = userdetails.pin;
            $scope.userData.gstNumber = userdetails.GSTNumber;
            $scope.userData.photographer = $.jStorage.get("photographer")._id;
            var url = "GstDetails/save";
            // console.log($scope.userData)
            NavigationService.apiCallWithData(url, $scope.userData, function (data) {
                // console.log(data)
                var order = data.data._id;
                if ($scope.view == "silver") {
                    $scope.silverMember(order, $scope.userData.phone);

                } else if ($scope.view == "gold") {
                    $scope.goldMember(order, $scope.userData.phone);
                } else {
                    $state.go("photographer");
                }

            })

        }
    })

    .controller('thanksSilverCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("thanks-silver"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Thank-You"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

    })

    .controller('ThanksContestCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("thanks-contest"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Thank-You"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        formdata = {};
        formdata._id = $.jStorage.get("photographer")._id;
        NavigationService.apiCallWithData("Photographer/getOne", formdata, function (data) {
            // console.log(data)
            $.jStorage.set("photographer", data.data);
        })

    })

    .controller('errorCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("error"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Error"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

    })

    .controller('becomeFpCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("becomefp"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Featured Photographer"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.name = $.jStorage.get("photographer").name;
        $scope.month = $.jStorage.get("photographer").month;
    })

    .controller('ArtistCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("artist-of-the-month"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Artist"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.boxes = [{
                "Question": "Hi Anurita, tell us something about yourself.",
                "Answer": "Hello!! I was born and brought up in Bangalore. After my education in Bishop Cotton School and CMS Jain college, I took up a job in the PR department of a corporate, but soon realized it was not my calling. That’s when I decided to follow my heart and become a makeup artist."
            },
            {
                "Question": "So, how did the switch happen?",
                "Answer": "Actually, It was the mother of my best friend who put the thought in my mind. I used to visit my friend’s place pretty often and being girls we used to doll up for parties or going out somewhere. My friend’s mom noticed my knack for makeup and she suggested me to walk the path."
            },
            {
                "Question": "Quite interesting.",
                "Answer": "Yes. Then I gave up my job and went to Dubai for an 8 week make up course by IMA, London. During the course, I learned a lot. The first half of the day was when our teachers taught us about various aspect of makeup. During the second half we got a chance to practice live."
            },
            {
                "Question": "And how did it change things?",
                "Answer": "Well, everything. I came back to Bangalore and became a professional makeup artist. One by one I started to get work. Word of mouth spread fast and the social media also played a vital role. That’s how I am where I am today. But there is still a long way to go."
            },
            {
                "Question": "And what does the future hold? ",
                "Answer": "I still want to gain more experience and eventually when the time is right, I want to start my own makeup academy in Bangalore."
            },
            {
                "Question": "Coming back to the topic of Bangalore, how do you see the city then and now?",
                "Answer": "The city has changed beyond imagination. It was a green, quiet and relaxed city back in the days. All that has changed now. But I still love my city for what it is and the opportunities it provides to everyone."
            },
            {
                "Question": "What kind of makeup you enjoy doing the most?",
                "Answer": "I enjoy doing makeup for catalogues and all other types, but nothing can match the satisfaction of doing a bridal makeup. I normally do a dry run a day prior to the big day. Yet, when the big days comes, the smile and the glow in the bride’s face is the biggest satisfaction that I can get as a makeup artist."
            },
            {
                "Question": "Anurita, you are quite photogenic yourself. Have you ever thought about being in front of the camera?",
                "Answer": "No no, I am not very comfortable in front of the camera. That is my sister’s forte. She is an actress in the Kannada television industry. Her name is Ashita Chandrappa."
            },
            {
                "Question": "What about your love for dogs?",
                "Answer": "I cannot imagine my life without a pet dog. I have had a dog since I was 4 years old. Currently I have Django. He is a 4 year old beagle and he is the love of my life."
            },
            {
                "Question": "How was your experience of working with clickmania ?",
                "Answer": "It was a very nice experience. The team was very cool and non-interfering. Once I was given the brief, it was entirely left to me. Palak is a beautiful model and little Arjun made my day."
            },
            {
                "Question": "Thank you very much. We will surely work again together in future.",
                "Answer": "Most welcome. It will be a pleasure to work with Clickmania again."
            }
        ]
    })

    .controller('VirtualGalleryCtrl', function ($scope, $rootScope, TemplateService, NavigationService, AddToCartSerivce, $timeout, $uibModal, $log, $state, CartService) {
        $scope.template = TemplateService.changecontent("virtual-gallery"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Virtual Gallery"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        // $scope.virtualGallery = [{
        //     id: 1,
        //     img: 'frontend/img/photographer/Clicked 2.jpg'
        // }, {
        //     id: 2,
        //     img: 'frontend/img/bg1.jpg'
        // }];
        $scope.beforeAddedCart = true;
        $scope.afterAddedCart = AddToCartSerivce.checkCart(); // to show the Add to cart box

        NavigationService.callApi("Photos/getAllPhotos", function (data) {
            $scope.virtualGallery = data.data;
        });

        //get all categories
        NavigationService.callApi("Categories/getAll", function (data) {
            if (data.value === true) {
                console.log(data);
                $scope.photographerData = {};
                $scope.photographerData.speciality = data.data;
                $scope.category = data.data;
                // _.forEach($scope.category, function (value) {
                //     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!", value);
                //     $scope.catSearchBar.push(value);
                //     //console.log("Cat-data", $scope.catSearchBar);
                // });
            }
        });

        //To add the data in localstorage
        $scope.addToCart = function (galleryObj) {
            AddToCartSerivce.addTCart(galleryObj);
            $rootScope.cartLength = AddToCartSerivce.getCart();
            // $state.reload();
        }

        //To open upload image modal
        $scope.uploadImg = function (contest) {
            $scope.contestIdModal = contest;
            $scope.imgModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/upload-photo.html",
                scope: $scope,
                windowClass: 'upload-pic',
                backdropClass: 'black-drop',
                size: 'lg'
            });
        };
        //To close upload image modal
        $scope.closeModal = function () {
            $scope.imgModal.close();
        };
        //To open image verification modal
        $scope.imageVerify = function () {
            $scope.imgModal = $uibModal.open({
                animation: true,
                templateUrl: "frontend/views/modal/image-verification.html",
                scope: $scope,
                windowClass: 'upload-pic',
                backdropClass: 'black-drop',
                size: 'lg'
            });
        };
        $scope.imageData = {};
        $scope.addImages = function (val) {
            console.log("val", val);
            $scope.imageData.category = val;
            //console.log("$scope.imageData", $scope.imageData.category);
            //     if (_.isEqual(type, "category")) {
            //         $scope.filterToBeApplied.category = val._id;
            //         $scope.filterToBeApplied.catName = val.name;
            //     } else {
            //         $scope.filterToBeApplied.city = val;
            //     }
            //   //  console.log("$scope.filterToBeApplied ", $scope.filterToBeApplied);
        }

        $scope.uploadImagePic = function (formdata) {
            $scope.imageUploadRequest = {};
            $scope.imageUploadRequest.image = formdata.image;
            $scope.imageUploadRequest.categories = $scope.imageData.category._id;
            $scope.imageUploadRequest.photographer = $.jStorage.get("photographer")._id;
            $scope.imageUploadRequest.keyword = _.map(formdata.searchKeyword.split(','), function (n) {
                return _.trim(n);
            });
            $scope.closeModal();
            NavigationService.apiCallWithData("Photos/save", $scope.imageUploadRequest, function (data) {
                if (data.value) {}
            });
        };
        CartService.myFunc("vvvvvvv", function (data) {
            console.log("##########################", data)
        });

    })

    .controller('MyCartCtrl', function ($scope, TemplateService, NavigationService, $timeout, $log, CartService) {
        $scope.template = TemplateService.changecontent("mycart"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("My Cart"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.cartAddedImg = [{
                id: 1,
                img: 'frontend/img/photographer/Clicked 2.jpg',
                name: 'crocodile',
                category: 'wildlife',
                imageId: 5456,
                price: 1300
            },
            {
                id: 2,
                img: 'frontend/img/bg1.jpg',
                name: 'crocodile1',
                category: 'wildlife',
                imageId: 9874,
                price: 1400
            }
        ];

        $scope.removeAddedImg = function (cart) {
            $log.info("index", cart);
            $scope.removedElem = _.remove($scope.cartAddedImg, function (n) {
                $log.info("n", n.id);
                return n.id === cart.id;
            });
        };
        // $log.info(" $scope.removedElem", $scope.removedElem, " $scope.cartAddedImg", $scope.cartAddedImg);
    })

    .controller('VirtualGalleryInnerCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $log, CartService) {
        $scope.template = TemplateService.changecontent("virtual-gallery-inner"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Photographer's gallery"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        var virtualGallstateParaData = {}; // To push $stateParams obj from $scope.virtualGallery
        $scope.individualGalleryData = []; // To push a key and value if $stateParams obj is same
        $scope.virtualGallery = [{
            id: 1,
            img: 'frontend/img/photographer/Clicked 2.jpg'
        }, {
            id: 2,
            img: 'frontend/img/bg1.jpg'
        }];
        //We need to check if $stateParams is true, do the following task
        if ($stateParams) {
            virtualGallstateParaData._id = $stateParams.id;
            NavigationService.apiCallWithData("Photos/getOne", virtualGallstateParaData, function (data) {
                $scope.individualGalleryData = data.data;
                var relatedData = {}
                relatedData.category = $scope.individualGalleryData.categories._id
                NavigationService.apiCallWithData("Photos/getAllRelatedPhotos", relatedData, function (data) {
                    $scope.relatedPhotos = data.data;
                    $scope.showRelatedPic = _.slice($scope.relatedPhotos, 0, 8);
                })

                $scope.shbtn = true;
                //loadmore for categories
                $scope.loadMore = function () {
                    $scope.showRelatedPic = $scope.relatedPhotos;
                    $scope.shbtn = false;
                };

                $scope.loadLess = function () {
                    $scope.showRelatedPic = _.slice($scope.relatedPhotos, 0, 8);
                    $scope.shbtn = true;
                };

                $scope.mycart = function () {
                    var myCartData = {};
                    myCartData.photographer = $scope.individualGalleryData.photographer._id;
                    myCartData.photos = $stateParams.id;
                    console.log("myCartData-", myCartData);
                    NavigationService.apiCallWithData("MyCart/addToCart", myCartData, function (data) {
                        console.log("data----------", data);
                    })
                };

            })

            // $log.warn('  virtualGallstateParaData', virtualGallstateParaData.id);
            // // We need to check if $stateparams id is equal to  $scope.virtualGallery.id. So that we are going to use for loop
            // _.forEach($scope.virtualGallery, function(key, value) {
            //     //  $log.debug('key id', key.id);
            //     if (virtualGallstateParaData.id == key.id) {
            //         // $log.debug('loop');
            //         $scope.individualGalleryData.push({
            //             id: key.id,
            //             img: key.img
            //         });
            //     }
            // });

        } // end of if

        /*****Note****
        We are going to use _.romove function which will remove the objects from the variable which will be an array of object  & return it. So thts'y we need to clone it & store it into the other variable which is  $scope.cpyGalleryData & the removed one will be stored in $scope.removedVirtualGall variable
        **************/
        // $scope.cpyGalleryData = angular.copy($scope.virtualGallery);
        // $scope.removedVirtualGall = _.remove($scope.cpyGalleryData, function (n) {
        //     return virtualGallstateParaData.id != n.id;
        // });
        // $log.debug(' $scope.removedVirtualGall', $scope.removedVirtualGall);
    })

    .factory("AddToCartSerivce", [function () {
        /**getAddedCartArray function will check 1st to get addedCartArray when it load 1st time. if it doesnot get addedCartArray it will create blank array of a key  */
        var addedCartArray;
        var addedCartObj = {
            id: '',
            img: ''
        }; // which will set key and value from the clicked one image

        function getAddedCartArray() {
            console.log("in getAddedcart");
            addedCartArray = localStorage.getItem("addedCartArray"); // It will create an array of local storage with the key name addedCart
            if (!addedCartArray) {
                addedCartArray = [];
                localStorage.setItem["addedCartArray", JSON.stringify(addedCartArray)];

            } else {
                addedCartArray = JSON.parse(addedCartArray);
            }
            return addedCartArray;
        }

        return {
            addTCart: function (galleryObj) {
                addedCartArray = getAddedCartArray(); // call to getAddedCartArrey function
                addedCartObj.id = galleryObj._id

                // console.log("addedCartArray variable", addedCartArray);
                var key = "cart_" + galleryObj._id;
                localStorage.setItem(key, JSON.stringify(addedCartObj));
                addedCartArray.push(key);
                localStorage.setItem("addedCartArray", JSON.stringify(addedCartArray));
            },
            getCart: function () {
                addedCartArray = getAddedCartArray();
                // for (var i = 0; i < addedCartArray.length; i++) {
                //     var key = addedCartArray[i];
                //     var value = addedCartArray[key];
                // } // end of for
                return addedCartArray.length;
            },
            checkCart: function () {
                addedCartArray = getAddedCartArray();
                _.forEach(addedCartArray,  function (value)  {  
                    if (value == addedCartObj.id) {
                        return true;
                    } else {
                        false;
                    }
                });
            }
        }
    }]);
firstapp.service('CartService', function ($http) {
    this.myFunc = function (x, callback) {
        console.log("###########in cartSErvice");
        callback(x.toString(16));
    }
    this.saveImage = function (cart, callback) {
        $http({
            url: adminurl + 'MyCart/save',
            method: 'POST',
            data: cart,
            withCredentials: false
        }).then(callback);
    }
    //to get cart
    this.getCart = function (cart, callback) {
        $http({
            url: adminurl + 'MyCart/getCart',
            method: 'POST',
            data: cart,
            withCredentials: false
        }).then(callback);
    }
    //add photo in cart
    this.addToCart = function (data, callback) {
        var cart = {};
        cart.photographer = data.photographerId;
        cart.photos = data.image;
        // this.getCart(cart, function (data) {
        //     console.log("after calling get cart", data);
        //     if (!_.isEmpty(data)) {

        //     }
        // });
        // this.saveImage(cart, function (data) {
        //     console.log("after adding in cart", data);
        //     callback(data);
        // });
        $http({
            url: adminurl + 'MyCart/addToCart',
            method: 'POST',
            data: cart,
            withCredentials: false
        }).then(callback);
    }

    //remove photo in cart
    this.removeFromCart = function (data, callbck) {
        $http({
            url: adminurl + 'MyCart/removeProduct',
            method: 'POST',
            data: cart,
            withCredentials: false
        }).then(callback);
    }

})
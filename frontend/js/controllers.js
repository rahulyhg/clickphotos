angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ui.bootstrap', 'ngSanitize', 'angular-flexslider', 'ui.swiper', 'imageupload', 'toastr', 'ui.select'])

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

        NavigationService.callApi("PayAmount/getAll", function (data) {
            $scope.amount = data.data;
        });

        $scope.imageSize = function (data) {
            //console.log("data------", data);
            if (data == 'More than 3Mb') {
                toastr.error('Image Size Is More Than 3 Mb');
            }
        }

        if ($.jStorage.get("photographer")) {
            formdata = {};
            formdata._id = $.jStorage.get("photographer")._id;
            NavigationService.apiCallWithData("Photographer/getOne", formdata, function (data) {
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
                    $scope.validDateForSilver = new Date($scope.photographerData.silverPackageBroughtDate);
                    $scope.validDateForSilver.setYear($scope.validDateForSilver.getFullYear() + 1);
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

        $scope.addLocation = function () {
            if (!_.isEmpty(document.getElementById("locationCity").value)) {
                var valText = document.getElementById("locationCity").value;
                var valArr = [];
                //console.log(!/\d/.test(valText)); //returns true if contains numbers
                if (!/\d/.test(valText)) {
                    valArr = valText.split(",");
                    if (!/\d/.test(valArr[0])) {
                        $scope.arrLocation.push(valArr[0]);
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
            console.log(formdata);
            NavigationService.apiCallWithData("Photographer/checkoutPayment", formdata, function (data) {
                console.log(data);
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
            console.log(formdata);
            NavigationService.apiCallWithData("Photographer/checkoutPayment", formdata, function (data) {
                console.log(data);
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
            //console.log("autocomplete", autocomplete);
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
            if ($.jStorage.get("photographer").status == true) {
                $scope.fetrPhoto = true;
                $state.go("becomefp");
            } else {
                $scope.fetrPhoto = false;
                $scope.steps = true;
                $scope.showStep = 2;
            }
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
            if (!terms) {
                // alert('check box error');
                $('.condition-box p.alert-text').text('Please check the terms & condition checkbox').css('text-indent', '32px');
            } else {
                $scope.registerData = formdata;
                NavigationService.apiCallWithData("Photographer/checkPhotographersForOtp", formdata, function (data) {
                    console.log("dataForOtp", data);
                    if (data.value) {
                        console.log(data.data);
                        $scope.signUpOTP();
                        setTimeout(function (data) {
                            $scope.signUpOTP.close();
                        }, 600000);
                    } else {
                        toastr.error('User already exist');
                    }
                });
            }
        };

        $scope.checkOTPForSignUp = function (formdata) {
            NavigationService.apiCallWithData("Photographer/verifyOTP", formdata, function (data) {
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
            formdata._id = $scope.id;
            NavigationService.apiCallWithData("Photographer/updatePass", formdata, function (data) {
                if (data.value) {
                    $scope.displayCnfirmBox = false;
                    $scope.displayotpBox = false;
                    $scope.displayThanksBox = true;
                }
            });
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

        $scope.updateToFeature = function () {

            formdata = {};

            formdata.photographer = $.jStorage.get("photographer")._id;
            formdata.payAmount = $scope.amount[2]._id;
            formdata.amount = $scope.amount[2].amount;
            formdata.email = $.jStorage.get("photographer").email;
            formdata.return_url = adminurl + "Photographer/paymentGatewayResponce";
            formdata.name = $.jStorage.get("photographer").name;
            formdata.type = "featured/" + $.jStorage.get("photographer")._id + "/" + $scope.finalMonth + "/" + new Date().getFullYear();
            console.log(formdata);
            NavigationService.apiCallWithData("Photographer/checkoutPayment", formdata, function (data) {
                console.log(data);
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
        //console.log($scope.template);
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
                )
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
                })
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
                formdata1 = {}
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
                        console.log(data);
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
                    console.log(data);
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
        $scope.sendEnquiry = function ($event) {
            $scope.slide = !$scope.slide;
        };
        $scope.popup1 = {
            opened: false
        }
        $scope.openDatePicker = function () { // to open datePicker for sendEnquiry popup
            $scope.popup1.opened = true;
        };

        // this function is used for data submmiting enquiry
        $scope.formEnquiry = {};
        $scope.dataSubmit = function (data) {
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
                console.log("acceptdataa", data);
                if (data.data.value) {
                    console.log(data.data.value);
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
                //console.log("getPhotographersByCategories", data);
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
        formData = {};
        formData._id = $stateParams.catid;
        NavigationService.apiCallWithData("Categories/getAll", formData, function (data) {
            // console.log("catdata", data);
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
            //console.log("Doc", check);
            if (document.getElementById(check).checked) {
                // $scope.price.push(priceRange);
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
                //console.log("$scope.priceRange", $scope.priceRange);
                // $scope.price.push(priceRange);
                if (!_.isEmpty($scope.priceRange) || !_.isEmpty($scope.cityFill)) {
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
                    });
                } else {
                    //all photographers
                    formdata = {};
                    formdata.speciality = $stateParams.catName;
                    NavigationService.apiCallWithData("Photographer/getPhotographersByCategories", formdata, function (data) {
                        if (data.value === true) {
                            //console.log("getPhotographersByCategories", data);
                            $scope.photographerData = data.data;
                            if (!_.isEmpty($.jStorage.get("photographer"))) {
                                var idToBeRemove = $.jStorage.get("photographer")._id;
                                $scope.photographerData = _.remove($scope.photographerData, function (n) {
                                    return n._id != idToBeRemove;
                                });
                            }
                            //console.log("$scope.photographerData--", $scope.photographerData)
                        }
                    });
                    //all Photographers end
                }
            }
        }
        // filter end

    })

    .controller('headerctrl', function ($scope, TemplateService, $uibModal, $location, $window, NavigationService, $state, $rootScope, toastr) {

        $scope.template = TemplateService;
        $scope.registerData = {};

        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $(window).scrollTop(0);
        });
        $.fancybox.close(true);


        $scope.sideNav = false; // For toggle sidenavigation
        $scope.openSideNav = function () { // For opening the leftside navigation

            if (!$scope.sideNav) {
                $('div.icon_float').children().removeClass(function (index, className) {
                    return (className.match(/\bicon_\S+/g) || []).join(' ');
                });

                $('div.icon_float').addClass('hamburger-cross');
                $('div.icon_float > span.icon-bar').css({
                    'height': '3px',
                    'background-color': '#f4511e',
                    'width': '36px'
                });

                $('.side-menu').addClass('menu-in');
                $('.side-menu').removeClass('menu-out');
                $('.main-overlay').css('opacity', '1');
                //  $('.navbar-toggle').attr('ng-click', 'test1()');
                $scope.sideNav = true;
            } else {
                if ($('div.icon_float').hasClass('hamburger-cross')) {
                    $('div.icon_float').children().addClass(function (n) {
                        $('div.icon_float').removeClass('hamburger-cross');
                        $('div.icon_float > span.icon-bar').removeAttr('style');
                        $('section .mg_lft').css('margin-left', '0');
                        $('#sidenav-overlay').css('display', 'none');
                        $('body').css('overflow-y', 'scroll');
                        return 'icon_bar' + n;

                    });
                }
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

            console.log("login");
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
                $scope.registerData = formdata;
                NavigationService.apiCallWithData("Photographer/checkPhotographersForOtp", formdata, function (data) {
                    //console.log("dataForOtp", data);
                    if (data.value) {
                        $scope.signUpOTP();
                        setTimeout(function (data) {
                            $scope.signUpOTP.close();
                        }, 600000);
                    } else {
                        toastr.error('User already exist');
                    }
                });
            }
        };

        $scope.checkOTPForSignUp = function (formdata) {
            NavigationService.apiCallWithData("Photographer/verifyOTP", formdata, function (data) {
                //console.log("dataForOtp", data.data);
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
                console.log("dataForOtp", data);
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
            formdata._id = $scope.id;
            // console.log("doneFormData", formdata);
            NavigationService.apiCallWithData("Photographer/updatePass", formdata, function (data) {
                console.log("doneFormDatadata", data);
                if (data.value) {
                    $scope.displayCnfirmBox = false;
                    $scope.displayotpBox = false;
                    $scope.displayThanksBox = true;
                }
            });
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

    .controller('thanksCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams) {

        $scope.template = TemplateService.changecontent("thanks"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Thank-You"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.msg = "";
        formData = {};
        formData._id = $stateParams.id;
        NavigationService.apiCallWithData("Order/getOne", formData, function (data) {
            if (data.value === true) {
                if (data.data.description.split('/')[0] != "featured") {
                    $scope.msg = "You have now been upgraded to a " + data.data.description.split('/')[0] + " Member.";

                } else {
                    $scope.msg = "You are now registered as a Featured Photographer for the month of " + data
                        .data.photographer.month;
                    formData = {};
                    formData._id = $.jStorage.get("photographer")._id;
                    NavigationService.apiCallWithData("Photographer/getOne", formData, function (data) {
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

    .controller('thanksSilverCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.changecontent("thanks-silver"); //Use same name of .html file
        $scope.menutitle = NavigationService.makeactive("Thank-You"); //This is the Title of the Website
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

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
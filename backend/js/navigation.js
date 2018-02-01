var imgurl = adminurl + "upload/";

var imgpath = imgurl + "readFile";
var uploadurl = imgurl;

var navigationservice = angular.module('navigationservice', [])

    .factory('NavigationService', function ($http) {
        var navigation1 = [{
                name: "Admin",
                classis: "active",
                sref: "#!/page/viewUser//",
            },
            {
                name: "Photographers",
                classis: "active",
                sref: "#!/page/viewPhotographer//",
            },
            {
                name: "Artist Of  The Month",
                classis: "active",
                sref: "#!/page/viewArtistOfMonth//",
            },
            {
                name: "Featured Photographers",
                classis: "active",
                sref: "#!/page/viewFeaturedPhotographer//",
            },
            {
                name: "Categories",
                classis: "active",
                sref: "#!/page/viewCategories//",
            },
            {
                name: "Home Page Banner",
                classis: "active",
                sref: "#!/page/viewHomePage//",
            },
            {
                name: "Subscribed Emails",
                classis: "active",
                sref: "#!/page/viewSubscribeEmail//",
            },
            {
                name: "Photo Contest",
                classis: "active",
                sref: "#!/page/viewPhotoContest//",
            },
            {
                name: "Orders",
                classis: "active",
                sref: "#!/page/viewOrders//",
            },

            //

            {
                name: "Another",
                classis: "active",
                sref: "#!/page/viewOrders//",
            }
        ];

        return {
            getnav: function () {
                var navigation = [];
                // return navigation;
                if ($.jStorage.get("profile") && $.jStorage.get("profile").accessLevel == 'Admin1') {
                    _.forEach(_.cloneDeep(navigation1), function (val) {
                        if (_.isEqual(val.name, 'Another')) {
                            navigation.push(val);
                        }
                    });
                    return navigation;
                } else if ($.jStorage.get("profile") && $.jStorage.get("profile").accessLevel == 'Admin') {
                    return navigation1;
                }
            },

            parseAccessToken: function (data, callback) {
                if (data) {
                    $.jStorage.set("accessToken", data);
                    callback();
                }
            },
            removeAccessToken: function (data, callback) {
                $.jStorage.flush();
            },
            profile: function (callback, errorCallback) {
                var data = {
                    accessToken: $.jStorage.get("accessToken")
                };
                $http.post(adminurl + 'user/profile', data).then(function (data) {
                    data = data.data;
                    if (data.value === true) {
                        $.jStorage.set("profile", data.data);
                        callback();
                    } else {
                        errorCallback(data.error);
                    }
                });
            },
            makeactive: function (menuname) {
                for (var i = 0; i < navigation1.length; i++) {
                    if (navigation1[i].name == menuname) {
                        navigation1[i].classis = "active";
                    } else {
                        navigation1[i].classis = "";
                    }
                }
                return menuname;
            },

            search: function (url, formData, i, callback) {
                $http.post(adminurl + url, formData).then(function (data) {
                    data = data.data;
                    callback(data, i);
                });
            },
            delete: function (url, formData, callback) {
                $http.post(adminurl + url, formData).then(function (data) {
                    data = data.data;
                    callback(data);
                });
            },
            countrySave: function (formData, callback) {
                $http.post(adminurl + 'country/save', formData).then(function (data) {
                    data = data.data;
                    callback(data);

                });
            },

            apiCall: function (url, formData, callback) {
                $http.post(adminurl + url, formData).then(function (data) {
                    data = data.data;
                    callback(data);

                });
            },
            searchCall: function (url, formData, i, callback) {
                $http.post(adminurl + url, formData).then(function (data) {
                    data = data.data;
                    callback(data, i);
                });
            },

            getOneCountry: function (id, callback) {
                $http.post(adminurl + 'country/getOne', {
                    _id: id
                }).then(function (data) {
                    data = data.data;
                    callback(data);

                });
            },
            getLatLng: function (address, i, callback) {
                $http({
                    url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyC62zlixVsjaq4zDaL4cefNCubjCgxkte4",
                    method: 'GET',
                    withCredentials: false,
                }).then(function (data) {
                    data = data.data;
                    callback(data, i);
                });
            },
            uploadExcel: function (form, callback) {
                $http.post(adminurl + form.model + '/import', {
                    file: form.file
                }).then(function (data) {
                    data = data.data;
                    callback(data);

                });

            },

            saveCategory: function (formData, callback) {
                $http.post(adminurl + 'Categories/save', formData).then(function (data) {
                    data = data.data;
                    callback(data);

                });
            },

        };
    });
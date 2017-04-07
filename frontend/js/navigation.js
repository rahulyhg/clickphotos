var uploadurl = adminurl + "upload/";

var navigationservice = angular.module('navigationservice', [])


    .factory('NavigationService', function ($http) {
        var navigation = [{
            name: "Home",
            classis: "active",
            anchor: "home",
            subnav: [{
                name: "Subnav1",
                classis: "active",
                anchor: "home"
            }]
        }, {
            name: "Form",
            classis: "active",
            anchor: "form",
            subnav: []
        }];

        return {
            getnav: function () {
                return navigation;
            },
            makeactive: function (menuname) {
                for (var i = 0; i < navigation.length; i++) {
                    if (navigation[i].name == menuname) {
                        navigation[i].classis = "active";
                    } else {
                        navigation[i].classis = "";
                    }
                }
                return menuname;
            },

            apiCallWithData: function (url, formData, callback) {
                $http.post(adminurl + url, formData).then(function (data) {
                    data = data.data;
                    callback(data);

                });
            },

            callApi: function (url, callback) {
                $http.post(adminurl + url).then(function (data) {
                    data = data.data;
                    callback(data);
                });
            },

            sendLogin: function (formdata, callback) {
                $http({
                    url: adminurl + 'Photographer/registerUser',
                    method: 'POST',
                    data: formdata,
                    withCredentials: true
                }).then(function (data) {
                    callback(data);
                });
            },

            checkLogin: function (formdata, callback) {
                $http({
                    url: adminurl + 'Photographer/doLogin',
                    method: 'POST',
                    data: formdata,
                    withCredentials: true
                }).then(function (data) {
                    callback(data);
                });
            }

        };
    });
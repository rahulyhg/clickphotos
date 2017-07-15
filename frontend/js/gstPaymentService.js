var Gst = angular.module('gstPaymentService', ["NavigationService"]);
Gst.service('GstService', function () {

    this.gstPayment = function (data, callback) {
        var url = "GstDetails/save";
        NavigationService.apiCallWithData(url, data, function (data) {
            callback(data)
        })
    }
})
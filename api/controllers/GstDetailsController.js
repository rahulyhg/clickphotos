module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    updatePackageAmtForFeature: function (req, res) {
        if (req.body) {
            GstDetails.updatePackageAmtForFeature(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    updatePackageAmtForGandS: function (req, res) {
        if (req.body) {
            GstDetails.updatePackageAmtForGandS(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    updatePackageAmtForPhotoContest: function (req, res) {
        if (req.body) {
            GstDetails.updatePackageAmtForPhotoContest(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    invoiceNumberGenerate: function (req, res) {
        if (req.body) {
            GstDetails.invoiceNumberGenerate(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    searchForJson: function (req, res) {

        req.model.searchForJson(req.body, res.callback);

    }
};
module.exports = _.assign(module.exports, controller);
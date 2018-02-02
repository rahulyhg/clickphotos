module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    searchPhotos: function (req, res) {
        if (req.body) {
            Photos.searchPhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    getApprovedPhotos: function (req, res) {
        if (req.body) {
            Photos.getApprovedPhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

};
module.exports = _.assign(module.exports, controller);

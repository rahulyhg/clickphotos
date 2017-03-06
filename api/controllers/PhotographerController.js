module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    getPhotographers: function (req, res) {
        if (req.body) {
            Photographer.getPhotographers(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    
    updatePhotographer: function (req, res) {
        if (req.body) {
            Photographer.updatePhotographer(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    
    deleteFeaturedPhotographer: function (req, res) {
        if (req.body) {
            Photographer.deleteFeaturedPhotographer(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    }


};
module.exports = _.assign(module.exports, controller);
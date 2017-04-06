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

    uploadPhotos: function (req, res) {
        if (req.body) {
            Photographer.uploadPhotos(req.body, res.callback);
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
    },

    registerUser: function (req, res) {
        if (req.body) {
            Photographer.registerUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    doLogin: function (req, res) {
        if (req.body) {
            Photographer.doLogin(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    updateToFeaturePhotographer: function (req, res) {
        if (req.body) {
            Photographer.updateToFeaturePhotographer(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findPhotographer: function (req, res) {
        if (req.body) {
            Photographer.findPhotographer(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    removeUpldImg: function (req, res) {
        if (req.body) {
            Photographer.removeUpldImg(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    saveData: function (req, res) {
        if (req.body) {
            Photographer.saveData(req.body, res.callback);
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
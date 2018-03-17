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

    downloadSelectedPhotos: function (req, res) {
        if (req.body) {
            Photos.downloadSelectedPhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    getAllPhotos: function (req, res) {
        if (req.body) {
            Photos.getAllPhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    getAllRelatedPhotos: function (req, res) {
        if (req.body) {
            Photos.getAllRelatedPhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getAllPhotosOfPhotographer: function (req, res) {
        if (req.body) {
            Photos.getAllPhotosOfPhotographer(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    uploadPhotoMail: function (req, res) {
        if (req.body) {
            Photos.uploadPhotoMail(req.body, res.callback);
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
module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    findOnePhotoContest: function (req, res) {
        if (req.body) {
            PhotoContest.findOnePhotoContest(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    removeContestUsers: function (req, res) {
        if (req.body) {
            PhotoContest.removeContestUsers(req.body, res.callback);
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
            PhotoContest.findPhotographer(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findPhotographerForWinner: function (req, res) {
        if (req.body) {
            PhotoContest.findPhotographerForWinner(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    allUpdate: function (req, res) {
        if (req.body) {
            PhotoContest.allUpdate(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findPhotoConetst: function (req, res) {
        if (req.body) {
            PhotoContest.findPhotoConetst(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findAllPhotoConetst: function (req, res) {
        if (req.body) {
            PhotoContest.findAllPhotoConetst(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    uploadContestPhotos: function (req, res) {
        if (req.body) {
            PhotoContest.uploadContestPhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    buyPhotoContestPackage: function (req, res) {
        if (req.body) {
            PhotoContest.buyPhotoContestPackage(req.body, res.callback);
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
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
    },

    // getFeaturePhotographer: function (req, res) {
    //     if (req.body) {
    //         Photographer.getFeaturePhotographer(req.body, res.callback);
    //     } else {
    //         res.json({
    //             value: false,
    //             data: {
    //                 message: "Invalid Request"
    //             }
    //         })
    //     }
    // },

    getRelatedPhotographers: function (req, res) {
        if (req.body) {
            Photographer.getRelatedPhotographers(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    getLastFeaturedPhotographer: function (req, res) {
        if (req.body) {
            Photographer.getLastFeaturedPhotographer(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    getCities: function (req, res) {
        if (req.body) {
            Photographer.getCities(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    getFeatPhotographer: function (req, res) {
        if (req.body) {
            Photographer.getFeatPhotographer(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    getPhotographersByCategories: function (req, res) {
        if (req.body) {
            Photographer.getPhotographersByCategories(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    clickFilter: function (req, res) {
        if (req.body) {
            Photographer.clickFilter(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    //mailers

    silverPackgeMail: function (req, res) {
        if (req.body) {
            Photographer.silverPackgeMail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    upgradToGoldMail: function (req, res) {
        if (req.body) {
            Photographer.upgradToGoldMail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    goldPackageMail: function (req, res) {
        if (req.body) {
            Photographer.goldPackageMail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    sendEnq: function (req, res) {
        if (req.body) {
            Photographer.sendEnq(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    sendOtp: function (req, res) {
        if (req.body) {
            Photographer.sendOtp(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    updatePass: function (req, res) {
        if (req.body) {
            Photographer.updatePass(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    updateToGold: function (req, res) {
        if (req.body) {
            Photographer.updateToGold(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    updateToSilver: function (req, res) {
        if (req.body) {
            Photographer.updateToSilver(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    // smsForOtp: function (req, res) {
    //     if (req.body) {
    //         Photographer.smsForOtp(req.body, res.callback);
    //     } else {
    //         res.json({
    //             value: false,
    //             data: {
    //                 message: "Invalid Request"
    //             }
    //         })
    //     }
    // }

};
module.exports = _.assign(module.exports, controller);
var sha512 = require('sha512');
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

    allUpdate: function (req, res) {
        if (req.body) {
            Photographer.allUpdate(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    //otp signup
    checkPhotographersForOtp: function (req, res) {
        if (req.body) {
            Photographer.checkPhotographersForOtp(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    verifyOTP: function (req, res) {
        if (req.body) {
            Photographer.verifyOTP(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    verifyOTPForResetPass: function (req, res) {
        if (req.body) {
            Photographer.verifyOTPForResetPass(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    //otp signup end
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

    checkoutPayment: function (req, res) {
        // console.log("req.body468646464sd64a6sd4asd", req.body)
        if (req.body) {
            var formData = {
                name: req.body.name,
                description: req.body.type,
                photographer: req.body.photographer,
                payAmount: req.body.payAmount,
                amount: req.body.amount,
                email: req.body.email,
                phone: req.body.phone,
                return_url: req.body.return_url
            };
            Order.saveData(formData, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    sendToPaymentGateway: function (req, res) {
        if (req.query.id) {
            Order.findOne({
                _id: req.query.id
            }).populate('photographer payAmount').lean().exec(function (err, data) {
                if (err) {
                    res.callback(err);
                } else {
                    if (data.phone) {
                        var phoneno = data.phone
                    } else {
                        var phoneno = "0000000000"
                    }
                    if (data.payAmount != null) {
                        EBSConfig.getAll({}, function (err, dataConfig) {
                            // console.log("ggggggggg");
                            console.log(data);
                            var hash = sha512(dataConfig[0].secret + "|" + dataConfig[0].account + "|Billing Address|" + data.payAmount.amount + "|0|Billing City|IND|INR|" + data.description + "|GBP|1|" + data.email + "|" + dataConfig[0].name + "|" + data.name + "|" + phoneno + "|600001|" + req.query.id + "|" + data.return_url);
                            var hashtext = hash.toString('hex');
                            var hs = hashtext.toUpperCase('hex');
                            var reference_no = req.query.id;

                            var formData = {
                                account_id: dataConfig[0].account,
                                address: "Billing Address",
                                amount: data.payAmount.amount,
                                channel: "0",
                                city: "Billing City",
                                country: "IND",
                                currency: "INR",
                                description: data.description,
                                display_currency: "GBP",
                                display_currency_rates: "1",
                                email: data.email,
                                mode: dataConfig[0].name,
                                reference_no: req.query.id,
                                name: data.name,
                                phone: phoneno,
                                postal_code: "600001",
                                return_url: data.return_url,
                                secure_hash: hs
                            };
                            res.view("payu", formData);
                        });
                    } else {
                        EBSConfig.getAll({}, function (err, dataConfig) {
                            // console.log("ggggggggg");
                            console.log(dataConfig);
                            var hash = sha512(dataConfig[0].secret + "|" + dataConfig[0].account + "|Billing Address|" + data.amount + "|0|Billing City|IND|INR|" + data.description + "|GBP|1|" + data.email + "|" + dataConfig[0].name + "|" + data.name + "|" + phoneno + "|600001|" + req.query.id + "|" + data.return_url);
                            var hashtext = hash.toString('hex');
                            var hs = hashtext.toUpperCase('hex');
                            var reference_no = req.query.id;

                            var formData = {
                                account_id: dataConfig[0].account,
                                address: "Billing Address",
                                amount: data.amount,
                                channel: "0",
                                city: "Billing City",
                                country: "IND",
                                currency: "INR",
                                description: data.description,
                                display_currency: "GBP",
                                display_currency_rates: "1",
                                email: data.email,
                                mode: dataConfig[0].name,
                                reference_no: req.query.id,
                                name: data.name,
                                phone: phoneno,
                                postal_code: "600001",
                                return_url: data.return_url,
                                secure_hash: hs
                            };
                            res.view("payu", formData);
                        });
                    }
                }

            });

        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    paymentGatewayResponce: function (req, res) {
        if (req.body) {
            if (req.body.ResponseMessage == "Transaction Successful") {
                var formData = {
                    _id: req.body.MerchantRefNo,
                    transactionId: req.body.TransactionID,
                    paymentResponce: req.body
                };
                Order.editData(formData, function (err, data) {
                    if (parseFloat(data.amount) === parseFloat(req.body.Amount)) {
                        if (req.body.Description.split("/")[0] === "featured") {
                            Photographer.updateToFeaturePhotographer(req.body, function (err, data) {
                                res.redirect(env.realHost + "/thanks/" + req.body.MerchantRefNo);
                            });
                            GstDetails.updatePackageAmtForFeature(req.body, function (err, data) {
                                console.log("updatePackageAmtForFeature", data);
                            });
                        } else {
                            Photographer.updateToGold(req.body, function (err, data) {
                                res.redirect(env.realHost + "/thanks/" + req.body.MerchantRefNo);
                            });
                            GstDetails.updatePackageAmtForGandS(req.body, function (err, data) {
                                console.log("updatePackageAmtForFeature", data);
                            });
                        }
                    } else {
                        res.redirect(env.realHost + "/error");
                    }
                });

            } else {
                res.redirect(env.realHost + "/error");
            }
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
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
            });
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

    findPhotographerCities: function (req, res) {
        if (req.body) {
            Photographer.findPhotographerCities(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    sendOtpForSignUp: function (req, res) {
        if (req.body) {
            Photographer.sendOtpForSignUp(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    getAllPhotographers: function (req, res) {
        if (req.body) {
            Photographer.getAllPhotographers(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    getAllPhotographersForBack: function (req, res) {
        if (req.body) {
            Photographer.getAllPhotographersForBack(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findContest: function (req, res) {
        if (req.body) {
            Photographer.findContest(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    removeContestUser: function (req, res) {
        if (req.body) {
            Photographer.removeContestUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findContestPhotos: function (req, res) {
        if (req.body) {
            Photographer.findContestPhotos(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findTotalPriceOfGold: function (req, res) {
        if (req.body) {
            Photographer.findTotalPriceOfGold(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    addcontestParticipant: function (req, res) {
        if (req.body) {
            Photographer.addcontestParticipant(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    }

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
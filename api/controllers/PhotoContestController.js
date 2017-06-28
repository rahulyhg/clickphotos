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
            });
        }
    },

    findAllPhotographersInContest: function (req, res) {
        if (req.body) {
            PhotoContest.findAllPhotographersInContest(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    //payment gateway

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
                        if (req.body.Description.split("/")[0] === "PackageUpdateForThree") {
                            Photographer.buyPhotoContestPackage(req.body, function (err, data) {
                                res.redirect(env.realHost + "/thanks/" + req.body.MerchantRefNo);
                            });
                        } else if (req.body.Description.split("/")[0] === "PackageUpdateForSix") {
                            Photographer.buyPhotoContestPackage(req.body, function (err, data) {
                                res.redirect(env.realHost + "/thanks/" + req.body.MerchantRefNo);
                            });
                        } else {
                            Photographer.buyPhotoContestPackage(req.body, function (err, data) {
                                res.redirect(env.realHost + "/thanks/" + req.body.MerchantRefNo);
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

    checkoutPayment: function (req, res) {
        if (req.body) {
            var formData = {
                name: req.body.name,
                description: req.body.type,
                photographer: req.body.photographer,
                payAmount: req.body.payAmount,
                amount: req.body.amount,
                email: req.body.email,
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
                    EBSConfig.getAll({}, function (err, dataConfig) {
                        console.log("ggggggggg");
                        console.log(dataConfig);
                        var hash = sha512(dataConfig[0].secret + "|" + dataConfig[0].account + "|Billing Address|" + data.payAmount.amount + "|0|Billing City|IND|INR|" + data.description + "|GBP|1|" + data.email + "|" + dataConfig[0].name + "|" + data.name + "|04423452345|600001|" + req.query.id + "|" + data.return_url);
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
                            phone: "04423452345",
                            postal_code: "600001",
                            return_url: data.return_url,
                            secure_hash: hs
                        };
                        res.view("payu", formData);

                    });


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
    }

};
module.exports = _.assign(module.exports, controller);
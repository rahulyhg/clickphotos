module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var sha512 = require('sha512');
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

    bulkDownload: function (req, res) {
        var JSZip = require("jszip");
        var zip = new JSZip();
        PhotoContest.findOne({
            _id: req.query.id
        }).deepPopulate('contestParticipant.photographerId').lean().exec(function (err, found) {
            if (err) {
                // console.log(err);
                res.callback(err, null);
            } else {
                if (_.isEmpty(found)) {
                    res.callback(null, "noDataFound");
                } else {
                    var userPaths = [];
                    // var photoZip = zip.folder(found.contestName);
                    async.each(found.contestParticipant, function (file, callback) {
                            // console.log("filesss", file.photographerId);
                            if (file.photographerId) {
                                // console.log("file--- ", file.photographerId.name);
                                var folder = "./.tmp/";
                                var path = file.orderId + ".zip";
                                var finalPath = folder + path;
                                userPaths.push({
                                    finalPath: finalPath,
                                    path: path
                                });
                                var files = [];
                                async.eachSeries(file.Photos, function (image, callback1) {
                                    request(global["env"].realHost + '/api/upload/readFile?file=' + image).pipe(fs.createWriteStream(image)).on('finish', function (images) {
                                        // JSZip generates a readable stream with a "end" event,
                                        // but is piped here in a writable stream which emits a "finish" event.
                                        fs.readFile(image, function (err, imagesData) {
                                            if (err) {
                                                res.callback(err, null);
                                            } else {
                                                //Remove image
                                                // fs.unlink(image);
                                                // zip.file("file", content); ... and other manipulations
                                                zip.file(image, imagesData);
                                                callback1();
                                            }
                                        });
                                    });
                                }, function () {
                                    //Generate Zip file
                                    zip.generateNodeStream({
                                            type: 'nodebuffer',
                                            streamFiles: true
                                        })
                                        .pipe(fs.createWriteStream(finalPath))
                                        .on('finish', function (zipData) {
                                            // JSZip generates a readable stream with a "end" event,
                                            // but is piped here in a writable stream which emits a "finish" event.
                                            callback();
                                        });

                                });
                            }

                        },
                        function (err) {
                            if (err) {
                                // console.log('A file failed to process');
                                res.callback(err);
                            } else {
                                // console.log('All files have been processed successfully');
                                var zip = new JSZip();
                                // var zipFolder = zip.folder('photos');
                                async.eachSeries(userPaths, function (image, callback1) {
                                    // console.log("iamge", image);
                                    // JSZip generates a readable stream with a "end" event,
                                    // but is piped here in a writable stream which emits a "finish" event.
                                    fs.readFile(image.finalPath, function (err, imagesData) {
                                        if (err) {
                                            res.callback(err, null);
                                        } else {
                                            //Remove image
                                            //fs.unlink(image);
                                            // zip.file("file", content); ... and other manipulations
                                            zip.file(image.path, imagesData);
                                            callback1();
                                        }
                                    });
                                }, function () {
                                    //Generate Zip file

                                    var folder = "./.tmp/";
                                    var path = found.contestName + ".zip";
                                    var finalPath = folder + path;
                                    zip.generateNodeStream({
                                            type: 'nodebuffer',
                                            streamFiles: true
                                        })
                                        .pipe(fs.createWriteStream(finalPath))
                                        .on('finish', function (zipData) {
                                            // JSZip generates a readable stream with a "end" event,
                                            // but is piped here in a writable stream which emits a "finish" event.
                                            fs.readFile(finalPath, function (err, zip) {
                                                if (err) {
                                                    res.callback(err, null);
                                                } else {
                                                    res.set('Content-Type', "application/octet-stream");
                                                    res.set('Content-Disposition', "attachment;filename=" + path);
                                                    res.send(zip);
                                                    fs.unlink(finalPath);

                                                    async.each(userPaths, function (image, callbackfinal) {
                                                        fs.unlink(image.finalPath);
                                                        callbackfinal();
                                                    })

                                                    // console.log("zip", zip);
                                                    // console.log("val", val);
                                                }
                                            });
                                            // callback();
                                        });

                                });

                            }
                        });
                }
            }

        });
        // if (req.body) {
        //     PhotoContest.bulkDownload(req.body, res);
        // } else {
        //     res.json({
        //         value: false,
        //         data: {
        //             message: "Invalid Request"
        //         }
        //     })
        // }
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
                    req.body.Description = req.body.Description + "/" + data._id;
                    // console.log("*****************************", req.body.Description);
                    if (parseFloat(data.amount) === parseFloat(req.body.Amount)) {
                        if (req.body.Description.split("/")[0] === "PackageUpdateForThree") {
                            // console.log("req.body--------------------------------", req.body);
                            PhotoContest.buyPhotoContestPackage(req.body, function (err, data) {
                                // console.log("buyPhotoContestPackage---------------------------", data);
                                res.redirect(env.realHost + "/thanks/" + req.body.MerchantRefNo);
                            });
                            PhotoContest.addcontestParticipant(req.body, function (err, data) {
                                // console.log("-----------------------------------------3", data);
                            });
                            GstDetails.updatePackageAmtForPhotoContest(req.body, function (err, data) {
                                // console.log("updatePackageAmtForFeature", data);
                            });
                        } else if (req.body.Description.split("/")[0] === "PackageUpdateForSix") {
                            PhotoContest.buyPhotoContestPackage(req.body, function (err, data) {
                                res.redirect(env.realHost + "/thanks/" + req.body.MerchantRefNo);
                            });
                            PhotoContest.addcontestParticipant(req.body, function (err, data) {
                                // console.log("-----6");
                            });
                            GstDetails.updatePackageAmtForPhotoContest(req.body, function (err, data) {
                                // console.log("updatePackageAmtForFeature", data);
                            });
                        }
                        // else {
                        //     PhotoContest.buyPhotoContestPackage(req.body, function (err, data) {
                        //         res.redirect(env.realHost + "/thanks/" + req.body.MerchantRefNo);
                        //     });
                        //     PhotoContest.addcontestParticipant(req.body, function (err, data) {
                        //         console.log("-----9");
                        //     });
                        //     GstDetails.updatePackageAmtForPhotoContest(req.body, function (err, data) {
                        //         console.log("updatePackageAmtForFeature", data);
                        //     });
                        // }
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
                phone: req.body.phone,
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
                    if (data.phone) {
                        var phoneno = data.phone
                    } else {
                        var phoneno = "0000000000"
                    }
                    EBSConfig.getAll({}, function (err, dataConfig) {
                        // console.log("ggggggggg");
                        console.log(dataConfig);
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

    addcontestParticipant: function (req, res) {
        if (req.body) {
            PhotoContest.addcontestParticipant(req.body, res.callback);
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
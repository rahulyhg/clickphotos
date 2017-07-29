var schema = new Schema({
    photographer: {
        type: Schema.Types.ObjectId,
        ref: "Photographer",
        index: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: String,
    address: String,
    country: String,
    state: String,
    city: String,
    pincode: Number,
    gstNumber: String,
    packageAmount: String,
    package: String,
    invoiceNumber: {
        type: String
    },
    invoiceFile: String
});

schema.plugin(deepPopulate, {
    populate: {
        photographer: {
            select: ""
        },
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('GstDetails', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "photographer", "photographer"));
var model = {

    updatePackageAmtForFeature: function (data, callback) {
        var orderData = data.Description.split("/");
        GstDetails.invoiceNumberGenerate(data, function (err, invoiceNumber) {
            if (err) {
                callback(err);
            } else {
                var invoiceNo = invoiceNumber;
                GstDetails.findOneAndUpdate({
                    _id: orderData[5]
                }, {
                    packageAmount: orderData[4],
                    package: orderData[0],
                    invoiceNumber: invoiceNo
                }, {
                    new: true
                }).deepPopulate("photographer").exec(function (err, found) {
                    if (err) {
                        callback(err, null);
                    } else {
                        if (found) {
                            callback(null, found);
                            var invoiceDate = {};
                            Config.generatePdf(found, function (err, data) {
                                if (err) {
                                    // callback(err, null);
                                } else if (data) {
                                    invoiceDate._id = found._id;
                                    invoiceDate.invoiceFile = data.name;
                                    GstDetails.saveData(invoiceDate, function (err, data) {
                                        var emailData = {};
                                        emailData.from = "admin@clickmania.in";
                                        emailData.name = found.photographer.name;
                                        emailData.email = found.photographer.email;
                                        emailData.file = data.name;
                                        emailData.filename = "featuredpht.ejs";
                                        emailData.subject = "Invoice";
                                        console.log("emaildata", emailData);
                                        Config.email(emailData, function (err, emailRespo) {
                                            if (err) {
                                                console.log(err);
                                                // callback(err);
                                            } else if (emailRespo) {
                                                // callback(null, emailRespo);
                                            } else {
                                                // callback(null, "Invalid data");
                                            }
                                        });
                                    });
                                } else {
                                    // callback("Invalid data", data);
                                }
                            });
                        } else {
                            callback(null, {
                                message: "No Data Found"
                            });
                        }
                    }
                });
            }
        });
    },

    updatePackageAmtForGandS: function (data, callback) {
        var orderData = data.Description.split("/");
        GstDetails.invoiceNumberGenerate(data, function (err, invoiceNumber) {
            if (err) {
                callback(err);
            } else {
                var invoiceNo = invoiceNumber;
                console.log(invoiceNo);
                GstDetails.findOneAndUpdate({
                    _id: orderData[3]
                }, {
                    packageAmount: orderData[2],
                    package: orderData[0],
                    invoiceNumber: invoiceNo
                }, {
                    new: true
                }).deepPopulate("photographer").exec(function (err, found) {
                    if (err) {
                        callback(err, null);
                    } else {
                        if (found) {
                            callback(null, found);
                            Config.generatePdf(found, function (err, data) {
                                if (err) {
                                    // callback(err, null);
                                } else if (data) {
                                    invoiceDate._id = found._id;
                                    invoiceDate.invoiceFile = data.name;
                                    GstDetails.saveData(invoiceDate, function (err, data) {});
                                } else {
                                    // callback("Invalid data", data);
                                }
                            });
                        } else {
                            callback(null, {
                                message: "No Data Found"
                            });
                        }
                    }
                });
            }
        });
    },

    updatePackageAmtForPhotoContest: function (data, callback) {
        var orderData = data.Description.split("/");
        GstDetails.invoiceNumberGenerate(data, function (err, invoiceNumber) {
            if (err) {
                callback(err);
            } else {
                var invoiceNo = invoiceNumber;
                console.log(invoiceNo);
                GstDetails.findOneAndUpdate({
                    _id: orderData[4]
                }, {
                    packageAmount: orderData[3],
                    package: orderData[0],
                    invoiceNumber: invoiceNo
                }, {
                    new: true
                }).deepPopulate("photographer").exec(function (err, found) {
                    if (err) {
                        callback(err, null);
                    } else {
                        if (found) {
                            callback(null, found);
                            Config.generatePdf(found, function (err, data) {
                                if (err) {
                                    // callback(err, null);
                                } else if (data) {
                                    invoiceDate._id = found._id;
                                    invoiceDate.invoiceFile = data.name;
                                    GstDetails.saveData(invoiceDate, function (err, data) {});
                                } else {
                                    // callback("Invalid data", data);
                                }
                            });
                        } else {
                            callback(null, {
                                message: "No Data Found"
                            });
                        }
                    }
                });
            }
        });
        // GstDetails.findOneAndUpdate({
        //     _id: orderData[4]
        // }, {
        //     packageAmount: orderData[3],
        //     package: orderData[0]
        // }).exec(function (err, found) {
        //     if (err) {
        //         callback(err, null);
        //     } else {
        //         if (found) {
        //             callback(null, found);
        //         } else {
        //             callback(null, {
        //                 message: "No Data Found"
        //             });
        //         }
        //     }
        // });
    },


    invoiceNumberGenerate: function (data, callback) {
        GstDetails.find({}).sort({
            createdAt: -1
        }).limit(2).deepPopulate('photographer').exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (_.isEmpty(found)) {
                    callback(null, "noDataFound");
                } else {
                    if (_.isEmpty(found[1])) {
                        var year = new Date().getFullYear().toString().substr(-2);
                        var nextYear = Number(year) + 1;
                        var invoiceNumber = "CM" + " /" + "1" + "/" + year + "-" + nextYear;
                        callback(null, invoiceNumber);
                    } else {
                        if (!found[1].invoiceNumber) {
                            var year = new Date().getFullYear().toString().substr(-2);
                            var nextYear = Number(year) + 1;
                            var invoiceNumber = "CM" + " /" + "1" + "/" + year + "-" + nextYear;
                            callback(null, invoiceNumber);
                        } else {
                            var invoiceData = found[1].invoiceNumber.split("/");
                            var num = parseInt(invoiceData[1]);
                            var nextNum = num + 1;
                            var year = new Date().getFullYear().toString().substr(-2);
                            var nextYear = Number(year) + 1;
                            var invoiceNumber = "CM" + " /" + nextNum + "/" + year + "-" + nextYear;
                            callback(null, invoiceNumber);
                        }
                    }
                }
            }

        });
    },

};
module.exports = _.assign(module.exports, exports, model);
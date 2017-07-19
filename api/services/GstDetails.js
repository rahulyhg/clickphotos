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
        type: Number,
        default: 00000
    }
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
        GstDetails.findOneAndUpdate({
            _id: orderData[5]
        }, {
            packageAmount: orderData[4],
            package: orderData[0]
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (found) {
                    callback(null, found);
                } else {
                    callback(null, {
                        message: "No Data Found"
                    });
                }
            }
        });
    },

    updatePackageAmtForGandS: function (data, callback) {
        var orderData = data.Description.split("/");
        GstDetails.findOneAndUpdate({
            _id: orderData[3]
        }, {
            packageAmount: orderData[2],
            package: orderData[0]
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (found) {
                    callback(null, found);
                } else {
                    callback(null, {
                        message: "No Data Found"
                    });
                }
            }
        });
    },

    updatePackageAmtForPhotoContest: function (data, callback) {
        var orderData = data.Description.split("/");
        GstDetails.findOneAndUpdate({
            _id: orderData[4]
        }, {
            packageAmount: orderData[3],
            package: orderData[0]
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (found) {
                    callback(null, found);
                } else {
                    callback(null, {
                        message: "No Data Found"
                    });
                }
            }
        });
    },

    findGstState: function (data, callback) {
        GstDetails.findOneAndUpdate({
            photographer: data.photographerId
        }, {
            $inc: {
                invoiceNumber: 00001
            }
        }, {
            new: true,
            upsert: true
        }).sort({
            invoiceNumber: -1
        }).deepPopulate('photographer').exec(function (err, data1) {
            if (err) {
                callback(err, null);
            } else if (data1) {
                callback(null, data1);
                //         var emailData = {};
                //         emailData.amount = data1.packageAmount;
                //         emailData.filename = "invoice.ejs";
                //         emailData.name = data1.firstName;
                //         emailData.address = data1.address;
                //         emailData.state = data1.state;
                //         emailData.emailOfUser = data1.photographer.email;
                //         emailData.from = "admin@clickmania.in";
                //         emailData.fromname = "Clickmania Admin";
                //         emailData.subject = "Invoice Details";
                //         Config.email(emailData, function (err, emailRespo) {
                //             console.log("emailRespo", emailRespo);
                //             if (err) {
                //                 console.log(err);
                //                 callback(null, data1);
                //             } else if (emailRespo) {
                //                 callback(null, data1);
                //             } else {
                //                 callback(null, data1);
                //             }
                //         });
            } else {
                callback("Invalid data", null);
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);
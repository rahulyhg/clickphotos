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
    packageAmount: String
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
        console.log("photocontestId-----------------", photocontestId);
        GstDetails.findOneAndUpdate({
            _id: orderData[5]
        }, {
            packageAmount: orderData[4]
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
        console.log("photocontestId-----------------", photocontestId);
        GstDetails.findOneAndUpdate({
            _id: orderData[3]
        }, {
            packageAmount: orderData[2]
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
        console.log("photocontestId-----------------", photocontestId);
        GstDetails.findOneAndUpdate({
            _id: orderData[4]
        }, {
            packageAmount: orderData[3]
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
    }
};
module.exports = _.assign(module.exports, exports, model);
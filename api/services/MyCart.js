var schema = new Schema({
    photographer: {
        type: Schema.Types.ObjectId,
        ref: 'Photographer',
        index: true
    },
    photos: [{
        type: Schema.Types.ObjectId,
        ref: 'Photos',
        index: true
    }],
    total: Number,
    gst: Number
});

schema.plugin(deepPopulate, {
    populate: {
        photographer: {
            select: ""
        },
        photos: {
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MyCart', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "photos photographer", "photos photographer"));
var model = {

    addToCart: function (data, callback) {
        MyCart.find({
            photographer: data.photographer
        }).exec(function (err, found) {
            if (err) {
                callback(err, null)
            } else if (_.isEmpty(found)) {
                async.waterfall([
                        function (callback1) {
                            MyCart.saveData(data, function (err, found) {
                                if (err || _.isEmpty(found)) {
                                    callback1(err, "noData");
                                } else {
                                    callback1(null, found)
                                }
                            });
                        },
                        function (data1, callback2) {
                            Photos.findOneAndUpdate({
                                _id: data.photos
                            }, {
                                mycart: [data1._id]
                            }, {
                                new: true
                            }).exec(function (err, found) {
                                if (err || _.isEmpty(found)) {
                                    callback2(err, "noData");
                                } else {
                                    callback2(null, found)
                                }
                            });
                        }
                    ],
                    function (err, found) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        } else {
                            callback(null, "success");
                        }
                    });
                // callback(null,"NODATA")
            } else {
                _.forEach(found, function (cartData) {
                    console.log("cartData", cartData);
                })
                // callback(null, "already present")
            }
        })
    }
};
module.exports = _.assign(module.exports, exports, model);
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
    gst: Number,
    baseValue: {
        type: Number,
        default: 100
    }
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

    // addToCart: function (data, callback) {
    //     MyCart.find({
    //         photographer: data.photographer
    //     }).exec(function (err, found) {
    //         if (err) {
    //             callback(err, null)
    //         } else if (_.isEmpty(found)) {
    //             async.waterfall([
    //                     function (callback1) {
    //                         MyCart.saveData(data, function (err, found) {
    //                             if (err || _.isEmpty(found)) {
    //                                 callback1(err, "noData");
    //                             } else {
    //                                 callback1(null, found)
    //                             }
    //                         });
    //                     },
    //                     function (data1, callback2) {
    //                         Photos.findOneAndUpdate({
    //                             _id: data.photos
    //                         }, {
    //                             mycart: [data1._id]
    //                         }, {
    //                             new: true
    //                         }).exec(function (err, found) {
    //                             if (err || _.isEmpty(found)) {
    //                                 callback2(err, "noData");
    //                             } else {
    //                                 callback2(null, found)
    //                             }
    //                         });
    //                     }
    //                 ],
    //                 function (err, found) {
    //                     if (err) {
    //                         console.log(err);
    //                         callback(err, null);
    //                     } else {
    //                         callback(null, "success");
    //                     }
    //                 });
    //             // callback(null,"NODATA")
    //         } else {
    //             _.forEach(found, function (cartData) {
    //                 console.log("cartData", cartData);
    //             })
    //             // callback(null, "already present")
    //         }
    //     })
    // },

    /**
     * this function checks cart of particular photographer
     * @param {cart.photographer} input photographerId
     * @param {cart.photos} input photos
     * @param {callback} callback function with err and response
     */
    getCart: function (cart, callback) {
        MyCart.findOne({
            photographer: mongoose.Types.ObjectId(cart.photographer)
        }).deepPopulate("photos photos.categories photos.photographer").exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                // console.log("in getCart", data);
                callback(null, data);
            } else {
                callback(null, []);
            }
        })
    },

    /**
     * this function checks cart of paricular photographer
     * if cart is already present then push photos in cart
     * else create cart and add photo in cart
     * @param {cart.photographer} input photographerId
     * @param {cart.photos} input photos
     * @param {callback} callback function with err and response
     */
    addToCart: function (cart, callback) {
        MyCart.getCart(cart, function (err, data) {
            if (err) {
                console.log("in getCartErr", err);
                callback(err, null);
            } else {
                MyCart.findOneAndUpdate({
                    photographer: cart.photographer
                }, {
                    $push: {
                        photos: cart.photos
                    }
                }, {
                    new: true,
                    upsert: true
                }).deepPopulate("photos").exec(function (err, data) {
                    if (err) {
                        console.log("in findOneAndUpdate error", err)
                        callback(err, null);
                    } else if (!_.isEmpty(data)) {
                        callback(null, data)
                    } else {
                        callback(null, []);
                    }
                })
            }
        });
    },

    /**
     * this function to remove product from cart
     * @param {cart.photographer} input photographerId
     * @param {cart.photos} input photos
     * @param {callback} callback function with err and response
     */
    removeProduct: function (cart, callback) {
        MyCart.findOneAndUpdate({
            photographer: cart.photographer
        }, {
            $pull: {
                photos: cart.photos
            }
        }, {
            new: true
        }).deepPopulate("photos photos.categories photo.photographer").exec(function (err, cartData) {
            if (err) {
                console.log("err in removing product from cart");
                callback(err, null);
            } else if (!_.isEmpty(cartData)) {
                callback(null, cartData);
            } else {
                callback({
                    message: {
                        data: "Invalid credentials!for remove product"
                    }
                }, null);
            }
        })
    },
    /**
     * this function to delete cart after purchase
     * @param {cart.photographer} input photographerId
     * @param {callback} callback function with err and response
     */
    deleteCart: function (cart, callback) {
        MyCart.remove({
            photographer: cart.photographer
        }).exec(function (err, cartData) {
            if (err) {
                console.log("err in removing product from cart");
                callback(err, null);
            } else if (!_.isEmpty(cartData)) {
                callback(null, cartData);
            } else {
                callback({
                    message: {
                        data: "Invalid credentials!for remove product"
                    }
                }, null);
            }
        })
    },
};
module.exports = _.assign(module.exports, exports, model);
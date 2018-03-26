var schema = new Schema({
    photographer: {
        type: Schema.Types.ObjectId,
        ref: 'Photographer',
        index: true
    },
    categories: {
        type: Schema.Types.ObjectId,
        ref: "Categories"
    },
    image: String,
    keyword: [String],
    size: String,
    count: Number,
    status: {
        type: String,
        default: "Pending",
        enum: ['Pending', 'Approved', 'Rejected']
    },
    mycart: [{
        type: Schema.Types.ObjectId,
        ref: 'MyCart',
        index: true,
        key: "photos"
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        categories: {
            select: ""
        },
        photographer: {
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Photos', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "categories photographer", "categories photographer"));
var model = {

    searchPhotos: function (data, callback) {
        if (data.cat) {
            var pipeline = {
                $match: {
                    "keyword": {
                        $regex: data.keyword,
                        $options: "i"
                    },
                    "status": "Approved",
                    "categories": mongoose.Types.ObjectId(data.cat._id)
                }
            }
        } else {
            var pipeline = {
                $match: {
                    "keyword": {
                        $regex: data.keyword,
                        $options: "i"
                    },
                    "status": "Approved"
                }
            }
        }
        Photos.aggregate([pipeline], function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                callback(null, found)
            }
        });
    },

    getApprovedPhotos: function (data, callback) {
        var maxRow = Config.maxRow;
        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        Photos.find({
                status: 'Pending'
            }).sort({
                createdAt: -1
            })
            .deepPopulate("categories photographer")
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    if (err || _.isEmpty(found)) {
                        callback(err, "noData")
                    } else {
                        callback(null, found)
                    }
                });
    },

    downloadSelectedPhotos: function (data, callback) {
        async.eachSeries(data, function (photoId, cb2) {
            async.waterfall([
                    function (callback) {
                        Photos.findOne({
                            _id: photoId
                        }).exec(function (err, found) {
                            if (err || _.isEmpty(found)) {
                                callback(err, "noData");
                            } else {
                                callback(null, found)
                            }
                        });
                    },
                    function (data, callback) {
                        var count;
                        if (data.count) {
                            count = data.count + 1;
                        } else {
                            count = 1;
                        }
                        Photos.findOneAndUpdate({
                            _id: data._id
                        }, {
                            count: count
                        }, {
                            new: true
                        }).exec(function (err, found) {
                            if (err || _.isEmpty(found)) {
                                callback(err, "noData");
                            } else {
                                callback(null, found)
                            }
                        });
                    }
                ],
                function (err, found) {
                    if (err) {
                        console.log(err);
                        cb2(err, null);
                    } else {
                        cb2(null, found);
                    }
                });
        }, callback);
    },

    getAllPhotos: function (data, callback) {
        Photos.find({
            status: 'Approved'
        }, function (err, data) {
            if (err || _.isEmpty(data)) {
                callback(err, "noData")
            } else {
                callback(null, data)
            }
        })
    },

    getAllRelatedPhotos: function (data, callback) {
        Photos.find({
            categories: data.category,
            status: 'Approved'
        }, function (err, data) {
            if (err || _.isEmpty(data)) {
                callback(err, "noData")
            } else {
                callback(null, data)
            }
        })
    },
    /**
     * this function to get uploaded photo in virtual gallery which is 
     * approved by admin for partucular photographer
     * @param {photographerId} input photographerId
     * @param {callback} callback function with err and response
     */
    getAllPhotosOfPhotographer: function (photographerId, callback) {
        Photos.find({
            status: 'Approved',
            photographer: photographerId.photographerId
        }).exec(function (err, photos) {
            if (err || _.isEmpty(photos)) {
                callback(err, null);
            } else {
                callback(null, photos)
            }
        })
    },
    /**
     * this function to send mail after decline and accepting 
     * upload request
     * @param {photographer} input photographers Id
     * @param {callback} callback function with err and response
     */
    uploadPhotoMail: function (data, callback) {
        Photos.findOne({
            photographer: data.photographer
        }).deepPopulate("photographer").exec(function (err, photographer) {
            if (err) {
                callback(err, null);
            } else if (!_.isEmpty(photographer)) {

                var emailData = {};
                emailData.from = "admin@clickmania.in";
                emailData.name = photographer.photographer.name;
                emailData.email = photographer.photographer.email;
                emailData.filename = "uploadPhotoMail.ejs";
                emailData.subject = "upload photo";
                emailData.status = data.status;
                Config.email(emailData, function (err, emailRespo) {
                    if (err) {
                        console.log(err);
                        callback(err);
                    } else if (!_.isEmpty(emailRespo)) {
                        callback(null, emailRespo);
                    } else {
                        callback(null, "Invalid data");
                    }
                });
            } else {
                callback(null, false)
            }
        })
    },

    /**
     * this function to search photos according keyword and category
     * @param {data.keyword} input keyword
     * @param {data.category} input category Id
     * @param {callback} callback function with err and response
     */
    getSearchPhoto: function (data, callback) {
        if (data.keyword && data.category) {
            var pipeline = {
                $match: {
                    "keyword": {
                        $regex: data.keyword,
                        $options: "i"
                    },
                    "status": "Approved",
                    "categories": mongoose.Types.ObjectId(data.category)
                }
            }
        } else if (data.keyword && !data.category) {
            var pipeline = {
                $match: {
                    "keyword": {
                        $regex: data.keyword,
                        $options: "i"
                    },
                    "status": "Approved"
                }
            }
        } else if (!data.keyword && data.category) {
            var pipeline = {
                $match: {
                    "status": "Approved",
                    "categories": mongoose.Types.ObjectId(data.category)
                }
            }
        }
        Photos.aggregate([pipeline], function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                callback(null, found)
            }
        });
    }

};
module.exports = _.assign(module.exports, exports, model);
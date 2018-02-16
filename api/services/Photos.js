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
    }
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
        Photos.aggregate([{
            $match: {
                "keyword": {
                    $regex: data.keyword,
                    $options: "i"
                }
            }
        }], function (err, found) {
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
        },callback);
    },

    getAllPhotos:function(data,callback){
        Photos.find({
            status:'Approved'
        },function(err,data){
            if(err||_.isEmpty(data)){
                callback(err,"noData")
            }else{
                callback(null,data)
            }
        })
    },

    getAllRelatedPhotos:function(data,callback){
        Photos.find({
            categories:data.category
        },function(err,data){
            if(err||_.isEmpty(data)){
                callback(err,"noData")
            }else{
                callback(null,data)
            }
        })
    }
};
module.exports = _.assign(module.exports, exports, model);
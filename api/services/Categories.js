var schema = new Schema({
    name: {
        type: String,
        default: "",
        required: true
    },
    bigimage: {
        type: String,
        default: ""
    },
    smallimage: {
        type: String,
        default: ""
    },
    insideImage: {
        type: String,
        default: "",
        required: true
    },
    viewOtherCatImage: {
        type: String,
        default: "",
        required: true
    },
    order: {
        type: Number
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Categories', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    saveCategories: function (data, callback) {
        Categories.save({
            name: data.name,
            bigimage: data.bigimage,
            smallimage: data.smallimage,
            order: data.order
        }).exec(function (err, found) {

            if (err) {
                // console.log(err);
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

        })
    },

    removeCategories: function (data, callback) {
        Categories.remove({
                "_id": data._id,
            },
            function (err, updated) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    callback(null, updated);
                }
            });
    },


    findOneCategories: function (data, callback) {
        Categories.findOne({
            _id: data._id
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
        })
    },

    updateCategories: function (data, callback) {
        Categories.update({
            _id: data._id
        }, {
            name: data.name,
            bigimage: data.bigimage,
            smallimage: data.smallimage,
            order: data.order

        }, function (err, updated) {
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, updated);
            }
        });
    },

    getAll: function (data, callback) {
        Categories.find({
            _id: {
                $ne: data._id
            }
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
        })
    },

    findAllCategories: function (data, callback) {
        var maxRow = 20;
        var type = data.clientType;
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
        Categories.find({}) .order(options)
            .keyword(options)
            .page(options,function (err, found) {
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
        })
    }
};
module.exports = _.assign(module.exports, exports, model);
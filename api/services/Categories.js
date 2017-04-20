var schema = new Schema({
    name: {
        type: String,
        default: ""
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
        default: ""
    },
    viewOtherCatImage: {
        type: String,
        default: ""
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

        console.log(data);
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

        console.log("DATA", data);
        Categories.remove({

                "_id": data._id,
            },

            function (err, updated) {
                console.log(updated);
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
                    console.log("Found", found);
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

        console.log("DATA", data);

        Categories.update({
            _id: data._id
        }, {
            name: data.name,
            bigimage: data.bigimage,
            smallimage: data.smallimage,
            order: data.order

        }, function (err, updated) {
            console.log(updated);
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, updated);
            }
        });
    },

    getAll: function (data, callback) {
        Categories.find({}).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {

                if (found) {
                    console.log("Found", found);
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
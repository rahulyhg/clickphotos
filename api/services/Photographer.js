var schema = new Schema({
    name: String,
    profilePic: String,
    coverPic: String,
    uploadedImages: [{
        image: {
            type: String,
            default: ""
        },
        category: {
            type: String,
            default: ""
        }
    }],
    dateOfRagister: {
        type: Date
    },
    month: String,
    bio: String,
    pricing: String,
    email: {
        type: String,
        validate: validators.isEmail(),
        unique: true
    },
    password: {
        type: String,
        default: ""
    },
    package: {
        type: String,
        enum: ["Gold", "Silver"]
    },
    location: [String],
    speciality: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Categories",
        }],
        index: true
    },
    status: {
        type: Boolean,
        default: false
    },
    isactive: {
        type: Boolean
    }
});

schema.plugin(deepPopulate, {
    populate: {
        speciality: {
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Photographer', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "speciality", " speciality"));
var model = {

    getPhotographers: function (data, callback) {
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
        Photographer.find({
                status: true
            }).sort({
                createdAt: -1
            })
            .deepPopulate("location speciality")
            .order(options)
            .keyword(options)
            .page(options,
                function (err, found) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback("Invalid data", null);
                    }
                });
    },

    deleteFeaturedPhotographer: function (data, callback) {

        console.log("DATA", data);

        Photographer.update({
            _id: data._id
        }, {
            status: false
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

    doLogin: function (data, callback) {
        console.log("data", data)
        Photographer.findOne({
            email: data.email,
            password: md5(data.password)
        }).exec(function (err, found) {
            if (err) {

                callback(err, null);
            } else {
                if (found) {
                    var foundObj = found.toObject();
                    delete foundObj.password;
                    callback(null, foundObj);
                } else {
                    callback({
                        message: "Incorrect Credentials!"
                    }, null);
                }
            }

        });
    },

    registerUser: function (data, callback) {
        var photographer = this(data);
        photographer.password = md5(photographer.password);
        photographer.save(function (err, created) {
            if (err) {
                callback(err, null);
            } else if (created) {
                callback(null, created);
            } else {
                callback(null, {});
            }
        });
    },

    uploadPhotos: function (data, callback) {
        console.log(data);
        Photographer.update({
            _id: data._id
        }, {
            $push: {

                uploadedImages: {
                    $each: [{
                        image: data.image,
                        category: data.category
                    }]
                }
            }
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

    updateToFeaturePhotographer: function (data, callback) {
        console.log("DATA", data);
        // var date = new Date();
        // var monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // var mon = monthNames[date.getMonth() + 1];
        // var m = date.getMonth() + 1;
        // console.log("month", mon);
        Photographer.update({
            _id: data._id
        }, {
            status: true,
            dateOfRagister: new Date(),
            month: data.mon
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

    findPhotographer: function (data, callback) {
        console.log("data", data)
        Photographer.find({
            status: true
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (found) {
                    callback(null, found);
                } else {
                    callback({
                        message: "Incorrect Credentials!"
                    }, null);
                }
            }

        });
    },

    saveData: function (data, callback) {
        //        delete data.password;
        var photographer = this(data);
        if (data._id) {
            this.findOneAndUpdate({
                _id: data._id
            }, data).exec(function (err, updated) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (updated) {
                    console.log("hey", updated);
                    callback(null, updated);
                } else {
                    callback(null, {});
                }
            });
        }
    },

    removeUpldImg: function (data, callback) {

        console.log("DATA", data);
        Photographer.update({

            "_id": data._id,
            "uploadedImages": {
                $elemMatch: {
                    "_id": data.id
                }
            }
        }, {
            $pull: {
                uploadedImages: {
                    "_id": data.id
                }
            }
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

    getLastFeaturedPhotographer: function (data, callback) {

        Photographer.find({
            status: true,
        }).sort({
            dateOfRagister: -1
        }).limit(1).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (found) {
                console.log("found", found);
                var newreturns = {};
                var checkmonth = moment(found.dateOfRagister).format();
                var currentYear = moment(checkmonth).year();
                var nextYear = Number(currentYear) + 1;
                console.log("checkmonth", checkmonth);
                console.log("currentYear", currentYear);
                console.log("nextYear", nextYear);
                Photographer.find({
                    month: data.month,
                    dateOfRagister: {
                        $gte: new Date(currentYear, 01, 01),
                        $lt: new Date(nextYear, 12, 31)
                    }
                }).count(function (err, count) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        //newreturns.totalpages = Math.ceil(count / data.pagesize);
                        if(found){
                        console.log("found ", found);
                        }
                        newreturns.lastDateOfRegister = found[0].dateOfRagister;
                        newreturns.totalItems = count;
                        console.log("newreturns", newreturns);
                        callback(null, newreturns);

                    }
                })
            } else {
                callback(null, {
                    message: "No Data Found"
                });
            }
        })
    },

    getFeaturePhotographer: function (data, callback) {
        this.find({
            status: true
        }).sort({
            month: -1
        }).deepPopulate("speciality").exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (found) {
                if (_.isEmpty(found)) {
                    callback(null, {});
                } else {
                    console.log("Found", found);
                    callback(null, found);
                }
            } else {
                callback(null, {
                    message: "No Data Found"
                });
            }
        })
    },

    getAllPhotographers: function (data, callback) {
        Photographer.find({}).exec(function (err, found) {
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
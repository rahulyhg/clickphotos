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
    location: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Location",
        }],
        index: true
    },
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
        type: Boolean,
        default: false
    }
});

schema.plugin(deepPopulate, {
    populate: {
        location: {
            select: ""
        },
        speciality: {
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Photographer', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "location speciality", "location speciality"));
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
            })

            .sort({
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


    updatePhotographer: function (data, callback) {

        console.log("DATA", data);

        Photographer.update({
            _id: data._id
        }, {
            isactive: data.isactive
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

    updatePhotographerPackage: function (data, callback) {
        var packageType = data.package;
        console.log("DATA", data);
        Photographer.update({
            _id: data._id
        }, {
            package: packageType
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

    updatePhotographerDetail: function (data, callback) {

        console.log("DATA", data);

        Photographer.update({
            _id: data._id
        }, {
            name: data.name,
            location: data.location,
            speciality: data.speciality,
            bio: data.bio,
            pricing: data.pricing
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

    // uploadPhotos: function (data, callback) {

    //     console.log("DATA", data);

    //     Photographer.update({
    //         _id: data._id,
    //     }), {
    //         $push: {
    //             uploadedImages: {
    //                 $each: data.photos
    //             }
    //         }

    //     }.exec(function (err, updated) {
    //         console.log(updated);
    //         if (err) {
    //             console.log(err);
    //             callback(err, null);
    //         } else {
    //             callback(null, updated);
    //         }
    //     });
    // },

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

    updateCoverPic: function (data, callback) {
        console.log("DATA", data);
        Photographer.update({
            _id: data._id
        }, {
            coverPic: data.coverPic
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

    updateProfilePic: function (data, callback) {
        console.log("DATA", data);
        Photographer.update({
            _id: data._id
        }, {
            profilePic: data.profilePic
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

     updateToFeaturePhotographer: function (data, callback) {
        console.log("DATA", data);
        Photographer.update({
            _id: data._id
        }, {
            status: true
        }, function (err, updated) {
            console.log(updated);
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                callback(null, updated);
            }
        });
    }


};
module.exports = _.assign(module.exports, exports, model);
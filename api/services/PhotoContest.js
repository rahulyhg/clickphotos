var schema = new Schema({
    contestName: String,
    contestExpDate: Date,
    image: String,
    status: {
        type: String,
        enum: ["true", "false"]
    },
    winingPrice: Number,
    contestCategory: {
        type: String,
        enum: ["three", "six", "nine"]
    },
    contestParticipant: [{
        photographerId: {
            type: Schema.Types.ObjectId,
            ref: "Photographer"
        },
        Photos: [String]
    }],
    winner: {
        type: Schema.Types.ObjectId,
        ref: "Photographer"
    }
});

schema.plugin(deepPopulate, {
    populate: {
        "contestParticipant.photographerId": {
            select: ""
        },
        winner: {
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('PhotoContest', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "contestParticipant.photographerId winner", "contestParticipant.photographerId winner"));
var model = {

    findOnePhotoContest: function (data, callback) {
        PhotoContest.findOne({
            _id: data._id
        }).deepPopulate("contestParticipant").exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (found) {
                    PhotoContest.aggregate([{
                            $unwind: {
                                path: "$contestParticipant",
                                "preserveNullAndEmptyArrays": true
                            }
                        },
                        {
                            $lookup: {
                                "from": "photographers",
                                "localField": "contestParticipant",
                                "foreignField": "_id",
                                "as": "contest_Data"
                            }
                        },
                        {
                            $unwind: {
                                path: "$contest_Data",
                                "preserveNullAndEmptyArrays": true
                            }
                        },
                        {
                            $match: {
                                "contest_Data.contestPhotos.contestId": ObjectId(data._id)
                            }
                        }
                    ], function (err, found1) {
                        if (err) {
                            // console.log(err);
                            callback(err, null);
                        } else {
                            if (_.isEmpty(found1)) {
                                callback(null, "noDataFound1");
                            } else {
                                callback(null, found1);
                            }
                        }
                    });
                    // callback(null, found);
                } else {
                    callback(null, {
                        message: "No Data Found"
                    });
                }
            }

        })
    },

    removeContestUsers: function (data, callback) {
        console.log("DATA", data);
        PhotoContest.update({
            "_id": data._id,
            "contestParticipant": mongoose.Types.ObjectId(data.testid)
        }, {
            $pull: {
                contestParticipant: mongoose.Types.ObjectId(data.testid)
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

    findPhotographer: function (data, callback) {
        //console.log("DATA", data);
        PhotoContest.findOne({
            _id: data._id
        }).deepPopulate('contestParticipant.photographerId').exec(function (err, found) {
            // console.log(found);
            if (err) {
                //console.log(err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, "noDataFound");
            } else {
                callback(null, found.contestParticipant);
            }
        });
    },

    findPhotographerForWinner: function (data, callback) {
        //console.log("DATA", data);
        PhotoContest.findOne({
            _id: data._id
        }).deepPopulate('contestParticipant.photographerId').select('contestParticipant.photographerId').exec(function (err, found) {
            // console.log(found);
            if (err) {
                //console.log(err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, "noDataFound");
            } else {
                var test = [];
                _.each(found.contestParticipant, function (n) {
                    test.push(n.photographerId);
                });
                //console.log("found.contestParticipant.photographerId",found.contestParticipant)
                //console.log("test",test);
                callback(null, test);
            }
        });
    },

    allUpdate: function (data, callback) {
        // delete data.password;
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

    //

    findPhotoConetst: function (data, callback) {
        PhotoContest.findOne({
            status: true
        }).deepPopulate('contestParticipant.photographerId').exec(function (err, found) {
            if (err) {
                // console.log(err);
                callback(err, null);
            } else {
                if (_.isEmpty(found)) {
                    callback(null, "noDataFound");
                } else {
                    callback(null, found);
                }
            }
        });
    },

    findAllPhotoConetst: function (data, callback) {
        PhotoContest.find({}).sort({
            createdAt: -1
        }).limit(2).deepPopulate('contestParticipant.photographerId').exec(function (err, found) {
            if (err) {
                // console.log(err);
                callback(err, null);
            } else {
                if (_.isEmpty(found)) {
                    callback(null, "noDataFound");
                } else {
                    callback(null, found);
                }
            }
        });
    },

    uploadContestPhotos: function (data, callback) {
        PhotoContest.update({
            _id: data._id,
            contestParticipant: {
                $elemMatch: {
                    photographerId: data.id
                }
            }
        }, {
            $push: {
                "contestParticipant.$.Photos": {
                    $each: data.photos
                }
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
        });
    },

    buyPhotoContestPackage: function (data, callback) {
        console.log(data);
        var photocontestId = data.Description.split("/");
        console.log("photocontestId", photocontestId);
        PhotoContest.findOneAndUpdate({
            _id: photocontestId[1]
        }, {
            $push: {
                contestParticipant: {
                    photographerId: photocontestId[2]
                }
            }
        }, {
            new: true
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


    findAllPhotographersInContest: function (data, callback) {
        PhotoContest.aggregate([{
                $unwind: {
                    path: "$contestParticipant",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $match: {
                    "contestParticipant.photographerId": ObjectId(data.photographerId)
                }
            }
        ], function (err, found) {
            if (err) {
                // console.log(err);
                callback(err, null);
            } else {
                if (_.isEmpty(found)) {
                    callback(null, "noDataFound");
                } else {
                    callback(null, found);
                }
            }
        });
    },

    addcontestParticipant: function (data, callback) {
        var photocontestId = data.Description.split("/");
        console.log("photocontestId-----------------", photocontestId);
        Photographer.findOneAndUpdate({
            _id: photocontestId[2]
        }, {
            $push: {
                "contest": {
                    $each: photocontestId[1]
                }
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
        });
    }

};
module.exports = _.assign(module.exports, exports, model);
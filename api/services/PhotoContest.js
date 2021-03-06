var JSZip = require("jszip");
var FileSaver = require('file-saver');
var schema = new Schema({
    contestName: String,
    contestExpDate: Date,
    image: String,
    status: {
        type: String,
        enum: ["true", "false"]
    },
    winingPrice: String,
    contestCategory: {
        type: String,
        enum: ["three", "six", "nine"]
    },
    contestParticipant: [{
        photographerId: {
            type: Schema.Types.ObjectId,
            ref: "Photographer"
        },
        Photos: [String],
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order"
        }
    }],
    winner: {
        type: Schema.Types.ObjectId,
        ref: "Order"
    }
});

schema.plugin(deepPopulate, {
    populate: {
        "contestParticipant.photographerId": {
            select: ""
        },
        "contestParticipant.orderId": {
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

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "contestParticipant.photographerId winner contestParticipant.orderId", "contestParticipant.photographerId winner contestParticipant.orderId "));
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
        PhotoContest.update({
            "_id": data._id,
            "contestParticipant": mongoose.Types.ObjectId(data.testid)
        }, {
            $pull: {
                contestParticipant: mongoose.Types.ObjectId(data.testid)
            }
        }, function (err, updated) {
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
        }).deepPopulate('contestParticipant.photographerId').exec(function (err, found) {
            // console.log(found);
            if (err) {
                //console.log(err);
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, "noDataFound");
            } else {
                var test = [];
                _.each(found.contestParticipant, function (n) {
                    test.push(n);
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
                    photographerId: data.id,
                    orderId: data.oid
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
        var photocontestId = data.Description.split("/");
        PhotoContest.findOneAndUpdate({
            _id: photocontestId[2]
        }, {
            $push: {
                contestParticipant: {
                    photographerId: photocontestId[1],
                    orderId: photocontestId[5]
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
                $lookup: {
                    "from": "orders",
                    "localField": "contestParticipant.orderId",
                    "foreignField": "_id",
                    "as": "contestParticipant.orderId"
                }
            },
            {
                $unwind: {
                    path: "$contestParticipant.orderId",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $match: {
                    "contestParticipant.photographerId": ObjectId(data.photographerId)
                }
            },
            {
                $project: {
                    _id: "$_id",
                    contestName: "$contestName",
                    contestParticipant: {
                        orderId: "$contestParticipant.orderId._id",
                        orderDescription: "$contestParticipant.orderId.description",
                        Photos: "$contestParticipant.Photos"
                    }
                }
            }



            // {
            //      $match: {
            //         "contestParticipant.orderId._id": ObjectId(data.orderId)
            //      }
            // }
        ], function (err, found) {
            if (err) {
                // console.log(err);
                callback(err, null);
            } else {
                if (_.isEmpty(found)) {
                    callback(null, "noDataFound");
                } else {

                    var finalResult = _.map(found, function (n) {
                        var temp = _.split(n.contestParticipant.orderDescription,  '/', 1);

                        if (temp[0] == "PackageUpdateForThree") {
                            n.contestParticipant.orderDescription = [0, 1, 2];
                        } else if (temp[0] == "PackageUpdateForSix") {
                            n.contestParticipant.orderDescription = [0, 1, 2, 3, 4, 5];
                        } else {
                            n.contestParticipant.orderDescription = [];
                        }

                        return n;
                    })
                    callback(null, finalResult);
                }
            }
        });
    },
    //bulk download
    // bulkDownload: function (data, res) {
    //     PhotoContest.findOne({
    //         _id: data.id
    //     }).deepPopulate('contestParticipant.photographerId').exec(function (err, found) {
    //         if (err) {
    //             // console.log(err);
    //             res.callback(err, null);
    //         } else {
    //             if (_.isEmpty(found)) {
    //                 res.callback(null, "noDataFound");
    //             } else {

    //                 // var photoZip = zip.folder(found.contestName);
    //                 async.each(found.contestParticipant, function (file, callback) {
    //                         if (file.photographerId) {
    //                             // console.log("file--- ", file.photographerId.name);
    //                             var JSZip = require("jszip");
    //                             var zip = new JSZip();
    //                             var folder = "./.tmp/";
    //                             var path = file.photographerId.name + ".zip";
    //                             var finalPath = folder + path;
    //                             var files = [];
    //                             async.eachSeries(file.Photos, function (image, callback) {
    //                                 request(global["env"].realHost + '/api/upload/readFile?file=' + image).pipe(fs.createWriteStream(image)).on('finish', function (images) {
    //                                     // JSZip generates a readable stream with a "end" event,
    //                                     // but is piped here in a writable stream which emits a "finish" event.
    //                                     fs.readFile(image, function (err, imagesData) {
    //                                         if (err) {
    //                                             res.callback(err, null);
    //                                         } else {
    //                                             //Remove image
    //                                             fs.unlink(image);
    //                                             // zip.file("file", content); ... and other manipulations
    //                                             zip.file(image, imagesData);
    //                                             callback();
    //                                         }
    //                                     });
    //                                 });
    //                             }, function () {
    //                                 //Generate Zip file
    //                                 zip.generateNodeStream({
    //                                         type: 'nodebuffer',
    //                                         streamFiles: true
    //                                     })
    //                                     .pipe(fs.createWriteStream(finalPath))
    //                                     .on('finish', function (zipData) {
    //                                         // JSZip generates a readable stream with a "end" event,
    //                                         // but is piped here in a writable stream which emits a "finish" event.
    //                                         fs.readFile(finalPath, function (err, zip) {
    //                                             if (err) {
    //                                                 res.callback(err, null);
    //                                             } else {
    //                                                 res.set('Content-Type', "application/octet-stream");
    //                                                 res.set('Content-Disposition', "attachment;filename=" + path);
    //                                                 res.send(zip);
    //                                                 // fs.unlink(finalPath);
    //                                                 console.log("zip", zip);
    //                                                 console.log("finalPath", finalPath);

    //                                             }
    //                                         });
    //                                     });
    //                             });
    //                         }
    //                     },
    //                     function (err) {
    //                         if (err) {
    //                             console.log('A file failed to process');
    //                         } else {
    //                             console.log('All files have been processed successfully');
    //                         }
    //                     });
    //             }
    //         }
    //     });
    // },

    addcontestParticipant: function (data, callback) {
        var photocontestId = data.Description.split("/");
        Photographer.findOneAndUpdate({
            _id: photocontestId[1]
        }, {
            $push: {
                "contest": photocontestId[2],
            },
            photoContestPackage: photocontestId[0]
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
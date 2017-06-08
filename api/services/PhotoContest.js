var schema = new Schema({
    contestName: String,
    contestExpDate: Date,
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
        type: Schema.Types.ObjectId,
        ref: "Photographer"
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        contestParticipant: {
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('PhotoContest', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "contestParticipant", "contestParticipant"));
var model = {

    findOnePhotoContest: function (data, callback) {
        PhotoContest.findOne({
            _id: data._id
        }).deepPopulate("contestParticipant").exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (found) {
                    // console.log("Found", found);
                    callback(null, found);
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

            "contestParticipant": {
                $elemMatch: {
                    _id: data.testid
                }
            }
        }, {
            $pull: {
                contestParticipant: {
                    _id: data.testid
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
    }
};
module.exports = _.assign(module.exports, exports, model);
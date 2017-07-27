var request = require("request");
var cron = require("node-cron");
var sha512 = require('sha512');
var curl = require('curlrequest');
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
    reviewList: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "Photographer"
        },
        review: [{
            comment: String,
            date: {
                type: String,
                default: Date.now()
            },
            selfUser: Boolean
        }]
    }],
    dateOfRagister: {
        type: Date
    },
    silverPackageBroughtDate: {
        type: Date
    },
    goldPackageBroughtDate: {
        type: Date
    },
    month: String,
    year: String,
    bio: String,
    pricing: [String],
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
        enum: ["Gold", "Silver", ""]
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
    },
    enquiry: [{
        enquiryUser: {
            type: Schema.Types.ObjectId,
            ref: "Photographer"
        },
        enquirerName: String,
        enquirerEmail: String,
        enquirerMobileNo: String,
        enquirerDate: Date,
        enquirerMsg: String,
        enquirercntryCode: Number
    }],
    otp: String,
    otpTime: Date,
    verifyAcc: Boolean,

    //photo contest
    contest: [{
        type: Schema.Types.ObjectId,
        ref: "PhotoContest"
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        speciality: {
            select: ""
        },
        "reviewList.user": {
            select: ''
        },
        "contestPhotos.contestId": {
            select: ''
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Photographer', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "speciality reviewList.user contestPhotos.contestId", " speciality reviewList.user contestPhotos.contestId"));
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

    //backend get all photographers
    getAllPhotographersForBack: function (data, callback) {
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
                verifyAcc: true
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
        // console.log("data", data)
        Photographer.findOne({
            email: data.email,
            password: md5(data.password),
            verifyAcc: true
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
                console.log("data", created);
                var emailData = {};
                emailData.email = created.email;
                emailData.filename = "welcome.ejs";
                emailData.name = created.name;
                //emailData.serviceRequest = data1.serviceRequest;
                // emailData.email = data1.email;
                //emailData.mobile = data1.mobile;
                //emailData.query = data1.query;
                emailData.from = "admin@clickmania.in";
                emailData.fromname = "Clickmania Admin";
                emailData.subject = "Welcome To Clickmania";
                console.log("email data : ", emailData);
                Config.email(emailData, function (err, emailRespo) {
                    console.log("emailRespo", emailRespo);
                    if (err) {
                        console.log(err);
                        callback(null, created);
                    } else if (emailRespo) {
                        // callback(null, "Contact us form saved successfully!!!");
                        var emailData = {};
                        emailData.email = created.email;
                        emailData.filename = "upgradeprofile.ejs";
                        emailData.name = created.name;
                        //emailData.serviceRequest = data1.serviceRequest;
                        // emailData.email = data1.email;
                        //emailData.mobile = data1.mobile;
                        //emailData.query = data1.query;
                        emailData.from = "admin@clickmania.in";
                        emailData.fromname = "Clickmania Admin";
                        emailData.subject = "Clickmania Update Profile";
                        console.log("email data : ", emailData);
                        Config.email(emailData, function (err, emailRespo) {
                            console.log("emailRespo", emailRespo);
                            if (err) {
                                console.log(err);
                                callback(null, created);
                            } else if (emailRespo) {
                                callback(null, created);
                            } else {
                                callback(null, created);
                            }
                        });
                    } else {
                        callback(null, created);
                    }
                });
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
        Photographer.findOneAndUpdate({
            _id: data.Description.split("/")[1]
        }, {
            status: true,
            dateOfRagister: new Date(),
            month: data.Description.split("/")[2],
            year: data.Description.split("/")[3]
        }, {
            new: true
        }, function (err, updated) {
            console.log(updated);
            if (err) {
                console.log(err);
                callback(err, null);
            } else {
                console.log("data", updated);
                var emailData = {};
                emailData.email = updated.email;
                emailData.filename = "featuredpht.ejs";
                emailData.name = updated.name;
                //emailData.serviceRequest = data1.serviceRequest;
                // emailData.email = data1.email;
                //emailData.mobile = data1.mobile;
                //emailData.query = data1.query;
                emailData.from = "admin@clickmania.in";
                emailData.fromname = "Clickmania Admin";
                emailData.subject = "Feature Photographer";
                console.log("email data : ", emailData);
                Config.email(emailData, function (err, emailRespo) {
                    console.log("emailRespo", emailRespo);
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (emailRespo) {
                        callback(null, updated);
                    } else {
                        callback("Invalid data", null);
                    }
                });
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
                console.log("found---", found);
                var newreturns = {};
                var checkmonth = moment(found.dateOfRagister).format();
                var currentYear = moment(checkmonth).year();
                var nextYear = Number(currentYear) + 1;
                console.log("checkmonth", checkmonth);
                console.log("currentYear", currentYear);
                console.log("nextYear", nextYear);
                var match = {};
                if (!_.isEmpty(found)) {
                    var match = {
                        month: found[0].month,
                        dateOfRagister: {
                            $gte: new Date(currentYear, 01, 01),
                            $lt: new Date(nextYear, 12, 31)
                        }
                    }
                }
                Photographer.find(match).count(function (err, count) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        //newreturns.totalpages = Math.ceil(count / data.pagesize);
                        if (_.isEmpty(found)) {
                            console.log("found---- ", found);
                            newreturns.totalItems = 0;
                            console.log("newreturns", newreturns);
                            callback(null, newreturns);
                        } else {
                            newreturns.lastDateOfRegister = found[0].dateOfRagister;
                            newreturns.lastMonth = found[0].month;
                            newreturns.lastYear = found[0].year;
                            newreturns.totalItems = count;
                            console.log("newreturns", newreturns);
                            callback(null, newreturns);
                        }
                    }
                })
            } else {
                callback(null, {
                    message: "No Data Found"
                });
            }
        })
    },

    getRelatedPhotographers: function (data, callback) {
        Photographer.find({
            speciality: {
                $in: data.speciality
            }
        }).deepPopulate("speciality").exec(function (err, found) {
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

    //google api for get city unused
    getCities: function (data, callback) {
        var api = sails.api;
        request({
            // url: "https://www.vamaship.com/api/surface/book",
            url: "https://maps.googleapis.com/maps/api/place/autocomplete/json?placeid=ChIJkbeSa_BfYzARphNChaFPjNcIndia&input=M&types=(cities)&language=en&key=" + api,
            method: "POST"
            //  headers: {
            //    "Content-Type": "application/json",
            //    "Authorization": "Bearer " + api
            //  },
            //   body: JSON.stringify(userData)
        }, function (err, httpResponse, body) {
            // console.log("err : ",err,"httpResponse",httpResponse);
            console.log("err ::::::::::: ", err);
            // console.log("httpResponse::::::::::: ", httpResponse);
            console.log("body::::::::::::: ", body);
            var bodyData = JSON.parse(body);
            console.log("bodyData", bodyData);
            callback(err, bodyData);
        });
    },
    //google api for get city unused end

    getFeatPhotographer: function (data, callback) {
        this.find({
            status: true,
            month: data.month
        }).sort({
            month: -1
        }).limit(12).deepPopulate("speciality").exec(function (err, found) {
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

    getPhotographersByCategories: function (data, callback) {
        //console.log("data--------------------------------------",data);
        if (!_.isEmpty(data.speciality) && !_.isEmpty(data.location)) {
            var pipeline = [
                // Stage 1
                {
                    $lookup: {
                        "from": "categories",
                        "localField": "speciality",
                        "foreignField": "_id",
                        "as": "specialities"
                    }
                },
                // Stage 2
                {
                    $match: {
                        "specialities.name": data.speciality
                    }
                },

                //stage 3
                {
                    $match: {
                        "location": data.location
                    }
                },
            ]
        } else if (_.isEmpty(data.speciality) && !_.isEmpty(data.location)) {
            var pipeline = [
                // Stage 1
                {
                    $match: {
                        "location": data.location
                    }
                }
            ]
        } else if (!_.isEmpty(data.speciality) && _.isEmpty(data.location)) {
            var pipeline = [
                // Stage 1
                {
                    $lookup: {
                        "from": "categories",
                        "localField": "speciality",
                        "foreignField": "_id",
                        "as": "specialities"
                    }
                },
                // Stage 2
                {
                    $match: {
                        "specialities.name": data.speciality
                    }
                }
            ]

        }

        Photographer.aggregate(pipeline, function (err, found) {
            // console.log("found",found);
            if (err) {
                console.log(err);
                callback(err, null);
            } else if (found) {
                console.log("Photographer data : ", found)
                callback(null, found);
            } else {
                callback(null, "Invalid found");
            }
        });
    },

    // saveBottlesPhotos: function (data, callback) {

    //     console.log(data);
    //     Photographer.findOneAndUpdate({
    //         _id: data._id
    //     }, {
    //         $push: {

    //             reviewList: {
    //                 $each: [{
    //                     user: data.user,
    //                     review: data.review
    //                 }]
    //             }
    //         }
    //     }).exec(function (err, found) {
    //         if (err) {
    //             // console.log(err);
    //             callback(err, null);
    //         } else {

    //             if (found) {

    //                 callback(null, found);
    //             } else {
    //                 callback(null, {
    //                     message: "No Data Found"
    //                 });
    //             }
    //         }

    //     })
    // },

    clickFilter: function (data, callback) {
        //console.log("Datataaaa", data)
        if (!_.isEmpty(data.pricing)) {
            //console.log("inside pricing")
            var matchArr = {
                pricing: {
                    $in: data.pricing
                }
            }
            if (!_.isEmpty(data.location)) {
                //console.log("inside Lcoaction1")
                var matchArr = {
                    pricing: {
                        $in: data.pricing
                    },
                    location: {
                        $in: data.location
                    }
                }
            }
        }
        if (!_.isEmpty(data.location)) {
            // console.log("inside location2")

            var matchArr = {
                location: {
                    $in: data.location
                }
            }
            if (!_.isEmpty(data.pricing)) {
                //console.log("inside locationlocation ")

                var matchArr = {
                    pricing: {
                        $in: data.pricing
                    },
                    location: {
                        $in: data.location
                    }
                }
            }
        }
        Photographer.find(matchArr).deepPopulate("speciality").exec(function (err, found) {
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

    //emailers

    sendEnq: function (data, callback) {
        console.log("data", data);
        // var contact = this(data);
        Photographer.findOne({
            _id: data._id
        }).exec(function (err, data1) {
            console.log("data1", data1, err);
            if (err) {
                callback(err, null);
            } else if (data1) {
                console.log("data", data1);
                var emailData = {};
                //console.log("data1-----", data1.enquiry.length);
                //console.log("data1-----", data1.enquiry[data1.enquiry.length - 1]);

                var ind = data1.enquiry.length - 1;
                emailData.email = data1.email;
                emailData.filename = "enquiry.ejs";
                emailData.name = data1.name;
                emailData.enqName = data1.enquiry[ind].enquirerName;
                emailData.emailOfEnquirer = data1.enquiry[ind].enquirerEmail;
                //emailData.serviceRequest = data1.serviceRequest;
                // emailData.email = data1.email;
                emailData.enquirercntryCode = data1.enquiry[ind].enquirercntryCode;
                emailData.mobile = data1.enquiry[ind].enquirerMobileNo;
                emailData.query = data1.enquiry[ind].enquirerMsg;
                emailData.date = data1.enquiry[ind].enquirerDate;
                emailData.from = "admin@clickmania.in";
                emailData.fromname = "Clickmania Admin";
                emailData.subject = "A potential Client has shown interest in you";
                // console.log("email data : ", emailData);
                Config.email(emailData, function (err, emailRespo) {
                    console.log("emailRespo", emailRespo);
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (emailRespo) {
                        callback(null, "Contact us form saved successfully!!!");
                    } else {
                        callback("Invalid data", null);
                    }
                });

            } else {
                callback("Invalid data", null);
            }
        });
    },

    //verify email and send otp on email

    sendOtp: function (data, callback) {
        // console.log("data", data)
        var emailOtp = (Math.random() + "").substring(2, 6);
        var foundData = {};
        Photographer.findOneAndUpdate({
            email: data.email
        }, {
            otp: emailOtp
        }, {
            new: true
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (found) {
                    var emailData = {};
                    emailData.from = "admin@clickmania.in";
                    emailData.fromname = "Clickmania Admin";
                    emailData.name = found.name;
                    emailData.email = found.email;
                    emailData.otp = emailOtp;
                    emailData.filename = "otpemail.ejs";
                    emailData.subject = "Clickmania OTP";
                    console.log("emaildata", emailData);
                    Config.email(emailData, function (err, emailRespo) {
                        if (err) {
                            console.log(err);
                            callback(null, err);
                        } else if (emailRespo) {
                            // foundData.otp = emailOtp;
                            // foundData.id = found._id;
                            callback(null, found);
                        } else {
                            callback(null, "Invalid data");
                        }
                    });
                    //callback(null, found);
                } else {
                    callback({
                        message: "Incorrect Credentials!"
                    }, null);
                }
            }

        });
    },

    updatePass: function (data, callback) {
        console.log("DATA-----", data);
        Photographer.findOneAndUpdate({
            _id: data._id
        }, {
            password: md5(data.password)
        }, {
            new: true
        }, function (err, updated) {
            console.log(updated);
            if (err) {
                console.log("error in updatepass-----", err);
                callback(err, null);
            } else {
                console.log(" successfully-----", updated);
                callback(null, updated);
            }
        });
    },

    verifyOTPForResetPass: function (data, callback) {
        Photographer.findOne({
            otp: data.otp,
        }).exec(function (error, found) {
            if (error || found == undefined) {
                callback(error, null);
            } else {
                if (_.isEmpty(found)) {
                    callback(null, {
                        message: "No data found"
                    });
                } else {
                    callback(null, found);
                }
            }
        })
    },

    // sendOtpForSignUp: function (data, callback) {
    //     var emailOtp = (Math.random() + "").substring(2, 6);
    //     var foundData = {};
    //     var emailData = {};
    //     emailData.from = "admin@clickmania.in";
    //     emailData.name = data.name;
    //     emailData.email = data.email;
    //     emailData.otp = emailOtp;
    //     emailData.filename = "otpForSignUp.ejs";
    //     emailData.subject = "Clickmania OTP";
    //     console.log("emaildata", emailData);
    //     Config.email(emailData, function (err, emailRespo) {
    //         if (err) {
    //             console.log(err);
    //             callback(null, err);
    //         } else if (emailRespo) {
    //             foundData.otp = emailOtp;
    //             callback(null, foundData);
    //         } else {
    //             callback(null, "Invalid data");
    //         }
    //     });
    // },

    //send otp
    checkPhotographersForOtp: function (data, callback) {
        var otpData = this(data);
        otpData.otpTime = new Date();
        otpData.verifyAcc = false;
        otpData.password = md5(otpData.password);
        var emailOtp = (Math.random() + "").substring(2, 6);
        otpData.otp = emailOtp;
        Photographer.findOne({
            email: data.email
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (!found) {
                    // dataObj._id = new mongoose.mongo.ObjectID();
                    otpData.save(function (err, updated) {
                        if (err) {
                            console.log("errrrrrrr", err);
                            callback(err, null);
                        } else if (updated) {
                            var foundData = {};
                            var emailData = {};
                            emailData.from = "admin@clickmania.in";
                            emailData.name = otpData.name;
                            emailData.email = otpData.email;
                            emailData.otp = emailOtp;
                            emailData.filename = "otpForSignUp.ejs";
                            emailData.subject = "Clickmania OTP";
                            console.log("emaildata", emailData);
                            Config.email(emailData, function (err, emailRespo) {
                                if (err) {
                                    console.log(err);
                                    callback(null, err);
                                } else if (emailRespo) {
                                    //foundData.emailRespo = emailRespo;
                                    //foundData.updated = updated;
                                    callback(null, updated);
                                } else {
                                    callback(null, "Invalid data");
                                }
                            });
                            // callback(null, updated);
                        } else {
                            callback(null, {
                                message: "No Data Found"
                            });
                        }
                    });
                } else {
                    Photographer.findOneAndUpdate({
                        email: otpData.email,
                        verifyAcc: false
                    }, {
                        otp: emailOtp
                    }, {
                        new: true
                    }, function (err, updated) {
                        if (err) {
                            callback(err, null);
                        } else if (updated) {
                            if (_.isEmpty(updated)) {
                                callback(null, {});
                            } else {
                                var foundData = {};
                                var emailData = {};
                                emailData.from = "admin@clickmania.in";
                                emailData.fromname = "Clickmania Admin";
                                emailData.name = updated.name;
                                emailData.email = updated.email;
                                emailData.otp = emailOtp;
                                emailData.filename = "otpForSignUp.ejs";
                                emailData.subject = "Clickmania OTP";
                                console.log("emaildata", emailData);
                                Config.email(emailData, function (err, emailRespo) {
                                    if (err) {
                                        console.log(err);
                                        callback(null, err);
                                    } else if (emailRespo) {
                                        //foundData.emailRespo = emailRespo;
                                        //foundData.updated = updated;
                                        callback(null, updated);
                                    } else {
                                        callback(null, "Invalid data");
                                    }
                                });
                                //callback(null, updated);
                            }
                        } else {
                            callback(null, {
                                message: "No Data Found"
                            });
                        }
                    });
                }
            }
        });
    },

    //verify otp
    verifyOTP: function (data, callback) {
        var currentTime = new Date();
        Photographer.findOneAndUpdate({
            otp: data.otp,
            email: data.email
        }, {
            verifyAcc: true
        }, {
            new: true
        }).exec(function (error, found) {
            if (error || found == undefined) {
                console.log("User >>> verifyOTP >>> User.findOne >>> error >>>", error);
                callback(error, null);
            } else {
                if (_.isEmpty(found)) {
                    callback(null, {
                        message: "No data found"
                    });
                } else {
                    var emailData = {};
                    emailData.email = found.email;
                    emailData.filename = "welcome.ejs";
                    emailData.name = found.name;
                    //emailData.serviceRequest = data1.serviceRequest;
                    // emailData.email = data1.email;
                    //emailData.mobile = data1.mobile;
                    //emailData.query = data1.query;
                    emailData.from = "admin@clickmania.in";
                    emailData.fromname = "Clickmania Admin";
                    emailData.subject = "Welcome To Clickmania";
                    console.log("email data : ", emailData);
                    Config.email(emailData, function (err, emailRespo) {
                        console.log("emailRespo", emailRespo);
                        if (err) {
                            console.log(err);
                            //callback(null, found);
                        } else if (emailRespo) {
                            // callback(null, "Contact us form saved successfully!!!");
                            var emailData = {};
                            emailData.email = found.email;
                            emailData.filename = "upgradeprofile.ejs";
                            emailData.name = found.name;
                            //emailData.serviceRequest = data1.serviceRequest;
                            // emailData.email = data1.email;
                            //emailData.mobile = data1.mobile;
                            //emailData.query = data1.query;
                            emailData.from = "admin@clickmania.in";
                            emailData.fromname = "Clickmania Admin";
                            emailData.subject = "Clickmania Update Profile";
                            console.log("email data : ", emailData);
                            Config.email(emailData, function (err, emailRespo) {
                                console.log("emailRespo", emailRespo);
                                if (err) {
                                    console.log(err);
                                    //callback(null, found);
                                } else if (emailRespo) {
                                    // callback(null, found);
                                } else {
                                    //callback(null, found);
                                }
                            });
                        } else {
                            // callback(null, found);
                        }
                    });
                    //tym check
                    var ottym = found.otpTime;
                    // console.log("pre", moment(ottym).format('LTS'));
                    // console.log("curr", moment(currentTime).format('LTS'));
                    // console.log("diff", moment(currentTime).diff(ottym, 'minutes'));
                    var diff = moment(currentTime).diff(ottym, 'minutes');
                    if (diff <= 10) {
                        console.log("aaa");
                        callback(null, found);
                    } else {
                        console.log("bbb");
                        Photographer.remove({
                            _id: found._id
                        }).exec(function (error, found1) {
                            if (error) {
                                callback(error, null);
                            } else if (found1) {
                                //console.log("successfully deleted", found1);
                                callback(null, found1);
                            } else {
                                callback(null, {
                                    message: "No Data Found"
                                });
                            }
                        })
                    }
                    // callback(null, found);
                }
            }
        })
    },

    //verify email and send otp on email end

    //smsotp
    // smsForOtp: function (data, callback) {
    //     var smsData = {};
    //     console.log("mobileOtp", mobileOtp);
    //     smsData.mobile = data.mobile;
    //     smsData.content = "We regret to inform you that your application has been rejected for SFA Mumbai 2017. For further queries please email us at info@sfanow.in";
    //     console.log("smsdata", smsData);
    //     Config.sendSms(smsData, function (err, smsRespo) {
    //         if (err) {
    //             console.log(err);
    //             callback(err, null);
    //         } else if (smsRespo) {
    //             console.log(smsRespo, "sms sent");
    //             callback(null, smsRespo);
    //         } else {
    //             callback(null, "Invalid data");
    //         }
    //     });
    // }
    //smsotp

    //update to gold
    // updateToGold: function (data, callback) {
    //     console.log(data);
    //     var resObj = {};
    //     Photographer.findOne({
    //         _id: data._id
    //     }).exec(function (err, foundOne) {
    //         if (err) {
    //             // console.log(err);
    //             callback(err, null);
    //         } else if (_.isEmpty(foundOne)) {
    //             callback(null, "noDataFound");
    //         } else {
    //             Photographer.findOneAndUpdate({
    //                 _id: data._id
    //             }, {
    //                 package: data.package,
    //                 packageBroughtDate: data.packageBroughtDate
    //             }, {
    //                 new: true
    //             }).exec(function (err, foundUpdate) {
    //                 if (err) {
    //                     // console.log(err);
    //                     callback(err, null);
    //                 } else if (_.isEmpty(foundUpdate)) {
    //                     callback(null, "noDataFound-update");
    //                 } else {
    //                     resObj.oldData = foundOne;
    //                     resObj.newData = foundUpdate;
    //                     callback(null, resObj);
    //                 }

    //             })
    //             // callback();
    //         }

    //     })
    // },


    // payUpdateToGold: function (data, callback) {
    //     request.post({
    //         url: 'https://secure.ebs.in/pg/ma/payment/request',
    //     params: {
    //         account_id: "24065",
    //         address: "Billing Address",
    //         amount: 1.00,
    //         channel: 0,
    //         city: "Billing City",
    //         country: "IND",
    //         currency: "INR",
    //         description: "Test Order Description",
    //         display_currency: "GBP",
    //         display_currency_rates: 1,
    //         email: "name@yourdomain.in",
    //         mode: "TEST",
    //         name: "Billing Name",
    //         phone: "04423452345",
    //         postal_code: "600001",
    //         reference_no: 223,
    //         return_url: "http://localhost/ebs/response.php",
    //         secure_hash: hs,
    //     }
    //     }, callback);
    // },

    updateToGold: function (data, callback) {
        console.log("in update gold..");
        console.log(data);
        var photographerId = data.Description.split("/");
        Photographer.findOneAndUpdate({
            _id: photographerId[1]
        }, {
            package: photographerId[0],
        }, {
            new: true
        }).exec(function (err, found) {
            if (err) {
                // console.log(err);
                callback(err, null);
            } else {
                if (found) {
                    if (found.package == 'Silver') {
                        Photographer.findOneAndUpdate({
                            _id: found._id
                        }, {
                            silverPackageBroughtDate: Date.now()
                        }, {
                            new: true
                        }, function (err, updated) {
                            if (err) {
                                callback(err, null);
                            } else if (updated) {
                                if (_.isEmpty(updated)) {
                                    callback(null, {});
                                } else {
                                    // callback(null, updated);
                                    //callback(null, found);
                                    var emailData = {};
                                    emailData.email = found.email;
                                    emailData.filename = "silverpackage.ejs";
                                    emailData.name = found.name;
                                    //emailData.serviceRequest = data1.serviceRequest;
                                    // emailData.email = data1.email;
                                    //emailData.mobile = data1.mobile;
                                    //emailData.query = data1.query;
                                    emailData.from = "admin@clickmania.in";
                                    emailData.fromname = "Clickmania Admin";
                                    emailData.subject = "congrats you Have upgraded to Silver Package";
                                    console.log("email data : ", emailData);

                                    Config.email(emailData, function (err, emailRespo) {
                                        console.log("emailRespo", emailRespo);
                                        if (err) {
                                            console.log(err);
                                            callback(err, null);
                                        } else if (emailRespo) {
                                            //callback(null, "Contact us form saved successfully!!!");
                                            var emailData = {};
                                            emailData.email = found.email;
                                            emailData.filename = "goldupgrade.ejs";
                                            emailData.name = found.name;
                                            //emailData.serviceRequest = data1.serviceRequest;
                                            // emailData.email = data1.email;
                                            //emailData.mobile = data1.mobile;
                                            //emailData.query = data1.query;
                                            emailData.from = "admin@clickmania.in";
                                            emailData.fromname = "Clickmania Admin";
                                            emailData.subject = "Please upgrade to Gold";
                                            console.log("email data : ", emailData);

                                            Config.email(emailData, function (err, emailRespo) {
                                                console.log("emailRespo", emailRespo);
                                                if (err) {
                                                    console.log(err);
                                                    callback(err, null);
                                                } else if (emailRespo) {
                                                    callback(null, updated);
                                                } else {
                                                    callback("Invalid data", updated);
                                                }
                                            });
                                        } else {
                                            callback("Invalid data", updated);
                                        }
                                    });
                                }
                            } else {
                                callback(null, {
                                    message: "No Data Found"
                                });
                            }
                        });
                    } else if (found.package == 'Gold') {
                        Photographer.findOneAndUpdate({
                            _id: found._id
                        }, {
                            goldPackageBroughtDate: Date.now()
                        }, {
                            new: true
                        }, function (err, updated) {
                            if (err) {
                                callback(err, null);
                            } else if (updated) {
                                if (_.isEmpty(updated)) {
                                    callback(null, {});
                                } else {
                                    // callback(null, updated);
                                    var emailData = {};
                                    emailData.email = found.email;
                                    emailData.filename = "goldpackage.ejs";
                                    emailData.name = found.name;
                                    //emailData.serviceRequest = data1.serviceRequest;
                                    // emailData.email = data1.email;
                                    //emailData.mobile = data1.mobile;
                                    //emailData.query = data1.query;
                                    emailData.from = "admin@clickmania.in";
                                    emailData.fromname = "Clickmania Admin";
                                    emailData.subject = "congrats you Have upgraded to " + photographerId[0] + " Package";
                                    console.log("email data : ", emailData);

                                    Config.email(emailData, function (err, emailRespo) {
                                        console.log("emailRespo", emailRespo);
                                        if (err) {
                                            console.log(err);
                                            // callback(err, null);
                                        } else if (emailRespo) {
                                            callback(null, updated);
                                        } else {
                                            // callback("Invalid data", found);
                                        }
                                    });
                                }
                            } else {
                                callback(null, {
                                    message: "No Data Found"
                                });
                            }
                        });
                    }
                } else {
                    callback(null, {
                        message: "No Data Found"
                    });
                }
            }

        });
    },
    //update to Gold end

    //update to silverpackage
    updateToSilver: function (data, callback) {
        console.log(data);
        Photographer.findOneAndUpdate({
            _id: data._id
        }, {
            package: data.package,
            silverPackageBroughtDate: data.packageBroughtDate
        }, {
            new: true
        }).exec(function (err, found) {
            if (err) {
                // console.log(err);
                callback(err, null);
            } else if (found) {
                //callback(null, found);
                var emailData = {};
                emailData.email = found.email;
                emailData.filename = "silverpackage.ejs";
                emailData.name = found.name;
                //emailData.serviceRequest = data1.serviceRequest;
                // emailData.email = data1.email;
                //emailData.mobile = data1.mobile;
                //emailData.query = data1.query;
                emailData.from = "admin@clickmania.in";
                emailData.fromname = "Clickmania Admin";
                emailData.subject = "congrats you Have upgraded to Silver Package";
                console.log("email data : ", emailData);

                Config.email(emailData, function (err, emailRespo) {
                    console.log("emailRespo", emailRespo);
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else if (emailRespo) {
                        //callback(null, "Contact us form saved successfully!!!");
                        var emailData = {};
                        emailData.email = found.email;
                        emailData.filename = "goldupgrade.ejs";
                        emailData.name = found.name;
                        //emailData.serviceRequest = data1.serviceRequest;
                        // emailData.email = data1.email;
                        //emailData.mobile = data1.mobile;
                        //emailData.query = data1.query;
                        emailData.from = "admin@clickmania.in";
                        emailData.fromname = "Clickmania Admin";
                        emailData.subject = "Please upgrade to Gold";
                        console.log("email data : ", emailData);

                        Config.email(emailData, function (err, emailRespo) {
                            console.log("emailRespo", emailRespo);
                            if (err) {
                                console.log(err);
                                callback(err, null);
                            } else if (emailRespo) {
                                callback(null, found);
                            } else {
                                callback("Invalid data", found);
                            }
                        });
                    } else {
                        callback("Invalid data", found);
                    }
                });

            } else {
                callback(null, {
                    message: "No Data Found"
                });
            }

        })
    },
    //update to silverpackage end

    //searchBar get all photographers city
    findPhotographerCities: function (data, callback) {
        console.log("data", data)
        Photographer.find({}).exec(function (err, found) {
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
    //searchBar get all photographers city end

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
    },

    //PhotoContest

    findContest: function (data, callback) {
        Photographer.find({
            contestPhotos: {
                $elemMatch: {
                    contestId: data._id
                }
            }
        }).deepPopulate("contestPhotos.contestId").exec(function (err, found) {
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

    removeContestUser: function (data, callback) {
        console.log("DATA", data);
        Photographer.update({
            "_id": data.testid,
            contestPhotos: {
                $elemMatch: {
                    contestId: mongoose.Types.ObjectId(data._id)
                }
            }
            // "contestPhotos": mongoose.Types.ObjectId(data._id)
        }, {
            $pull: {
                contestPhotos: {
                    $elemMatch: {
                        contestId: mongoose.Types.ObjectId(data._id)
                    }
                }
                // contestParticipant: mongoose.Types.ObjectId(data.testid)
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

    findContestPhotos: function (data, callback) {
        Photographer.find({
            _id: data.testid,
            contestPhotos: {
                $elemMatch: {
                    contestId: data._id
                }
            }
        }).deepPopulate("contestPhotos.contestId").exec(function (err, found) {
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

    findTotalPriceOfGold: function (data, callback) {
        Photographer.findOne({
            _id: data._id
        }, function (err, found) {
            if (err) {
                // console.log(err);
                callback(err, null);
            } else {
                if (_.isEmpty(found)) {
                    callback(null, "noDataFound");
                } else {
                    var SilverPackDate = found.silverPackageBroughtDate;
                    var currentDate = new Date();
                    var date = parseInt(currentDate.getDate());
                    var month = currentDate.getMonth() + 1;
                    var SilverPackDateExp = new Date(SilverPackDate);
                    SilverPackDateExp.setYear(SilverPackDateExp.getFullYear() + 1);
                    // console.log("date", date);
                    if (moment(currentDate).isBefore(SilverPackDateExp) == true) {
                        if (date <= 15) {
                            var now = moment(new Date()); //todays date
                            var end = moment(SilverPackDateExp); // another date
                            var duration = moment.duration(end.diff(now));
                            var months = duration.asMonths();
                            var countMonths = parseInt(months);
                            var totalAmountToPay = countMonths * 118;
                            console.log("inside iF----", totalAmountToPay);
                            callback(null, totalAmountToPay);
                        } else {
                            var now = moment(new Date()); //todays date
                            var end = moment(SilverPackDateExp); // another date
                            var duration = moment.duration(end.diff(now));
                            var months = duration.asMonths();
                            var countMonths = parseInt(months) + 1;
                            var totalAmountToPay = countMonths * 118;
                            console.log("inside else----", countMonths);
                            callback(null, totalAmountToPay);
                        }
                    }
                    // console.log("SilverPackDateExp",SilverPackDateExp);
                    // var now = moment(new Date()); //todays date
                    // var end = moment(SilverPackDateExp); // another date
                    // var duration = moment.duration(end.diff(now));
                    // var months = duration.asMonths();
                    // var countMonths = parseInt(months);
                    // console.log("dddd----", countMonths);
                    // callback(null, found);
                }
            }
        });
    }

};

cron.schedule('1 12 * * *', function () {
    Photographer.find({}, function (err, found) {
        if (err) {
            console.log("error occured");
            callback(err, null);
        } else {
            async.eachSeries(found, function (value, callback1) {
                if (value.silverPackageBroughtDate && value.goldPackageBroughtDate) {
                    var PackgeDate = moment(value.goldPackageBroughtDate.setFullYear(value.goldPackageBroughtDate.getFullYear() + 1)).format();
                    console.log("packgeDate1", PackgeDate);
                } else if (!value.silverPackageBroughtDate && value.goldPackageBroughtDate) {
                    var PackgeDate = moment(value.goldPackageBroughtDate.setFullYear(value.goldPackageBroughtDate.getFullYear() + 1)).format();
                    console.log("packgeDate2", PackgeDate);
                } else if (value.silverPackageBroughtDate && !value.goldPackageBroughtDate) {
                    var PackgeDate = moment(value.silverPackageBroughtDate.setFullYear(value.silverPackageBroughtDate.getFullYear() + 1)).format();
                    console.log("packgeDate3", PackgeDate);
                }
                if (value.dateOfRagister) {
                    var current = new Date(value.dateOfRagister.getFullYear(), value.dateOfRagister.getMonth() + 2, 1);
                    console.log("#########current################", current);
                }
                // write their api to update status if changed

                if (PackgeDate == new Date() && value.package != "") {
                    value.package = "";
                    value.silverPackageBroughtDate = "";
                    value.goldPackageBroughtDate = "";
                    value.save(function () {});
                    console.log("updated");
                    var emailData = {};
                    emailData.from = "admin@clickmania.in";
                    emailData.name = value.name;
                    emailData.email = value.email;
                    emailData.package = value.package;
                    emailData.filename = "packageExpiry.ejs";
                    emailData.subject = "Package Expiry";
                    console.log("emaildata", emailData);
                    Config.email(emailData, function (err, emailRespo) {
                        if (err) {
                            callback(err, null);
                        } else if (emailRespo) {
                            callback(null, emailRespo);
                        } else {
                            callback(null, "Invalid data");
                        }
                    });
                }

                if (current == new Date() && value.dateOfRagister != "") {
                    value.status = false;
                    value.dateOfRagister = "";
                    value.month = "";
                    value.year = "";
                    value.save(function () {});
                    console.log("updated");
                    var emailData = {};
                    emailData.from = "admin@clickmania.in";
                    emailData.name = value.name;
                    emailData.email = value.email;
                    emailData.filename = "featureExpiry.ejs";
                    emailData.subject = "Feature Expiry";
                    console.log("emaildata", emailData);
                    Config.email(emailData, function (err, emailRespo) {
                        if (err) {
                            callback(err, null);
                        } else if (emailRespo) {
                            callback(null, emailRespo);
                        } else {
                            callback(null, "Invalid data");
                        }
                    });
                }
                callback1(null, "go ahead");
            }, function (error, data) {
                if (err) {
                    console.log("error found in doLogin.callback1");
                    //callback(null, err);
                } else {
                    //callback(null, "updated");
                }
            });
        }
    });
});

module.exports = _.assign(module.exports, exports, model);
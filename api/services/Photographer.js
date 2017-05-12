var request = require("request");
var cron = require("node-cron");
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
    packageBroughtDate: {
        type: Date
    },
    month: String,
    year: String,
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
        enquirerMsg: String
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        speciality: {
            select: ""
        },
        "reviewList.user": {
            select: ''
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Photographer', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "speciality reviewList.user", " speciality reviewList.user"));
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
        // console.log("data", data)
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

    // registerUser: function (data, callback) {
    //     var photographer = this(data);
    //     photographer.password = md5(photographer.password);
    //     photographer.save(function (err, created) {
    //         if (err) {
    //             callback(err, null);
    //         } else if (created) {
    //             callback(null, created);
    //         } else {
    //             callback(null, {});
    //         }
    //     });
    // },

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
                // async.parallel({
                //     sendFirstMail: function (callback1) {
                //         console.log("data", created);
                //         var emailData = {};
                //         emailData.email = created.email;
                //         emailData.filename = "welcome.ejs";
                //         emailData.name = created.name;
                //         //emailData.serviceRequest = data1.serviceRequest;
                //         // emailData.email = data1.email;
                //         //emailData.mobile = data1.mobile;
                //         //emailData.query = data1.query;
                //         emailData.from = "aditya.ghag@wohlig.com";
                //         emailData.subject = "Welcome To Clickmania";
                //         console.log("email data : ", emailData);
                //         Config.email(emailData, function (err, emailRespo) {
                //             console.log("emailRespo", emailRespo);
                //             if (err) {
                //                 console.log(err);
                //                 callback1(err, null);
                //             } else if (emailRespo) {
                //                 callback1(null, "Contact us form saved successfully!!!");
                //             } else {
                //                 callback1("Invalid data", null);
                //             }
                //         });
                //     },
                //     sendSecondMail: function (callback2) {
                //         console.log("data", created);
                //         var emailData = {};
                //         emailData.email = created.email;
                //         emailData.filename = "upgradeprofile.ejs";
                //         emailData.name = created.name;
                //         //emailData.serviceRequest = data1.serviceRequest;
                //         // emailData.email = data1.email;
                //         //emailData.mobile = data1.mobile;
                //         //emailData.query = data1.query;
                //         emailData.from = "aditya.ghag@wohlig.com";
                //         emailData.subject = "Clickmania Update Profile";
                //         console.log("email data : ", emailData);
                //         Config.email(emailData, function (err, emailRespo) {
                //             console.log("emailRespo", emailRespo);
                //             if (err) {
                //                 console.log(err);
                //                 callback2(err, null);
                //             } else if (emailRespo) {
                //                 callback2(null, "Contact us form saved successfully!!!");
                //             } else {
                //                 callback2("Invalid data", null);
                //             }
                //         });
                //     }
                // }, function (error) {
                //     if (error) {
                //         callback(null, "Error");
                //     } else {
                //         callback(null, created);
                //     }
                // })
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

    // updateToFeaturePhotographer: function (data, callback) {
    //     console.log("DATA", data);
    //     // var date = new Date();
    //     // var monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //     // var mon = monthNames[date.getMonth() + 1];
    //     // var m = date.getMonth() + 1;
    //     // console.log("month", mon);
    //     Photographer.update({
    //         _id: data._id
    //     }, {
    //         status: true,
    //         dateOfRagister: new Date(),
    //         month: data.mon,
    //         year: data.yea
    //     }, function (err, updated) {
    //         console.log(updated);
    //         if (err) {
    //             console.log(err);
    //             callback(err, null);
    //         } else {
    //             callback(null, updated);
    //         }
    //     });
    // },

    updateToFeaturePhotographer: function (data, callback) {
        console.log("DATA", data);
        // var date = new Date();
        // var monthNames = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // var mon = monthNames[date.getMonth() + 1];
        // var m = date.getMonth() + 1;
        // console.log("month", mon);
        Photographer.findOneAndUpdate({
            _id: data._id
        }, {
            status: true,
            dateOfRagister: new Date(),
            month: data.mon,
            year: data.yea
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

    // getFeaturePhotographer: function (data, callback) {
    //     this.find({
    //         status: true
    //     }).sort({
    //         month: -1
    //     }).deepPopulate("speciality").exec(function (err, found) {
    //         if (err) {
    //             callback(err, null);
    //         } else if (found) {
    //             if (_.isEmpty(found)) {
    //                 callback(null, {});
    //             } else {
    //                 console.log("Found", found);
    //                 callback(null, found);
    //             }
    //         } else {
    //             callback(null, {
    //                 message: "No Data Found"
    //             });
    //         }
    //     })
    // },

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
        Photographer.aggregate([
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

            ],
            function (err, data) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else if (data) {
                    console.log("Photographer data : ", data)
                    callback(null, data);
                } else {
                    callback(null, "Invalid data");
                }
            });
    },

    saveBottlesPhotos: function (data, callback) {

        console.log(data);
        Photographer.findOneAndUpdate({
            _id: data._id
        }, {
            $push: {

                reviewList: {
                    $each: [{
                        user: data.user,
                        review: data.review
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

    clickFilter: function (data, callback) {
        console.log("Datataaaa", data)
        if (!_.isEmpty(data.pricing)) {
            console.log("inside pricing")
            var matchArr = {
                pricing: {
                    $in: data.pricing
                }
            }
            if (!_.isEmpty(data.location)) {
                console.log("inside Lcoaction1")
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
            console.log("inside location2")

            var matchArr = {
                location: {
                    $in: data.location
                }
            }
            if (!_.isEmpty(data.pricing)) {
                console.log("inside locationlocation ")

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

    silverPackgeMail: function (data, callback) {
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
                emailData.email = data1.email;
                emailData.filename = "silverpackage.ejs";
                emailData.name = data1.name;
                //emailData.serviceRequest = data1.serviceRequest;
                // emailData.email = data1.email;
                //emailData.mobile = data1.mobile;
                //emailData.query = data1.query;
                emailData.from = "admin@clickmania.in";
                emailData.subject = "congrats you Have upgraded to Silver Package";
                console.log("email data : ", emailData);

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

    upgradToGoldMail: function (data, callback) {
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
                emailData.email = data1.email;
                emailData.filename = "goldupgrade.ejs";
                emailData.name = data1.name;
                //emailData.serviceRequest = data1.serviceRequest;
                // emailData.email = data1.email;
                //emailData.mobile = data1.mobile;
                //emailData.query = data1.query;
                emailData.from = "admin@clickmania.in";
                emailData.subject = "Please upgrade to Gold";
                console.log("email data : ", emailData);

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

    goldPackageMail: function (data, callback) {
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
                emailData.email = data1.email;
                emailData.filename = "goldpackage.ejs";
                emailData.name = data1.name;
                //emailData.serviceRequest = data1.serviceRequest;
                // emailData.email = data1.email;
                //emailData.mobile = data1.mobile;
                //emailData.query = data1.query;
                emailData.from = "admin@clickmania.in";
                emailData.subject = "congrats you Have upgraded to Gold Package";
                console.log("email data : ", emailData);

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

                emailData.mobile = data1.enquiry[ind].enquirerMobileNo;
                emailData.query = data1.enquiry[ind].enquirerMsg;
                emailData.date = data1.enquiry[ind].enquirerDate;
                emailData.from = "admin@clickmania.in";
                emailData.subject = "Enquiry";
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
        Photographer.findOne({
            email: data.email
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (found) {
                    var emailOtp = (Math.random() + "").substring(2, 6);
                    var emailData = {};
                    emailData.from = "admin@clickmania.in";
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
                            callback(null, emailOtp);
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
};

cron.schedule('15 10 * * *', function () {
    Photographer.find({}, function (err, found) {
        if (err) {
            console.log("error occured");
            // callback(err, null);
        } else {
            async.eachSeries(found, function (value, callback1) {
                // write their api to update status if changed
                var packgeDate = moment(value.packageBroughtDate.setFullYear(value.packageBroughtDate.getFullYear() + 1)).format();
                console.log("packgeDate", packgeDate);
                if (packgeDate == new Date() && value.package != "") {
                    value.package = "";
                    value.save(function () {})
                    console.log("updated");
                }
                callback1(null, "go ahead");
            }, function (error, data) {
                if (err) {
                    console.log("error found in doLogin.callback1")
                    //callback(null, err);
                } else {
                    //callback(null, "updated");
                }
            });
            console.log("m in found");
        }
    });
});

module.exports = _.assign(module.exports, exports, model);
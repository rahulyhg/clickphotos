var schema = new Schema({
    name:String,
    email: {
        type: String,
        validate: validators.isEmail()
    },
    mobileNumber:String,
    enquiryData:String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Enquiry', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
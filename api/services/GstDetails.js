var schema = new Schema({
    photographer: {
        type: Schema.Types.ObjectId,
        ref: "Photographer"
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: String,
    address: String,
    country: String,
    state: String,
    city: String,
    pincode: Number,
    gstNumber: String
});

schema.plugin(deepPopulate, {});
populate: {
    photographer: {
        select: ''
    }
}
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('GstDetails', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, 'photographer', 'photographer'));
var model = {


};
module.exports = _.assign(module.exports, exports, model);
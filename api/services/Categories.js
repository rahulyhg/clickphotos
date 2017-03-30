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
    order: {
        type: Number
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Categories', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
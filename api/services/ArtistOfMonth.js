var schema = new Schema({
    name: {
        type: String,
        default: ""
    },

    content: {
        type: String,
        default: ""
    },

    image: {
        type: String,
        default: ""
    },
    url: {
        type: String
    },
    startdate: {
        type: Date,
        default: 0
    },
    enddate: {
        type: Date,
        default: 0
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('ArtistOfMonth', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
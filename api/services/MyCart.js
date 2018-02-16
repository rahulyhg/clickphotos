var schema = new Schema({
    photographer: {
        type: Schema.Types.ObjectId,
        ref: 'Photographer',
        index: true
    },
    photos: [{
        type: Schema.Types.ObjectId,
        ref: 'Photos',
        index: true
    }],
    total:Number,
    gst:Number
});

schema.plugin(deepPopulate, {
    populate: {
        photographer: {
            select: ""
        },
        photos: {
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('MyCart', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,"photos photographer","photos photographer"));
var model = {};
module.exports = _.assign(module.exports, exports, model);
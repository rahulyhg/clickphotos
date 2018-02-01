var schema = new Schema({
    photographer: {
        type: Schema.Types.ObjectId,
        ref: 'Photographer',
        index: true
    },
    Categories: {
        type: Schema.Types.ObjectId,
        ref: "Categories"
    },
    image:String,
    keyword: [String],
    size:String,
    count:Number,
    Status:{
        type: String,
        default: "Pending",
        enum: ['Pending', 'Approved','Rejected']
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Photos', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
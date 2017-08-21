var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
    },
    photographer: {
        type: Schema.Types.ObjectId,
        ref: 'Photographer',
        index: true
    },
    payAmount: {
        type: Schema.Types.ObjectId,
        ref: 'PayAmount',
        index: true
    },
    amount: Number,
    type: String,
    address: {
        type: String,
        default: 'Billing Address'
    },
    channel: {
        type: String,
        default: '0'
    },
    city: {
        type: String,
        default: 'Billing City'
    },
    country: {
        type: String,
        default: 'IND'
    },
    currency: {
        type: String,
        default: 'INR'
    },
    description: {
        type: String,
        default: 'Test Order Description'
    },
    display_currency: {
        type: String,
        default: 'GBP'
    },
    display_currency_rates: {
        type: String,
        default: '1'
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        default: '04423452345'
    },
    postal_code: {
        type: String,
        default: '600001'
    },
    return_url: {
        type: String
    },
    transactionId: {
        type: String
    },
    paymentResponce: {
        type: []
    }

});

schema.plugin(deepPopulate, {
    populate: {
        photographer: {
            select: ""
        },
        payAmount: {
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Order', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "photographer payAmount", "photographer payAmount"));
var model = {

    // what this function will do ?
    // req data --> ?

    // what this function will do ?
    // req data --> ?


    editData: function (data, callback) {
        //        delete data.password;
        if (data._id) {
            this.findOneAndUpdate({
                _id: data._id
            }, data, {
                new: true
            }).exec(function (err, updated) {
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


};
module.exports = _.assign(module.exports, exports, model);
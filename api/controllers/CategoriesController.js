module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {


    saveCategories: function (req, res) {
        if (req.body) {
            Categories.saveCategories(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    removeCategories: function (req, res) {
        if (req.body) {
            Categories.removeCategories(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findOneCategories: function (req, res) {
        if (req.body) {
            Categories.findOneCategories(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    updateCategories: function (req, res) {
        if (req.body) {
            Categories.updateCategories(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    getAll: function (req, res) {
        if (req.body) {
            Categories.getAll(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    findAllCategories: function (req, res) {
        if (req.body) {
            Categories.findAllCategories(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    }


};
module.exports = _.assign(module.exports, controller);
module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    findOnePhotoContest: function (req, res) {
        if (req.body) {
            PhotoContest.findOnePhotoContest(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    removeContestUsers: function (req, res) {
        if (req.body) {
            PhotoContest.removeContestUsers(req.body, res.callback);
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
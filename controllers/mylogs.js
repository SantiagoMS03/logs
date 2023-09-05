const Piece = require('../models/piece');
const Log = require('../models/log');
const User = require('../models/user');

module.exports.renderMyIndex = async (req, res) => {
    var user = await User.findById(req.user._id).populate({
        path:'logs',
        populate: {
            path: 'piece'
        }
    });
    res.render('myindex', { user });
}
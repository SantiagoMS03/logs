const Piece = require('../models/piece');
const Log = require('../models/log');
const User = require('../models/user');

module.exports.postLog = async (req, res) => {
    const log = new Log(req.body.log);
    const piece = await Piece.findById(req.params.id);
    const userId = req.user._id;
    const user = await User.findById(userId);
    log.author = userId;
    log.piece = piece;
    piece.logs.push(log);
    user.logs.push(log);
    await log.save();
    await piece.save();
    await user.save();
    req.flash('success', 'Successfully submitted your log!');
    res.redirect(`/pieces/${piece._id}`)
}

module.exports.deleteLog = async (req, res) => {
    const { id, logId } = req.params
    const piece = await Piece.findByIdAndUpdate(id, { $pull: { logs: logId } });
    const log = await Log.findByIdAndDelete(logId);
    req.flash('success', 'Successfully deleted your log!');
    res.redirect(`/pieces/${piece._id}`);
}
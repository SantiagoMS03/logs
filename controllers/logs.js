const Piece = require('../models/piece');
const Log = require('../models/log');
const User = require('../models/user');

module.exports.postLog = async (req, res) => {
    console.log('\n\n\n******************')
    const log = new Log(req.body.log);
    const userId = req.user._id;
    const piece = await Piece.findById(req.params.id);
    const user = await User.findById(userId);

    log.author = userId;
    log.piece = piece;
    if (!user.knownPieces.includes(piece._id)) {
        console.log("New piece!")
        user.knownPieces.push(piece);
        piece.knowsThis.push(user);
    } 

    piece.logs.push(log);
    user.logs.push(log);
    await log.save();
    await piece.save();
    await user.save();
    // console.log(log)
    // console.log(piece)
    // console.log(user)    
    req.flash('success', 'Successfully submitted your log!');
    res.redirect(`/pieces/${piece._id}`)
}

module.exports.deleteLog = async (req, res) => {
    const { id, logId } = req.params
    const piece = await Piece.findByIdAndUpdate(id, { $pull: { logs: logId } });
    const user = await User.findByIdAndUpdate(id, { $pull: { logs: logId } });
    const log = await Log.findByIdAndDelete(logId);
    req.flash('success', 'Successfully deleted your log!');
    res.redirect(`/pieces/${piece._id}`);
}
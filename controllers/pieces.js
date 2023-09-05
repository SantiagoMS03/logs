const Piece = require('../models/piece');

module.exports.index = async (req, res) => {
    const pieces = await Piece.find({});
    res.render('index', { pieces })
}

module.exports.renderNewForm = (req, res) => {
    res.render('new');
}

module.exports.createPiece = async (req, res) => {
    const piece = new Piece(req.body.piece);
    piece.author = req.user._id;
    await piece.save();
    req.flash('success', 'Successfuly made a new piece!');
    res.redirect(`/pieces/${piece._id}`);
}
module.exports.showPiece = async (req, res) => {
    const piece = await Piece.findById(req.params.id).populate({
        path:'logs',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!piece) {
        req.flash('error', 'Can not find that piece');
        return res.redirect('/pieces');
    }
    res.render('show', { piece });
}

module.exports.deletePiece = async (req, res) => {
    await Piece.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted your piece!');
    res.redirect('/pieces');
}

module.exports.renderEditForm = async (req, res) => {
    const piece = await Piece.findById(req.params.id);
    if (!piece) {
        req.flash('error', 'Can not find that piece :c');
        return res.redirect('/pieces');
    }
    res.render('update', { piece });
}

module.exports.updatePiece = async (req, res) => {
    const { id } = req.params;
    const piece = await Piece.findById(id);
    // !~!!!!!!!!!!!!!!!!!!
    const p = await Piece.findByIdAndUpdate(id, { ...req.body.piece });
    req.flash('success', 'Successfully updated your piece!');
    res.redirect(`/pieces/${piece._id}`);
}
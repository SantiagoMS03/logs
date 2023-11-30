const Piece = require('../models/piece');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const pieces = await Piece.find({});
    res.render('index', { pieces })
}

module.exports.renderNewForm = (req, res) => {
    res.render('new');
}

module.exports.createPiece = async (req, res) => {
    const piece = new Piece(req.body.piece);
    piece.sheetMusic = req.files.map(f => ({url: f.path, filename: f.filename}))
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
    const { id } = req.params;
    const piece = Piece.findById(id).populate({path:'sheetMusic'});
    for (user in piece.knowsThis) {
        const pieceLocation = user.knownPieces.pull(piece);
        // console.log(user.knownPieces.splice(pieceLocation, pieceLocation));
    }
    // To do delete files when deleting piece
    // for (let sheet of piece.sheetMusic) {
    //     await cloudinary.uploader.destroy(sheet.filename);
    // }
    await Piece.findByIdAndDelete(id);

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
    // console.log(req.body)
    const piece = await Piece.findByIdAndUpdate(id, { ...req.body.piece });
    const sheetMusicFiles = req.files.map(f => ({url: f.path, filename: f.filename}));
    piece.sheetMusic.push(...sheetMusicFiles);
    await piece.save();
    if (req.body.deleteSheets) {
        for (let filename of req.body.deleteSheets) {
            await cloudinary.uploader.destroy(filename);
        }
        await piece.updateOne({$pull: {sheetMusic: {filename: {$in: req.body.deleteSheets}}}});
        // console.log(piece);
    }
    req.flash('success', 'Successfully updated your piece!');
    res.redirect(`/pieces/${piece._id}`);
}
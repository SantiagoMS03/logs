const ExpressError = require('./utils/ExpressError');
const { pieceSchema, logSchema } = require('./utils/schemas')
const Piece = require('./models/piece');
const Log = require('./models/log');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validatePiece = (req, res, next) => {
    const { error } = pieceSchema.validate(req.body, {allowUnknown: true});
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const piece = await Piece.findById(id);
    if (!piece.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/pieces/${id}`);
    }
    next();
}


module.exports.isLogAuthor = async (req, res, next) => {
    const { logId, id } = req.params;
    const log = await Log.findById(logId);
    if (!log.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/pieces/${id}`);
    }
    next();
}



module.exports.validateLog = (req, res, next) => {
    const { error } = logSchema.validate(req.body);
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

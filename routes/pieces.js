const express = require('express');
const router = express.Router();

const pieces = require('../controllers/pieces');
const CatchAsync = require('../utils/CatchAsync');
const { isLoggedIn, validatePiece, isAuthor } = require('../middleware');

router.get('/', CatchAsync(pieces.index));

router.route('/new')
    .get(isLoggedIn, pieces.renderNewForm)
    .post(isLoggedIn, validatePiece, CatchAsync(pieces.createPiece));

router.route('/:id')
    .get(CatchAsync(pieces.showPiece))
    .delete(isLoggedIn, isAuthor, CatchAsync(pieces.deletePiece))
    .put(isLoggedIn, validatePiece, isAuthor, CatchAsync(pieces.updatePiece));

router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(pieces.renderEditForm));

module.exports = router;
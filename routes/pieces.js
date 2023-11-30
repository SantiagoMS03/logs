const express = require('express');
const router = express.Router();

const pieces = require('../controllers/pieces');
const CatchAsync = require('../utils/CatchAsync');
const { isLoggedIn, validatePiece, isAuthor } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', CatchAsync(pieces.index));

router.route('/new')
    .get(isLoggedIn, pieces.renderNewForm)
    .post(isLoggedIn, upload.array('sheetMusic'), validatePiece, CatchAsync(pieces.createPiece));

router.route('/:id')
    .get(CatchAsync(pieces.showPiece))
    .put(isLoggedIn, isAuthor, upload.array('sheetMusic'), validatePiece, CatchAsync(pieces.updatePiece))
    .delete(isLoggedIn, isAuthor, CatchAsync(pieces.deletePiece));

router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(pieces.renderEditForm));

module.exports = router;
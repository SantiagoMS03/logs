const express = require('express');
const router = express.Router({ mergeParams: true });

const mylogs = require('../controllers/mylogs');
const CatchAsync = require('../utils/CatchAsync');
const { isLoggedIn } = require('../middleware');


router.get('/', isLoggedIn, CatchAsync(mylogs.renderMyIndex));

module.exports = router;
const express = require('express');
const router = express.Router({ mergeParams: true });

const CatchAsync = require('../utils/CatchAsync');
const logs = require('../controllers/logs');
const { isLoggedIn, validateLog, isLogAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateLog, CatchAsync(logs.postLog))
router.delete('/:logId', isLoggedIn, isLogAuthor, CatchAsync(logs.deleteLog))

module.exports = router;
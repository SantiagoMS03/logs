const express = require('express');
const router = express.Router();
const passport = require('passport');
const CatchAsync = require('../utils/CatchAsync');
const { storeReturnTo } = require('../middleware');

const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(CatchAsync(users.registerUser));

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser);

router.get('/logout', users.logoutUser);

module.exports = router;
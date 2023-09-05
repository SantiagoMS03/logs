const User = require('../models/user');

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Logs!');
            res.redirect('/pieces');
        });
    } catch(e) {
        if (e.message.includes('E11000')) {
            e.message = "A user with the given email is already registered";
        }
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/pieces';                
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/pieces');
    });
}
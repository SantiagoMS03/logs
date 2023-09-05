const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const pieceRoutes = require('./routes/pieces');
const logRoutes = require('./routes/logs');
const userRoutes = require('./routes/users');
const myLogsRoutes = require('./routes/mylogs');

mongoose.connect('mongodb://localhost:27017/pieces');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Dabatase connected");
})


const app = express();

app.use(express.urlencoded({ extended: true }))

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));

app.set('views', path.join(__dirname, 'views'));
app.set('public', path.join(__dirname, 'public'));
app.use(express.static(__dirname + '/public/styles'));
app.use(express.static(__dirname + '/public/icons'));
app.use(express.static(__dirname + '/public'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

// session() has to be before passport.session()
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
// To have access to flashes in our templates locally instead of
//      having to pass individually to our routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/pieces', pieceRoutes);
app.use('/pieces/:id/logs', logRoutes);
app.use('/mylogs', myLogsRoutes);

app.get('/', (req, res) => {
    res.render('welcome');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no, something went wrong :('
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Listening on 3000!');
})
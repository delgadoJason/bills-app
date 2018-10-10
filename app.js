const express = require('express');
const app = express();
const methodOverride = require('method-override');
let bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStartegy = require('passport-local');
let User = require('./models/user');
const Bills = require('./models/bills.js');
const port = 3000;

// ===========
// ROUTES
// ===========
let billRoutes 	= require('./routes/bills'),
	indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/bill-tracker',{ useNewUrlParser: true });

app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// PASSPORT CONFIG
app.use(require('express-session')({
	secret: 'No bills would be great!',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use('/bills', billRoutes);


app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});
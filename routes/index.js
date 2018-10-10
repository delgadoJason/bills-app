let express = require('express');
let router = express.Router();
const passport = require('passport');
let User = require('../models/user');

// HOME - landing page
router.get('/', (req, res) => {
	res.render('landing', {currentUser: req.user});
});

// AUTH ROUTES

// Show register form
router.get('/register', (req, res) => {
	res.render('register');
});

// Post route
router.post('/register', (req, res) => {
	// Get values from form
	let username = req.body.username;
	let password = req.body.password;
	// Add user to database
	User.register(new User({username}), password, function(err, user) {
		if(err) {
			return res.redirect('/register');
		}

		passport.authenticate('local')(req, res, function() {
			res.redirect('/');
		});
	});
});

// Show login form
router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/bills',
	failureRedirect: '/login'
}), (req, res) => {

});

// logout route
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	};
	res.redirect('/login');
};

module.exports = router;
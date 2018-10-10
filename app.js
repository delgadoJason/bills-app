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



// HOME - landing page
app.get('/', (req, res) => {
	res.render('landing', {currentUser: req.user});
});

// INDEX - show all bills
app.get('/bills', isLoggedIn, (req, res) => {
	Bills.find({}, (err, bills) => {
		if(err) {
			res.send('There was an error!', err);
		} else {
			res.render('index', {bills: bills, currentUser: req.user});
		}
	});
});

// CREATE - add a new bill
app.post('/bills', (req, res) => {
	let company = req.body.company;
	let typeOfBill = req.body.typeOfBill;
	let accountNumber = req.body.accountNumber;
	let phoneNumber = req.body.phoneNumber;
	let website = req.body.website;
	let amount = req.body.amount;
	let dueDate = req.body.dueDate;
	let newBill = {
		companyName: company,
		typeOfBill,
		accountNumber,
		phoneNumber,
		amountDue: amount,
		dueDate,
		website
	};
	let bill = new Bills(newBill);
	bill.save();
	res.redirect('/bills');
});

// NEW - show form to create new bill
app.get('/bills/new', isLoggedIn, (req, res) => {
	res.render('new-bill');
});

//  SHOW - show more info about a bill
app.get('/bills/:id', (req, res) => {
	Bills.findById(req.params.id, (err, bill) => {
		if(err) {
			console.log('There was an error', err);
		} else {
			res.render('show', {bill: bill});
		}
	});
});

// EDIT ROUTE
app.get('/bills/:id/edit', (req,res) => {
	// Get the bill by id
	Bills.findById(req.params.id, (err, bill) => {
		if(err){
			res.redirect('/bills:id');
		} else {
			res.render('edit', {bill: bill});
		}
	});
});

// UPDATE ROUTE
app.put('/bills/:id', (req, res) => {
	// Get data from edit form
	let companyName = req.body.company;
	let typeOfBill = req.body.typeOfBill;
	let amountDue = req.body.amount;
	let dueDate = req.body.dueDate;
	let updatedBill = {
		companyName,
		typeOfBill,
		amountDue,
		dueDate
	};
	// Update the bill
	Bills.findByIdAndUpdate(req.params.id, updatedBill, (err) => {
		if(err) {
			res.redirect('/bills');
		} else {
			res.redirect('/bills/' + req.params.id);
		}
	});
});

// DELETE ROUTE
app.delete('/bills/:id', (req, res) => {
	// Delete the bill
	Bills.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			res.redirect('/bills');
		} else {
			res.redirect('/bills');
		}
	});
});

// AUTH ROUTES

// Show register form
app.get('/register', (req, res) => {
	res.render('register');
});

// Post route
app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/bills',
	failureRedirect: '/login'
}), (req, res) => {

});

// logout route
app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	};
	res.redirect('/login');
};

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});
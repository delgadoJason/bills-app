let express = require('express');
let router = express.Router();
const Bills = require('../models/bills.js');

// INDEX - show all bills
router.get('/', isLoggedIn, (req, res) => {
	Bills.find({}, (err, bills) => {
		if(err) {
			res.send('There was an error!', err);
		} else {
			res.render('index', {bills: bills, currentUser: req.user});
		}
	});
});

// CREATE - add a new bill
router.post('/', (req, res) => {
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
router.get('/new', isLoggedIn, (req, res) => {
	res.render('new-bill');
});

//  SHOW - show more info about a bill
router.get('/:id', (req, res) => {
	Bills.findById(req.params.id, (err, bill) => {
		if(err) {
			console.log('There was an error', err);
		} else {
			res.render('show', {bill: bill});
		}
	});
});

// EDIT ROUTE
router.get('/:id/edit', (req,res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
	// Delete the bill
	Bills.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			res.redirect('/bills');
		} else {
			res.redirect('/bills');
		}
	});
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	};
	res.redirect('/login');
};

module.exports = router;
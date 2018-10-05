const express = require('express');
const app = express();
const methodOverride = require('method-override');
let bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 3000;

mongoose.connect('mongodb://localhost:27017/bill-tracker');
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Bills Scehma
const billsSchema = new mongoose.Schema({
	companyName: String,
	typeOfBill: String,
	amountDue: Number,
	dueDate: Date
});

let Bills = mongoose.model('Bill', billsSchema);

// HOME - landing page
app.get('/', (req, res) => {
	res.render('landing');
});

// INDEX - show all bills
app.get('/bills', (req, res) => {
	Bills.find({}, (err, bills) => {
		if(err) {
			res.send('There was an error!', err);
		} else {
			res.render('index', {bills: bills});
		}
	});
});

// CREATE - add a new bill
app.post('/bills', (req, res) => {
	let company = req.body.company;
	let typeOfBill = req.body.typeOfBill;
	let amount = req.body.amount;
	let dueDate = req.body.dueDate;
	let newBill = {
		companyName: company,
		typeOfBill,
		amountDue: amount,
		dueDate
	};
	let bill = new Bills(newBill);
	bill.save();
	res.redirect('/bills');
});

// NEW - show form to create new bill
app.get('/bills/new', (req, res) => {
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

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});
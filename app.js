const express = require('express');
const app = express();
let bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 3000;

mongoose.connect('mongodb://localhost:27017/bill-tracker');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

// Bills Scehma
const billsSchema = new mongoose.Schema({
	companyName: String,
	typeOfBill: String,
	amountDue: Number,
	dueDate: Date
});

let Bills = mongoose.model('Bill', billsSchema);

// let bills = [
// 		{
// 			companyName: 'Duke Energy',
// 			typeOfBill: 'Power Bill',
// 			amountDue: 125.28,
// 			dueDate: 'Sep 13, 2018'
// 		},
// 		{
// 			companyName: 'Crestridge Utilities, LLC',
// 			typeOfBill: 'Water Bill',
// 			amountDue: 47.82,
// 			dueDate: 'Sep 24, 2018'
// 		}, 
// 		{
// 			companyName: 'Spectrum',
// 			typeOfBill: 'Cable Bill',
// 			amountDue: 136.85,
// 			dueDate: 'Today'
// 		}
// ];

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/bills', (req, res) => {
	Bills.find({}, (err, bills) => {
		if(err) {
			res.send('There was an error!', err);
		} else {
			res.render('bills', {bills: bills});
		}
	});
});

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

app.get('/bills/new', (req, res) => {
	res.render('new-bill');
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});
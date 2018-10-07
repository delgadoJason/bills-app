const mongoose = require('mongoose');

// Bills Scehma
const billsSchema = new mongoose.Schema({
	companyName: String,
	typeOfBill: String,
	accountNumber: Number,
	phoneNumber: String,
	amountDue: Number,
	dueDate: Date,
	website: String
});



module.exports = mongoose.model('Bill', billsSchema);
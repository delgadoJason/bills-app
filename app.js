const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('landing');
});

app.get('/bills', (req, res) => {
	let bills = [
		{
			companyName: 'Duke Energy',
			amountDue: 125.28,
			dueDate: 'Sep 13, 2018'
		}
	]
	res.render('bills', {bills: bills});
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});
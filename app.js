const express = require('express');
let hbs = require('hbs');
const app = express();
const port = 3000;

app.set('view engine', hbs);

app.get('/', (req, res) => {
	res.render('home.hbs', {
		pageTitle: 'Bills App',
		intro: 'Welcome to the Bills Application'
	});
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});
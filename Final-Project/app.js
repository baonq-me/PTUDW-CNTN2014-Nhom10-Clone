var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	controller = require('./controller/controller.js');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('/public'));

controller(app);


// Server
app.listen(3000, function(){
	console.log("localhost:3000");
});
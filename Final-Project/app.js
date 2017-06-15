var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	session = require("express-session"),
	passport = require("passport"),
	flash = require("connect-flash"),
	controller = require('./controller/controller.js');
var router = express.Router();

 //Chọn view engine
 app.set('view engine', 'ejs');

 //Chọn thư mục để chứa những file ejs
 app.set('views', __dirname+'/views');

 // Set Passport
 app.use(session({
 	secret: "mysecret",
 	cookie:{
 		maxAge: 1000*60*60*24*10
 	},
 	resave: false,
 	saveUnintialized: false
 }));
 app.use(flash());
 app.use(passport.initialize());
 app.use(passport.session());

 //Import body-parser cho app
 app.use(bodyParser.urlencoded({extended: true}));

 //Chọn đường dẫn thư mục public, chứa những file static
 app.use(express.static(__dirname + '/public'));

controller(app);


// Server
app.listen(80, function(){
	console.log("LISTENING AT PORT 80/HTTP");
});

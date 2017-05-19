var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	controller = require('./controller/controller.js');

 //Chọn view engine
 app.set('view engine', 'ejs');

 //Chọn thư mục để chứa những file ejs
 app.set('views', __dirname+'/views');

 //Import body-parser cho app
 app.use(bodyParser.urlencoded({extended: false}));

 //Chọn đường dẫn thư mục public, chứa những file static
 app.use(express.static(__dirname + '/public')); 

controller(app);


// Server
app.listen(3000, function(){
	console.log("localhost:3000");
});
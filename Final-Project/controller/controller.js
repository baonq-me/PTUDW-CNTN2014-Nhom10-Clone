module.exports = function(app) {
	var dao = require('../database/dao.js');
	dao.connect(function(){});

	customer = require('./customer.js');
	admin = require("./admin.js");
	account = require("./account.js");
	// Routing về các trang admin
	app.use("/admin", admin);
	// Routing về các chứng thực tài khoản như login logout
	app.use("/", account);
	//account(app);
	// Routing về các trang khách hàng
	app.use("/", customer);
}
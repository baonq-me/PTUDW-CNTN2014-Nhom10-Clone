module.exports = function(app) {
	customer = require('./customer.js');
	admin = require("./admin.js");
	account = require("./account.js");
	// Routing về các chứng thực tài khoản như login logout
	account(app);
	// Routing về các trang khách hàng
	customer(app);
	// Routing về các trang admin
	admin(app);
}
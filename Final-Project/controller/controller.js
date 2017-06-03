module.exports = function(app) {
	customer = require('./customer.js');
	admin = require("./admin.js");
	customer(app);
	admin(app);
}
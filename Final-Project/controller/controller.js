module.exports = function(app) {
	user = require('./user.js');
	admin = require("./admin.js");
	user(app);
	admin(app);
}
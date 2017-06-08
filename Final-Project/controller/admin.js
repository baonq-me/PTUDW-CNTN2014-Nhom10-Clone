var router = require("express").Router();
var dao = require('../database/dao.js');
// Mở kết nối cho db
dao.connect(function(){});

// Nếu muốn dùng thirt party
// router.use();

/******************* CÁC FUNCTION LẤY NHỮNG PHẦN CƠ BẢN **********************************/

//Lấy header
var getHeaderAdmin = function(callback){
	callback({});
};

//Lấy sidebar
var getSidebarAdmin = function(callback){
	callback({});
};

//Lấy nội dung cho trang chủ Admin
var getContentHomeAdmin = function(callback){
	dao.countProducts(function(countProducts){
		dao.countBills(function(countBills){
			dao.countUsers(function(countUsers){
				dao.outOfProduct(function(outOfProducts){
					dao.getNewProductAdmin(function(newProducts){
						callback(countProducts, countBills, countUsers, outOfProducts, newProducts);
					});
				});

			});
		});
	});
};

// localhost:3000/admin/dashboard -> localhost:3000/admin
router.get("/dashboard", function(req, res){
	res.redirect("/admin");
});

// Default route is dashboard page
router.get("/", function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/index", {"header": header, "sidebar":sidebar,
					"countProducts" : countProducts, "countBills" : countBills, "countUsers" : countUsers,
					"outOfProducts": outOfProducts, "newProducts" : newProducts});
			});
		});
	});
});

// Product
router.get("/product", function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/product", {"header": header, "sidebar":sidebar});
			});
		});
	});
});

// Group
router.get("/group", function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/group", {"header": header, "sidebar":sidebar});
			});
		});
	});
});


// Order
router.get("/order", function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/order", {"header": header, "sidebar":sidebar});
			});
		});
	});
});

// Statistic
router.get("/statistic", function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/statistic", {"header": header, "sidebar":sidebar});
			});
		});
	});
});

// Account
router.get("/account", function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/account", {"header": header, "sidebar":sidebar});
			});
		});
	});
});

// Setting
router.get("/setting", function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/setting", {"header": header, "sidebar":sidebar});
			});
		});
	});
});

module.exports = router;

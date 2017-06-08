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
// Dashboard
router.get("/", function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/dashboard", {"header": header, "sidebar":sidebar,
					"countProducts" : countProducts, "countBills" : countBills, "countUsers" : countUsers,
					"outOfProducts": outOfProducts, "newProducts" : newProducts});
			});
		});
	});
});


router.get("/", function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/products", {});
			});
		});
	});
});

router.get("/", function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/products", {});
			});
		});
	});
});

router.get("/", function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/products", {});
			});
		});
	});
});

router.get("/", function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/products", {});
			});
		});
	});
});

module.exports = router;

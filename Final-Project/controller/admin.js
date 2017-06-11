/*
*	username: nhom10
*	password: nhom10
*/

var router = require("express").Router();
var dao = require('../database/dao.js');
// Mở kết nối cho db

// Nếu muốn dùng thirt party
// router.use();

/******************* CÁC FUNCTION LẤY NHỮNG PHẦN CƠ BẢN **********************************/
// Lấy thông tin user
var getUser = function(req){
	var user = req.isAuthenticated() ? req.user : null;
	user = (user == null || user.role.name != "admin") ? null : user;
	return user;
}
// Kiểm tra đăng nhập
var isLoggedIn = (req, res, next) => {
	var user = getUser(req);
	if (user == null)
		res.redirect("/admin/login");
	else next();
}

//Lấy header
var getHeaderAdmin = function(callback){
	callback({});
};

//Lấy sidebar
var getSidebarAdmin = function(callback){
	callback({});
};

//Lấy nội dung cơ bản cho trang chủ Admin
var getContentHomeAdmin = function(callback){
	dao.countProducts(function(countProducts){
		dao.countBills(function(countBills){
			dao.countUsers(function(countUsers){
				callback(countProducts, countBills, countUsers);
			});
		});
	});
};

//Lấy thông tin cơ bản trang quản lý SP admin
var getBaseInfoProductsAdmin = function(callback){
	dao.countCategories(function(countCategories){
		dao.countNewProductInWeek (function(countNewProduct){
			dao.countPromotionProduct(function(countPromotionProduct){
				dao.getBestSellProduct(function(bestSellProduct){
					dao.countProducts(function(countProduct){
						dao.countOutOfProduct(function(countOutOfProduct){
							dao.countStockProduct(function(countStockProduct){
								dao.countDeletedProduct(function(countDeletedProduct){
									dao.countStopSellProduct(function(countStopSellProduct){
										callback(countCategories, countNewProduct, countPromotionProduct, bestSellProduct, 
											countProduct, countOutOfProduct, countStockProduct, countDeletedProduct, countStopSellProduct);
									});
								});
							});
						});
					});
					
				});
			});
		});
	});
}


// localhost:3000/admin/dashboard -> localhost:3000/admin
router.get("/dashboard", isLoggedIn, function(req, res){
	res.redirect("/admin");
});

// Default route is dashboard page
router.get("/", isLoggedIn, function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers){
				res.render("admin/index", {"header": header, "sidebar":sidebar, 
					"countProducts" : countProducts, "countBills" : countBills, "countUsers" : countUsers
				});
			});
		});
	});
});

//Lấy ds sản phẩm hết hàng
router.get("/out-of-products", isLoggedIn, function(req, res){
	dao.getOutOfProduct(function(outOfProducts){
		res.json(outOfProducts);
	});
});


//Lấy ds sản phẩm mới được thêm vào
router.get("/new-products", isLoggedIn, function(req, res){
	dao.getNewProductAdmin(5, function(newProducts){
		res.json(newProducts);
	});
});

//Lấy ds user mới được thêm vào
router.get("/new-users", isLoggedIn, function(req, res){
	dao.getNewUsers(5, function(newUsers){
		console.log (newUsers);
		res.json(newUsers);
	});
});

// Product
router.get("/product", isLoggedIn, function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getBaseInfoProductsAdmin(function(countCategories, countNewProduct, countPromotionProduct, bestSellProduct, countProduct, countOutOfProduct, countStockProduct, countDeletedProduct, countStopSellProduct){
				//dao.getAllProduct(function(allProduct){
					res.render("admin/product", {"header": header, "sidebar":sidebar, "countCategories": countCategories,
					"countNewProduct": countNewProduct, "countPromotionProduct": countPromotionProduct, "bestSellProduct": bestSellProduct, 
					"countProduct": countProduct, "countOutOfProduct": countOutOfProduct, "countStockProduct": countStockProduct, 
					"countDeletedProduct": countDeletedProduct, "countStopSellProduct": countStopSellProduct});
				//});	
			});
		});
	});
});

router.get("/api/products", isLoggedIn, function(req, res){
	switch (req.query.type) {
		case '0':
			dao.getAllProduct(function(products){
				res.json(products);
			});
			break;
		case '1':
			dao.getStockProduct(function(products){
				res.json(products);
			});
			break;
		case '2':
			dao.getOutOfProduct(function(products){
				res.json(products);
			});
			break;
		case '3':
			dao.getDeletedProduct(function(products){
				res.json(products);
			});
			break;
		case '4':
			dao.getStopSellProduct(function(products){
				res.json(products);
			});
			break;
	}	
});

// Group
router.get("/group", isLoggedIn, function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/group", {"header": header, "sidebar":sidebar});
			});
		});
	});
});


// Order
router.get("/order", isLoggedIn, function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/order", {"header": header, "sidebar":sidebar});
			});
		});
	});
});

// Statistic
router.get("/statistic", isLoggedIn, function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/statistic", {"header": header, "sidebar":sidebar});
			});
		});
	});
});

// Account
router.get("/account", isLoggedIn, function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/account", {"header": header, "sidebar":sidebar});
			});
		});
	});
});

// Setting
router.get("/setting", isLoggedIn, function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getContentHomeAdmin(function(countProducts, countBills, countUsers, outOfProducts, newProducts){
				res.render("admin/setting", {"header": header, "sidebar":sidebar});
			});
		});
	});
});

// Login
router.get("/login", (req, res) => {
	var message = req.flash("error");
	res.render("admin/login", {message: message});
});

module.exports = router;

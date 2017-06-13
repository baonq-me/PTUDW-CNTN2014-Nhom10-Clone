/*
*	username: nhom10
*	password: nhom10
*/

var router = require("express").Router();
var dao = require('../database/dao.js');
var async = require('async');
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
	//var user = getUser(req);
	//if (user == null)
	//	res.redirect("/admin/login");
	//else next();
	next();
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
	async.parallel({
		countCategories: function(callback){
			dao.countCategories(function(countCategories){
				callback(null, countCategories);
			});
		},
		countNewProduct: function(callback){
			dao.countNewProductInWeek (function(countNewProduct){
				callback(null, countNewProduct);
			})
		},
		countPromotionProduct: function(callback){
			dao.countPromotionProduct(function(countPromotionProduct){
				callback(null, countPromotionProduct);
			});
		},
		bestSellProduct: function(callback){
			dao.getBestSellProduct(function(bestSellProduct){
				callback(null, bestSellProduct);
			});
		},
		countProduct: function(callback){
			dao.countProducts(function(countProduct){
				callback(null, countProduct);
			});
		},
		countOutOfProduct: function(callback){
			dao.countOutOfProduct(function(countOutOfProduct){
				callback(null, countOutOfProduct);
			});
		},
		countStockProduct: function(callback){
			dao.countStockProduct(function(countStockProduct){
				callback(null, countStockProduct);
			});
		},
		countDeletedProduct: function(callback){
			dao.countDeletedProduct(function(countDeletedProduct){
				callback(null, countDeletedProduct);
			});
		},
		countStopSellProduct: function(callback){
			dao.countStopSellProduct(function(countStopSellProduct){
				callback(null, countStopSellProduct);
			});
		},
		categories: function(callback){
			dao.getAllCategory(function(categories){
				callback(null, categories);
			});
		}
	},
	function(err, results){
		callback(results);
	});
	/*dao.countCategories(function(countCategories){
		dao.countNewProductInWeek (function(countNewProduct){
			dao.countPromotionProduct(function(countPromotionProduct){
				dao.getBestSellProduct(function(bestSellProduct){
					dao.countProducts(function(countProduct){
						dao.countOutOfProduct(function(countOutOfProduct){
							dao.countStockProduct(function(countStockProduct){
								dao.countDeletedProduct(function(countDeletedProduct){
									dao.countStopSellProduct(function(countStopSellProduct){
										dao.getAllCategory(function(categories){
											callback(countCategories, countNewProduct, countPromotionProduct, bestSellProduct,
											countProduct, countOutOfProduct, countStockProduct, countDeletedProduct, countStopSellProduct, categories);
										})

									});
								});
							});
						});
					});

				});
			});
		});
	});*/
}

//Lấy thông tin cơ bản của trang Quản lý Đơn hàng Admin
var getBaseInfoOrderAdmin = function(callback){
	dao.countBills(function(countBills){
		dao.countBillNotPaid(function(countBillNotPaid){
			dao.countBillCanceled(function(countBillCanceled){
				dao.getRevenueInWeek(function(revenueInWeek){
					dao.countBillNotDelivered(function(countBillNotDelivered){
						dao.countBillDelivered(function(countBillDelivered){
							dao.countBillPaid(function(countBillPaid){
								dao.countBillCompleted(function(countBillCompleted){
									callback(countBills, countBillNotPaid, countBillCanceled, countBillCanceled, revenueInWeek,
										countBillNotDelivered, countBillDelivered, countBillPaid, countBillCompleted);
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
router.get("/api/index/out-of-products", isLoggedIn, function(req, res){
	dao.getOutOfProduct(5, 0, null, null, function(outOfProducts){
		res.json(outOfProducts);
	});
});


//Lấy ds sản phẩm mới được thêm vào
router.get("/api/index/new-products", isLoggedIn, function(req, res){
	dao.getNewProductAdmin(5, 0 , function(newProducts){
		res.json(newProducts);
	});
});

//Lấy ds sản phẩm mới bán
router.get("/api/index/just-sell-products", isLoggedIn, function(req, res){
	dao.getJustSellProduct(5, 0 , function(justSellProducts){
		res.json(justSellProducts);
	});
});

//Lấy ds user mới được thêm vào
router.get("/api/index/new-users", isLoggedIn, function(req, res){
	dao.getNewUsers(5, 0, function(newUsers){
		res.json(newUsers);
	});
});

router.get("/api/search/products", isLoggedIn, function(req, res){
	dao.getProductDetailByID(req.query.id, function(products){
		res.json(products);
	});
});

// Product
router.get("/product", isLoggedIn, function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getBaseInfoProductsAdmin(function(results){
				results.header = header;
				results.sidebar = sidebar;
			//getBaseInfoProductsAdmin(function(countCategories, countNewProduct, countPromotionProduct, bestSellProduct, countProduct, countOutOfProduct, countStockProduct, countDeletedProduct, countStopSellProduct, categories){
				//dao.getAllProduct(function(allProduct){
					res.render("admin/product", results);
				//});
			});
		});
	});
});

router.get("/api/products", isLoggedIn, function(req, res){
	var skip = parseInt(req.query.skip);
	var count = parseInt(req.query.count);
	var query = (req.query.query == "") ? null : req.query.query;
	var catID = (req.query.catID == "0") ? null : req.query.catID;
	switch (req.query.type) {
		case '0':
			dao.getAllProduct(count, skip, query, catID, function(products){
				res.json(products);
			});
			break;
		case '1':
			dao.getStockProduct(count, skip, query, catID, function(products){
				res.json(products);
			});
			break;
		case '2':
			dao.getOutOfProduct(count, skip, query, catID,function(products){
				res.json(products);
			});
			break;
		case '3':
			dao.getDeletedProduct(count, skip, query, catID, function(products){
				res.json(products);
			});
			break;
		case '4':
			dao.getStopSellProduct(count, skip, query, catID, function(products){
				res.json(products);
			});
			break;
	}
});

router.get("/product/add", isLoggedIn, (req, res) => {
	getHeaderAdmin(function(header){
		getSidebarAdmin(function(sidebar){
			res.render("admin/product-add", {"header": header, "sidebar": sidebar})
		})
	});
});

// Group
router.get("/group", isLoggedIn, function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			dao.countCategories(function(countCategories){
				res.render("admin/group", {"header": header, "sidebar":sidebar, "countCategories" : countCategories });
			});
		});
	});
});

// Group
router.get("/group-add", isLoggedIn, function(req, res){
	var errorAddCat = (req.session.errorAddCat == undefined) ?  false : req.session.errorAddCat;
	req.session.errorAddCat = false;
	var message = (errorAddCat) ? "Thêm sản phẩm không thành công!" : "";
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			//dao.countCategories(function(countCategories){
				res.render("admin/group-add", {"header": header, "sidebar":sidebar, message: message});
			//});
		});
	});
});

// Group
router.post("/group-add", isLoggedIn, function(req, res){
	var name = req.body.category_add_name;
	var slug = req.body.category_add_slug;
	var icon = req.body.category_add_icon;

	dao.hadNameCategory(name, function(hadName){
		dao.hadSlugCategory(slug, function(hadSlug){
			if(hadName || hadSlug){
				req.session.errorAddCat = true;
				res.redirect("/admin/group-add");
			}
			else{
				dao.addCategory(name, slug, icon, function(){
					res.redirect("/admin/group");
				});	
			}
		});
	});
});

// Lấy categories

router.get("/categories", isLoggedIn, function(req, res){
	dao.getAllCategory(req.query.count, req.query.skip, function(categories){
			res.json(categories);
	});
});

//Kiếm tra tên nhóm sản phẩm đã tồn tại hay chưa?
router.post("/categories/add/checkName", isLoggedIn, function(req, res){
	dao.hadNameCategory(req.body.name, function(result){
		res.json(result);
	});
});

//Kiếm tra slug nhóm sản phẩm đã tồn tại hay chưa?
router.post("/categories/add/checkSlug", isLoggedIn, function(req, res){
	dao.hadSlugCategory(req.body.slug, function(result){
		res.json(result);
	});
});

// Order
router.get("/order", isLoggedIn, function(req, res){
	getHeaderAdmin(function(header) {
		getSidebarAdmin(function(sidebar){
			getBaseInfoOrderAdmin(function(countBills, countBillNotPaid, countBillCanceled, countBillCanceled, revenueInWeek,
										countBillNotDelivered, countBillDelivered, countBillPaid, countBillCompleted){
				res.render("admin/order", {"header": header, "sidebar":sidebar, "countBills" :countBills, "countBillNotPaid" : countBillNotPaid,
					"countBillCanceled" : countBillCanceled, "countBillCanceled": countBillCanceled, "revenueInWeek": revenueInWeek,
					"countBillNotDelivered" : countBillNotDelivered, "countBillDelivered" :countBillDelivered,
					"countBillPaid" : countBillPaid, "countBillCompleted" : countBillCompleted});
			});
		});
	});
});


router.get("/api/bills", isLoggedIn, function(req, res){
	switch (req.query.type) {
		case '0':
			dao.getAllBill(10, 0, function(bills){
				res.json(bills);
			});
			break;
		case '1':
			dao.getBillDelivered(10, 0, function(bills){
				res.json(bills);
			});
			break;
		case '2':
			dao.getBillNotDelivered(10, 0, function(bills){
				res.json(bills);
			});
			break;
		case '3':
			dao.getBillPaid(10, 0, function(bills){
				res.json(bills);
			});
			break;
		case '4':
			dao.getBillNotPaid(10, 0, function(bills){
				res.json(bills);
			});
			break;
		case '5':
			dao.getBillCompleted(10, 0, function(bills){
				res.json(bills);
			});
			break;
		case '6':
			dao.getBillCanceled(10, 0, function(bills){
				res.json(bills);
			});
			break;
	}
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

// Add accounts
router.post("/api/account/add", isLoggedIn, function(req, res){
	dao.fuck_addUserLocal_and_signup({
		username: req.body.username,
		fullname: req.body.fullname,
		email: req.body.email,
		phone: req.body.phone,
		role: req.body.role
	}, function(ok){
		if (ok)
			res.status(200).send("Done");
		else
			res.status(400).send("Fail to add user");
		});
});

router.get("/api/account/get/all", isLoggedIn, function(req, res){
	dao.getAllUser(function(data){
		res.json(data);
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

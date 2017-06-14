/*
*	username: nhom10
*	password: nhom10
*/

var router = require("express").Router();
var dao = require('../database/dao.js');
var async = require('async');
var formidable = require("express-formidable");
var fs = require("fs");
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
router.post("/api/products", isLoggedIn, function(req, res){
	var products = req.body.products;
	var status = req.body.status;
	var fQuery = [];
	var i = 0;
	products.forEach(function(product){
		fQuery.push(function(callback){
			dao.setStatusProduct(product, status, callback);
		});
	})
	async.parallel(fQuery,function(err, results){
		if(err) throw err;
		res.json({});
	});
});
// Routing thêm sản phẩm
router.get("/product/add", isLoggedIn, (req, res) => {
	var addProductFail = (req.session.addProductFail == undefined) ? false : req.session.addProductFail;
	req.session.addProductFail = false;
	var message = (addProductFail) ? "Thên sản phẩm thất bại" : "";
	getHeaderAdmin(function(header){
		getSidebarAdmin(function(sidebar){
			dao.getAllCategory(function (categories){
				res.render("admin/product-add", {"header": header, "sidebar": sidebar, categories: categories, message: message})
			})
		})
	});
});
// Nhân request submit form
Date.prototype.yyyymmddhhmmss = function() {
	var yyyy = this.getFullYear();
	var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
	var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
	var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
	var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
	var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
	return "".concat(yyyy).concat(mm).concat(dd).concat(hh).concat(min).concat(ss);
};
function getFilePath(name, path){
	var date = new Date();
	return path+date.yyyymmddhhmmss() + "-" +name;
}
router.post("/product/add", formidable(), isLoggedIn, (req, res) => {
	var name = req.fields.name;
	var slug = req.fields.slug;
	var price = parseInt(req.fields.price);
	var newPrice = (req.fields.newPrice == "") ? -1 : parseInt(req.fields.newPrice);
	var number = parseInt(req.fields.number);
	var detail = req.fields.detail;
	var categories = [];
	var numCat = parseInt(req.fields.count_cat);
	for (i = 0; i < numCat; i++){
		var cat = req.fields["cat_"+i];
		if (cat && cat != "0")
			categories.push(cat);
	}
	if(req.files.image.path){
		var imageUrl = getFilePath(req.files.image.name, "/uploads/");
		var imagePath = "./public" + imageUrl;
		var data = fs.readFileSync(req.files.image.path);
		if(fs.writeFileSync(imagePath, data) == undefined){
			// thành công
			dao.addProduct({
				name: name,
				slug: slug,
				price: price,
				newPrice: newPrice,
				quality: number,
				imgPath: imageUrl,
				categories: categories,
				detail: detail,
				status: "Đang bán"
			}, function(isSuccess){
				if(isSuccess)
					res.redirect("/admin/product")
				else {
					req.session.addProductFail = true;
					res.redirect("/admin/product/add")
				}
			})
		}else {
			req.session.addProductFail = true;
			res.redirect("/admin/product/add")
		}
	}

});
// Routing thêm sản phẩm
router.get("/product/edit", isLoggedIn, (req, res) => {
	var productID = req.query.id;
	if(productID == undefined) return res.redirect("/admin/product")
	var editProductFail = (req.session.editProductFail == undefined) ? false : req.session.editProductFail;
	req.session.editProductFail = false;
	var message = (editProductFail) ? "Sửa sản phẩm thất bại" : "";
	dao.getProductDetailByID(productID, function(product){
		if(product == null) return res.redirect("/admin/product")
		product.newPrice = (product.newPrice && product.newPrice > 0) ? product.newPrice : "";
		getHeaderAdmin(function(header){
			getSidebarAdmin(function(sidebar){
				dao.getAllCategory(function (categories){
					res.render("admin/product-edit", {"header": header, "sidebar": sidebar, "categories": categories, message: message, product: product})
				})
			})
		});
	})
});
router.post("/product/edit", formidable(), isLoggedIn, (req, res) => {
	var productID = req.fields.productID;
	var editImg	= req.fields.edit_img == "true";
	var name = req.fields.name;
	var slug = req.fields.slug;
	var price = parseInt(req.fields.price);
	if(req.fields.newPrice == "") console.log("ok");
	var newPrice = (req.fields.newPrice == "") ? -1 : parseInt(req.fields.newPrice);
	var number = parseInt(req.fields.number);
	var detail = req.fields.detail;
	var categories = [];
	var numCat = parseInt(req.fields.count_cat);
	var imageUrl = req.fields.imgPath;
	for (i = 0; i < numCat; i++){
		var cat = req.fields["cat_"+i];
		if (cat && cat != "0")
			categories.push(cat);
	}
	if(editImg && req.files.image.path){
		var imageUrl = getFilePath(req.files.image.name, "/uploads/");
		var imagePath = "./public" + imageUrl;
		var data = fs.readFileSync(req.files.image.path);
		if(fs.writeFileSync(imagePath, data) == undefined){
			// thành công
			dao.editProduct({
				productID: productID,
				name: name,
				slug: slug,
				price: price,
				newPrice: newPrice,
				quality: number,
				imgPath: imageUrl,
				categories: categories,
				detail: detail,
				status: "Đang bán"
			}, function(isSuccess){
				if(isSuccess)
					res.redirect("/admin/product")
				else {
					req.session.editProductFail = true;
					res.redirect("/admin/product/edit?id="+productID)
				}
			})
		}else {
			req.session.editProductFail = true;
			res.redirect("/admin/product/edit?id="+productID)
		}
	}else {
		dao.editProduct({
			productID: productID,
			name: name,
			slug: slug,
			price: price,
			newPrice: newPrice,
			quality: number,
			imgPath: imageUrl,
			categories: categories,
			detail: detail,
			status: "Đang bán"
		}, function(isSuccess){
			if(isSuccess)
				res.redirect("/admin/product")
			else {
				req.session.editProductFail = true;
				res.redirect("/admin/product/edit?id="+productID)
			}
		})
	}

});

router.get("/api/product/add", isLoggedIn, (req, res) => {
	var data = req.query.data;
	var type = req.query.type;
	switch(type){
		case "name":
			dao.getCountProductByName(data, function(count){
				return res.json(count == 0)
			});
			break;
		case "slug":
			dao.getCountProductBySlugR(data, function(count){
				return res.json(count == 0)
			});
			break;
	}
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
				res.render("admin/group-add", {"header": header, "sidebar":sidebar, message: message});
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
	dao.getAllCategory(function(categories){
		dao.countCategories(function(quality){
			res.json({categories, quality});
		});

	}, Number(req.query.count), Number(req.query.skip));
});

//Xóa category
router.post("/categories/delete", isLoggedIn, function(req, res){
	//Mảng các id của các categories cần xóa
	var categories = req.body.categories;
	var results = [];

	var catFunction = [];
	categories.forEach(function(category){
		catFunction.push(function(callback){
			dao.deleteCategory(category, function(result){
				callback(null, result);
			});
		});
	})
	async.parallel(catFunction,function(err, results){
		if(err) throw err;
		console.log(results)
		res.json(results);
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

//Xử lý router sửa thông tin nhóm sản phẩm
router.get("/group/edit", isLoggedIn, (req, res) => {
	var cateID = req.query.id;
	console.log(cateID);
	if(cateID == undefined) return res.redirect("admin/group");
	var editGroupFail = (req.session.editGroupFail == undefined) ? false : req.session.editGroupFail;
	req.session.editGroupFail = false;
	var message = (editGroupFail) ? "Sửa nhóm sản phẩm thất bại" : "";
	dao.getCategoryByID(cateID, function(cate){
		if(cate == null) return res.redirect("/admin/group");
		getHeaderAdmin(function(header){
			getSidebarAdmin(function(sidebar){
				res.render("admin/group-edit", {"header": header, "sidebar": sidebar, message: message, cate:cate})
			});
		});
	})
});
router.post("/group/edit", isLoggedIn, (req, res) => {

	var name = req.body.category_add_name;
	var id = req.body.cateID;
	var slug = req.body.category_add_slug;
	var icon = req.body.category_add_icon;

	dao.hadNameCategory(name, function(hadName){
		dao.hadSlugCategory(slug, function(hadSlug){
			if(hadName || hadSlug){
				req.session.errorAddCat = true;
				res.redirect("/admin/group/edit?id=" + id);
			}
			else{
				dao.updateCategory(id, name, slug, icon, function(){
					res.redirect("/admin/group");
				});
			}
		});
	});
});


/*
	var productID = req.fields.productID;
	var editImg	= req.fields.edit_img == "true";
	var name = req.fields.name;
	var slug = req.fields.slug;
	var price = parseInt(req.fields.price);
	if(req.fields.newPrice == "") console.log("ok");
	var newPrice = (req.fields.newPrice == "") ? -1 : parseInt(req.fields.newPrice);
	var number = parseInt(req.fields.number);
	var detail = req.fields.detail;
	var categories = [];
	var numCat = parseInt(req.fields.count_cat);
	var imageUrl = req.fields.imgPath;
	for (i = 0; i < numCat; i++){
		var cat = req.fields["cat_"+i];
		if (cat && cat != "0")
			categories.push(cat);
	}
	if(editImg && req.files.image.path){
		var imageUrl = getFilePath(req.files.image.name, "/uploads/");
		var imagePath = "./public" + imageUrl;
		var data = fs.readFileSync(req.files.image.path);
		if(fs.writeFileSync(imagePath, data) == undefined){
			// thành công
			dao.editProduct({
				productID: productID,
				name: name,
				slug: slug,
				price: price,
				newPrice: newPrice,
				quality: number,
				imgPath: imageUrl,
				categories: categories,
				detail: detail,
				status: "Đang bán"
			}, function(isSuccess){
				if(isSuccess)
					res.redirect("/admin/product")
				else {
					req.session.editProductFail = true;
					res.redirect("/admin/product/edit?id="+productID)
				}
			})
		}else {
			req.session.editProductFail = true;
			res.redirect("/admin/product/edit?id="+productID)
		}
	}else {
		dao.editProduct({
			productID: productID,
			name: name,
			slug: slug,
			price: price,
			newPrice: newPrice,
			quality: number,
			imgPath: imageUrl,
			categories: categories,
			detail: detail,
			status: "Đang bán"
		}, function(isSuccess){
			if(isSuccess)
				res.redirect("/admin/product")
			else {
				req.session.editProductFail = true;
				res.redirect("/admin/product/edit?id="+productID)
			}
		})
	}
	*/


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
	dao.fuck_addUserLocal_and_signup(
		true,
		{
			username: req.body.username,
			fullname: req.body.fullname,
			email: req.body.email,
			phone: req.body.phone,
			role: req.body.role,
			address: req.body.address,
			password: req.body.passwordCo
		}, function(ok){
		if (ok)
			res.status(200).send("Account " + req.body.username + " is added !");
		else
			res.status(400).send("Could not add account (" + req.body.username + ") because of duplicate username.");
		});
});

// Add accounts
router.get("/api/account/delete", isLoggedIn, function(req, res){
	console.log(req.query.users);
	req.query.users.forEach(function(user) {
    dao.deleteUser(user);
	});
	res.status(200).send("");
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

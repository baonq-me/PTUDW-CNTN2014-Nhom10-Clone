module.exports = function(app) {
	var dao = require('../database/dao.js');
	var FacebookStrategy = require("passport-facebook").Strategy;
	var captchapng = require('captchapng');

	// Mở kết nối cho db
	dao.connect(function(){});

	/************************** CÁC FUNCTION LẤY NÔI DUNG CƠ BẢN *******************/
	/*
	*	Lấy thông tin cài đặt header cơ bản
	*	@param 	thông tin tài khoản đăng nhập
	*		null nếu chưa đăng nhập
	*	@param 	callback(data)	trả về dữ liệu được lấy ra
	*		data : {category: array, login: {fullname: string}}	nếu đã đăng nhập
	*		data : {category: array}	nếu chưa đăng nhập
	*/
	var getHeader = function(user, callback){
		dao.getAllCategory(function(categorys){
			if(user != null){
				callback({"categorys": categorys, login: {fullname: user.fullName, changePassword: user.type==="local"}});
			}else callback({"categorys": categorys});
			
		});
	}
	/*
	*	Lấy thông tin cài đặt sidebar cơ bản
	*	@param 	callback(categories)
	*		categories : {categorys: array}
	*/
	var getSidebar = function(callback){
		dao.getAllCategory(function(categorys){
			callback({"categorys": categorys});
		});
	}
	/*
	*	Lấy thông tin cài đặt footer cơ bản
	*	@param 	callback() được gọi khi thực hiện xong
	*/
	var getFooter = function(callback){
		callback({});
	}


	/******************************* CÁC FUNCTION LẤY CONTENT *************/
	/*
	* Phần nội dung trang chủ
	*	@param 	callback({newProducts, promotionProducts})
	*		newProducts: {
	*			- id: mã sản phẩm (duy nhất)
	*			- name: tên sản phẩm
	*			- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*			- price: giá sản phẩm (đơn vị đông - kiểu number)
	*			- slug:
	*		}
	*		promotionProducts: {
	*			- id: mã sản phẩm (duy nhất)
	*			- name: tên sản phẩm
	*			- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*			- newPrice: Giá khuyến mãi (đơn vị đông - kiểu number)
	*			- price: giá sản phẩm (đơn vị đông - kiểu number)
	*			- slug: đường dẫn tới sản phẩm (không chứa root - localhost:3000)
	*		}
	*/
	var getContentHome = function(callback){
		dao.getNewProduct(6, function(newProducts){
			dao.getPromotionProduct(6, function(promotionProducts){
				callback ({"newProducts": newProducts, "promotionProducts": promotionProducts});
			});
		});
	}
	/*
	*	 Lấy thông tin người dùng
	*	@param 	Request được gửi từ client
	*	@out	null nếu chưa đăng nhập
	*			thông tin người dùng nếu đã đăng nhập
	*/
	var getCustomer = function(req){
		return req.isAuthenticated() ? req.user : null;
	}

	/*
	*	 Lấy thông tin các sản phẩm của category
	*	@param 	slug của category
	*	@param	callback(data) trả về data sau khi lấy giá trị xong
	*			data: null	nếu slug không đúng
	*			data: {catName: String, products: array(product)} trả về tên category và danh sách sản phẩm nếu category hợp lệ
	*				product: {
	*					- id: mã sản phẩm (duy nhất)
	*					- name: tên sản phẩm
	*					- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*					- newPrice: Giá khuyến mãi (đơn vị đông - kiểu number)
	*					- price: giá sản phẩm (đơn vị đông - kiểu number)
	*					- slug: đường dẫn tới sản phẩm (không chứa root - localhost:3000)
	*				}
	*/
	var getContentCategory = function(catSlug, callback){
		dao.getProductsByCategory([catSlug], 9, function(products){
			dao.getCatName(catSlug, function(catName){
				if(catName == null)
					callback(null);
				else
					callback({"catName": catName, "products": products});
			});
		});
	}

	/*
	*	Tìm kiếm product
	*	@param 	từ khóa tìm kiếm
	*	@param 	Tìm kiếm theo tiêu chí ("category", "price")
	*	@param	callback(data) trả về data sau khi lấy giá trị xong
	*			data: {products: array(product)} trả về danh sách sản phẩm được tìm thấy
	*				product: {
	*					- id: mã sản phẩm (duy nhất)
	*					- name: tên sản phẩm
	*					- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*					- newPrice: Giá khuyến mãi (đơn vị đông - kiểu number)
	*					- price: giá sản phẩm (đơn vị đông - kiểu number)
	*					- slug: đường dẫn tới sản phẩm (không chứa root - localhost:3000)
	*				}
	*/
	var getContentSearch = function(search, searchBy, callback){
		dao.getProductsBySearch(search, searchBy, 9, function(products){
			callback({"products": products});
		});
	}

	/*
	*	Lấy thông tin chi tiết sản phẩm
	*	@param 	slug của sản phẩm
	*	@param	callback(data) trả về data sau khi lấy giá trị xong
	*			data: null nếu slug không hợp lệ
	*			data: {"product": product, "relatedProducts": array(product)} trả về danh sách sản phẩm được tìm thấy
	*				product: Thông tin sản phẩm
	*				{
	*					- id: mã sản phẩm (duy nhất)
	*					- name: tên sản phẩm
	*					- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*					- newPrice: Giá khuyến mãi (đơn vị đông - kiểu number)
	*					- price: giá sản phẩm (đơn vị đông - kiểu number)
	*					- slug: đường dẫn tới sản phẩm (không chứa root - localhost:3000)
	*				}
	*				relatedProducts: Danh sách các sản phẩm liên quan
	*/
	var setContentProductDetail = function(slug, callback){
		dao.getProductDetail(slug, function(product){
			if(product == null){
				callback(null);
				return;
			}
			dao.getProductsByCategory(product.categorySlug, 8, function(relatedProducts){
				callback({"product": product, "relatedProducts": relatedProducts});
			});
		});
	}

	var captchaImg = function(){
        var p = new captchapng(80,30,parseInt(Math.random()*9000+1000)); // width,height,numeric captcha
        p.color(115, 95, 197, 100);  // First color: background (red, green, blue, alpha)
        p.color(30, 104, 21, 255); // Second color: paint (red, green, blue, alpha)
        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        return imgbase64;
	} ;

	// hàm set lỗi 404
	var set404 = function(req, res, callback){
		var user = getCustomer(req);
		getHeader(user, function(header){
			getFooter(function(footer){
				res.render("404", {"header": header, "footer": footer});
				callback();
			});
		});
	}

	/******************************** CẤU HÌNH CÁC ROUTING *****************/
	// Routing trang chủ
	app.get("/", function(req, res){
		var user = getCustomer(req);
		getHeader(user, function(header){
			getSidebar(function(sidebar){
				getFooter(function(footer){
					getContentHome(function(content){
						res.render("index", {"header": header, "sidebar": sidebar, "footer": footer, "content": content});
					});
				});
			});
		});
	});
	// Rounting category
	app.get("/category/:slug", function(req, res){
		var user = getCustomer(req);
		getHeader(user, function(header){
			getSidebar(function(sidebar){
				getFooter(function(footer){
					getContentCategory(req.params.slug, function(content){
						if(content == null){
							set404(req, res, function(){
							});
						} else {
							res.render("category", {"header": header, "sidebar": sidebar, "footer": footer, "content": content});
							
						}
					});
				});
			});
		});
	});

	// Rounting search
	app.get("/search", function(req, res){
		var search = req.query.search;
		var searchBy = req.query.searchBy;
		var user = getCustomer(req);
		getHeader(user, function(header){
			getSidebar(function(sidebar){
				getFooter(function(footer){
					getContentSearch(search, searchBy, function(content){
						res.render("search", {"query": req.query, "header": header, "sidebar": sidebar, "footer": footer, "content": content});
						
					});
				});
			});
		});
	});

	// Rounting search
	app.get("/product/:slug", function(req, res){
		var requrl = req.protocol + "://" + req.get('host') + req.originalUrl;
		var user = getCustomer(req);
		getHeader(user, function(header){
			getFooter(function(footer){
				setContentProductDetail(req.params.slug, function(content){
					if(content == null){
						set404(req, res, function(){
							
						});
						return;
					}
					res.render("product-detail", {"urlReq": requrl, "header": header, "footer": footer, "content": content});
				});
			});
		});
	});

	// Routin login
	app.get("/login",function(req, res){
		var login_fail = req.query.fail === "true";
		var user = getCustomer(req);
		if (user != null) res.redirect("/");
		else
			getHeader(null, function(header){
				getFooter(function(footer){
					res.render("login", {"header": header, "footer" : footer, "login_fail": login_fail});
				});
			});
	});
	
	// Routing sign-up
	app.get("/sign-up", function(req, res){
		var user = getCustomer(req);
		getHeader(user, function(header){
			getFooter(function(footer){
				var valicode = new Buffer(captchaImg()).toString('base64');
				res.render("sign-up", {"header": header, "footer" : footer, "valicode" : valicode});
			});
		});
	});

	// ĐĂNG KÝ TÀI KHOẢN
	app.post("/sign-up", function(req, res){
		dao.signup(req.body, function(success){
			if(success)
				res.redirect("/");
			else res.redirect("/sign-up");
		});
	});

	// Request từ sign up
	app.post("/field-sign-up", function(req, res){
		let field = req.body.field;
		let value = req.body.value;
		switch(field){
			case "email":
				dao.hadEmail(value,function(result){
					if(result)
						res.json({success: false, status: "Email đã có người xử dụng"});
					else res.json({success: true});
				});
				break;
			case "username":
				dao.hadUsername(value,function(result){
					if(result)
						res.json({success: false, status: "Tên đăng nhập đã có người xử dụng"});
					else res.json({success: true});
				});
				break;
		}
	});
  
	// Quên mật khẩu
	app.get("/forget-password", function(req, res){
		var user = getCustomer(req);
		getHeader(user, function(header){
			getFooter(function(footer){
				res.render("forget-password", {"header": header, "footer": footer})
			});
		});
	});

	// Kiểm tra thông tin username và mã được gửi email có khớp không
	var codes = [];
	app.post("/forget-password", function(req, res){
		var code = req.body.forget_pass_code;
		var username = req.body.forget_user;
		var item = codes.find(function(item){
			return item.username == username && item.code == code
		});
		if(item){
			var user = getCustomer(req);
			getHeader(user, function(header){
				getFooter(function(footer){
					res.render("set-new-password", {"header": header, "footer": footer, username: req.body.forget_user});
				});
			});
		} else res.redirect("/forget-password");
	});
	
	// Gửi email
	app.post("/send-email", function(req, res){
		let username = req.body.username;
		dao.getMail(username, function(mailTo){
			let code = Math.floor(Math.random()*9000+1000);
			codes.push({"username": username, "code": code});
			mail = require("./mail");
			if(mail({
				mailTo: mailTo.email,
				subject: 'Mã xác nhận từ Shop hoa KHTN', // Subject line
				text: 'Mã xác nhận', // plain text body
				html: 'Mã xác nhận của bạn là: <b>' + code + '</b>' // html body
			})) 
				res.json({success: true});
			else 
				res.json({success: false});
			if(mail == null){
				res.json({success: false});
				return;
			}
		});

	});

	// Cái password mới
	app.post("/set-new-password", function(req, res){
		var user = getCustomer(req);
		let username = req.body.username;
		let newpass = req.body.set_new_pass_pass1;
		dao.setNewPassword(username, newpass, function(){
			getHeader(user, function(header){
				getFooter(function(footer){
					res.render("set-new-password-success", {"header": header, "footer": footer, username: req.body.forget_user});
				});
			});
		});
	});

	// Rounting cho trang thay đổi mật khẩu khi đã đăng nhập
	app.get("/change-password", function(req, res){
		var user = getCustomer(req);
		if(user.type == "local")
			getHeader(user, function(header){
				getFooter(function(footer){
					res.render("set-new-password", {"header": header, "footer": footer, username: user.username});
				});
			});
		else res.redirect("/");
	})

	// Routing cho trang 404
	app.get("*", function(req, res){
		set404(req, res, function(){});
	});
}
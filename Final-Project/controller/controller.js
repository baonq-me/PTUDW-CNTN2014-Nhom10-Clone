module.exports = function(app) {
	var dao = require('../database/dao.js');
	var passport = require("passport");
	var LocalStrategy = require("passport-local").Strategy;
	var captchapng = require('captchapng');

	// Mở kết nối cho db
	dao.connect(function(){});
	// cài đặt header cơ bản
	var setHeader = function(callback){
		dao.getAllCategory(function(categorys){
			callback({"categorys": categorys});
		});
	}
	// cài đặt sidebar cơ bản
	var setSidebar = function(callback){
		dao.getAllCategory(function(categorys){
			callback({"categorys": categorys});
		});
	}
	// Cài đặt footer cơ bản
	var setFooter = function(callback){
		callback({});
	}


	var setContentHome = function(callback){
		dao.getNewProduct(6, function(newProducts){
			dao.getPromotionProduct(6, function(promotionProducts){
				callback ({"newProducts": newProducts, "promotionProducts": promotionProducts});
			});
		});
	}
	// Routing trang chủ
	app.get("/", function(req, res){
		setHeader(function(header){
			setSidebar(function(sidebar){
				setFooter(function(footer){
					setContentHome(function(content){
						res.render("index", {"header": header, "sidebar": sidebar, "footer": footer, "content": content});
					});
				});
			});
		});
	});
	var setContentCategory = function(catSlug, callback){
		dao.getProductsByCategory([catSlug], 9, function(products){
			dao.getCatName(catSlug, function(catName){
				if(catName == null)
					callback(null);
				else
					callback({"catName": catName, "products": products});
			});
		});
	}
	// Rounting category
	app.get("/category/:slug", function(req, res){
		setHeader(function(header){
			setSidebar(function(sidebar){
				setFooter(function(footer){
					setContentCategory(req.params.slug, function(content){
						if(content == null){
							set404(res, function(){
							});
						} else {
							res.render("category", {"header": header, "sidebar": sidebar, "footer": footer, "content": content});
							
						}
					});
				});
			});
		});
	});


	var setContentSearch = function(search, searchBy, callback){
		dao.getProductsBySearch(search, searchBy, 9, function(products){
			callback({"products": products});
		});
	}
	// Rounting search
	app.get("/search", function(req, res){
		var search = req.query.search;
		var searchBy = req.query.searchBy;
		setHeader(function(header){
			setSidebar(function(sidebar){
				setFooter(function(footer){
					setContentSearch(search, searchBy, function(content){
						res.render("search", {"query": req.query, "header": header, "sidebar": sidebar, "footer": footer, "content": content});
						
					});
				});
			});
		});
	});

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
	// Rounting search
	app.get("/product/:slug", function(req, res){
		var requrl = req.protocol + "://" + req.get('host') + req.originalUrl;
		setHeader(function(header){
			setFooter(function(footer){
				setContentProductDetail(req.params.slug, function(content){
					if(content == null){
						set404(res, function(){
							
						});
						return;
					}
					res.render("product-detail", {"urlReq": requrl, "header": header, "footer": footer, "content": content});
				});
			});
		});
	});
	var captchaImg = function(){
        var p = new captchapng(80,30,parseInt(Math.random()*9000+1000)); // width,height,numeric captcha
        p.color(115, 95, 197, 100);  // First color: background (red, green, blue, alpha)
        p.color(30, 104, 21, 255); // Second color: paint (red, green, blue, alpha)
        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        return imgbase64;
	} ;
	
	//Routing sign-up
	app.get("/sign-up", function(req, res){
		setHeader(function(header){
			setFooter(function(footer){
				//console.log(req.body.onsubmit);
				
				if(req.body.onsubmit == undefined){
					
					var valicode = new Buffer(captchaImg()).toString('base64');
					res.render("sign-up", {"header": header, "footer" : footer, "valicode" : valicode});
				}
				else{
					//do something when you submit form
				};
				
			});
		});
/*
		$("#name").focusout(function(){
			//check front-end
			//Check back-end use ajax
		})
*/
	});

	app.route("/login")
	.post(passport.authenticate('local', {failureRedirect: "/login"}), function(req, res){
		if(req.isAuthenticated())
			res.json({success: true});
		else res.json({success: false});
	});

	// Kiểm tra đăng nhập
	passport.use(new LocalStrategy(
		{
			usernameField: 'username',	// tên của input username được request từ client
	    	passwordField: 'password'	// tên của input password được request từ client
		},
		function(username, password, done){
			dao.login(username, password, function(success){
				if(success){
					dao.getUser(username, function(user){
						return done(null, user);
					});
				} else{ return done(null, false); }
			});
		}
	));
	passport.serializeUser(function(user, done){
		done(null, user.userName);
	});
	passport.deserializeUser(function(name, done){
		dao.getUser(name, function(user){
			return done(null, user);
		})
	});
	// Kết thúc kiểm tra đăng nhập

	app.get("/private", function(req, res){
		if(req.isAuthenticated()){
			res.send("Đăng nhập thành công");
		} else res.send("Đăng nhập thất bại");
	});

	var set404 = function(res, callback){
		setHeader(function(header){
			setFooter(function(footer){
				res.render("404", {"header": header, "footer": footer});
				callback();
			});
		});
	}

	app.get("*", function(req, res){
		set404(res, function(){
				
		});
	});
}
module.exports = function(app) {
	var dao = require('../database/dao.js');
	var passport = require("passport");
	var LocalStrategy = require("passport-local").Strategy;
	var captchapng = require('captchapng');

	// Mở kết nối cho db
	dao.connect(function(){});
	// cài đặt header cơ bản
	var setHeader = function(user, callback){
		dao.getAllCategory(function(categorys){
			if(user != null){
				callback({"categorys": categorys, login: {fullname: user.fullName}});
			}else callback({"categorys": categorys});
			
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

	// Phần nội dung trang chủ
	var setContentHome = function(callback){
		dao.getNewProduct(6, function(newProducts){
			dao.getPromotionProduct(6, function(promotionProducts){
				callback ({"newProducts": newProducts, "promotionProducts": promotionProducts});
			});
		});
	}
	// Routing trang chủ
	app.get("/", function(req, res){
		var user = req.isAuthenticated() ? req.user : null;
		setHeader(user, function(header){
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
		var user = req.isAuthenticated() ? req.user : null;
		setHeader(user, function(header){
			setSidebar(function(sidebar){
				setFooter(function(footer){
					setContentCategory(req.params.slug, function(content){
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


	var setContentSearch = function(search, searchBy, callback){
		dao.getProductsBySearch(search, searchBy, 9, function(products){
			callback({"products": products});
		});
	}
	// Rounting search
	app.get("/search", function(req, res){
		var search = req.query.search;
		var searchBy = req.query.searchBy;
		var user = req.isAuthenticated() ? req.user : null;
		setHeader(user, function(header){
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
		var user = req.isAuthenticated() ? req.user : null;
		setHeader(user, function(header){
			setFooter(function(footer){
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
		var user = req.isAuthenticated() ? req.user : null;
		setHeader(user, function(header){
			setFooter(function(footer){
				var valicode = new Buffer(captchaImg()).toString('base64');
				res.render("sign-up", {"header": header, "footer" : footer, "valicode" : valicode});
			});
		});
	});

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

	app.route("/login")
	.post(passport.authenticate('local', {failureRedirect: "/login"}), function(req, res){
		res.json({success: true});
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
		done(null, user.username);
	});
	passport.deserializeUser(function(name, done){
		dao.getUser(name, function(user){
			return done(null, user);
		})
	});
	// Kết thúc kiểm tra đăng nhập
	// Test đăng nhập
	app.get("/private", function(req, res){
		if(req.isAuthenticated()){
			res.send("Đăng nhập thành công");
		} else res.send("Đăng nhập thất bại");
	});

	app.post("/logout", function(req, res){
		req.logout();
		res.json({});
	});
  
	// Quên mật khẩu
	app.get("/forget-password", function(req, res){
		var user = req.isAuthenticated() ? req.user : null;
		setHeader(user, function(header){
			setFooter(function(footer){
				res.render("forget-password", {"header": header, "footer": footer})
			});
		});
	});
	app.post("/forget-password", function(req, res){
		var code = req.body.forget_pass_code;
		var username = req.body.forget_user;
		var item = codes.find(function(item){
			return item.username == username && item.code == code
		});
		if(item){
			var user = req.isAuthenticated() ? req.user : null;
			setHeader(user, function(header){
				setFooter(function(footer){
					res.render("set-new-password", {"header": header, "footer": footer, username: req.body.forget_user});
				});
			});
		} else res.redirect("/forget-password");
	});
	var codes = [];
	app.post("/send-email", function(req, res){
		let username = req.body.username;
		dao.getMail(username, function(mail){
			console.log("send email: " + mail);
				let code = Math.floor(Math.random()*9000+1000);
				codes.push({"username": username, "code": code});
				const nodemailer = require('nodemailer');
				// create reusable transporter object using the default SMTP transport
				let transporter = nodemailer.createTransport({
				    service: 'gmail',
				    auth: {
				        user: 'nhom10.ptudw@gmail.com',
				        pass: '12345678@ptudw'
				    }
				});

				// setup email data with unicode symbols
				let mailOptions = {
				    from: '"Nhóm 10" <nhom10.ptudw@gmail.com>', // sender address
				    to: mail, // list of receivers
				    subject: 'Mã xác nhận từ Shop hoa KHTN', // Subject line
				    text: 'Mã xác nhận', // plain text body
				    html: 'Mã xác nhận của bạn là: <b>' + code + '</b>' // html body
				};

				// send mail with defined transport object
				transporter.sendMail(mailOptions, (error, info) => {
				    if (error) {
				        return console.log(error);
				    }
				    console.log('Message %s sent: %s', info.messageId, info.response);
				});
		});

	});
	app.post("/set-new-password", function(req, res){
		var user = req.isAuthenticated() ? req.user : null;
		let username = req.body.username;
		let newpass = req.body.set_new_pass_pass1;
		dao.setNewPassword(username, newpass, function(){
			setHeader(user, function(header){
				setFooter(function(footer){
					res.render("set-new-password-success", {"header": header, "footer": footer, username: req.body.forget_user});
				});
			});
		});
	});
	app.get("/change-password", function(req, res){
		var user = req.isAuthenticated() ? req.user : null;
		setHeader(user, function(header){
			setFooter(function(footer){
				res.render("set-new-password", {"header": header, "footer": footer, username: user.username});
			});
		});
	})

	var set404 = function(req, res, callback){
		var user = req.isAuthenticated() ? req.user : null;
		setHeader(user, function(header){
			setFooter(function(footer){
				res.render("404", {"header": header, "footer": footer});
				callback();
			});
		});
	}

	app.get("*", function(req, res){
		set404(req, res, function(){});
	});
}
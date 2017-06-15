// type: admin or customer
var router = require("express").Router();

	var dao = require('../database/dao.js');
	var passport = require("passport");
	var LocalStrategy = require("passport-local").Strategy;
	var FacebookStrategy = require("passport-facebook").Strategy;
	var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

	/***************************** CẤU HÌNH CÁC ROUTING *******************/
	// Routing login local
	router.post("/auth/local", function(req, res, next) {
		var username = req.body.username;
		var redirectFromLogin = req.session.redirectFromLogin || "/";
 		passport.authenticate('local-customer', function(err, user, info) {
			if (err) { return next(err); }
			if (!user || user.role.name != "customer") { return res.redirect('/login?fail=true&username=' + username); }
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				req.session.redirectFromLogin = null;
				return res.redirect(redirectFromLogin);
			});
		})(req, res, next);
	});
	// Routing login local admin
	router.post("/admin/auth/local", passport.authenticate('local-admin', {successRedirect: "/admin", failureRedirect:"/admin/login"}));

	// Cấu hình routing login facebook
	router.get("/auth/fb", passport.authenticate('facebook', {scope:["email", "user_location"]}));
	router.get("/auth/fb/cb", function(req, res, next) {
		var redirectFromLogin = req.session.redirectFromLogin || "/";
 		passport.authenticate('facebook', function(err, user, info) {
			if (err) { return next(err); }
			if (!user) { return res.redirect('/login?fail=true'); }
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				req.session.redirectFromLogin = "/";
				return res.redirect(redirectFromLogin);
			});
		})(req, res, next);
	});
	// Cấu hình routing login google
	router.get("/auth/gg", passport.authenticate('google', {scope:["profile", "email"]}));
	router.get("/auth/gg/cb", function(req, res, next) {
		var redirectFromLogin = req.session.redirectFromLogin || "/";
 		passport.authenticate('google', function(err, user, info) {
			if (err) { return next(err); }
			if (!user) { return res.redirect('/login?fail=true'); }
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				req.session.redirectFromLogin = "/";
				return res.redirect(redirectFromLogin);
			});
		})(req, res, next);
	});


	/****************************** CẤU HÌNH CÁC SECTION VÀ COOKIE *************/
	// Lưu section
	passport.serializeUser(function(user, done){
		done(null, user._id);
	});
	// Kiểm tra section
	passport.deserializeUser(function(id, done){
		dao.getUserByID(id, function(user){
			return done(null, user);
		})
	});

	/****************************** KIỂM TRA CÁC ĐĂNG NHẬP ************/
	// Kiểm tra đăng nhập facebook
	passport.use(new FacebookStrategy(
		{
			clientID: "801495239999622",
			clientSecret: "e15683384ec8ca903271d0b20add0b7c",
			callbackURL: "http://bao.nhom10.gomakers.vn/auth/fb/cb",
			profileFields: ["email", "picture.type(large)", "displayName", "location"]
		},
		function (accessToken, refreshToken, profile, done){
			dao.getUserSocial({typeS: "facebook", idS: profile._json.id}, function(user){
				if(user != null) return done(null, user);
				// Viết thêm vào database
				user = {
					uid: {typeS: "facebook", idS: profile._json.id},
					fullName: profile._json.name,
					type: "facebook",
					email: profile._json.email,
					address: (profile._json.location==undefined) ? "" : profile._json.location.name,
					avatarPath: profile._json.picture.data.url
				};
				dao.addUserSocial(user, function(success){
					if(success){
						dao.getUserSocial(user.uid, function(userSocial){
							return done(null, userSocial);
						});
					}
					else return done("error");
				});
			});
		}
	));

	// Kiểm tra đăng nhập google
	passport.use(new GoogleStrategy(
		{
			clientID: "844347689148-l9j7jcpi4desba3u8q2ui6u443eu03l6.apps.googleusercontent.com",
			clientSecret: "gElzK3xqALTiR5cSDaCQbGw0",
			callbackURL: "http://bao.nhom10.gomakers.vn/auth/gg/cb",
		},
		function (accessToken, refreshToken, profile, done){
			dao.getUserSocial({typeS: "google", idS: profile.id}, function(user){
				if(user != null) return done(null, user);
				// Viết thêm vào database
				user = {
					uid: {typeS: "google", idS: profile.id},
					fullName: profile.displayName,
					type: "google",
					email: profile.emails[0].value,
					avatarPath: profile._json.image.url.substring(0, profile._json.image.url.length-2) + '300'
				};
				dao.addUserSocial(user, function(success){
					if(success){
						dao.getUserSocial(user.uid, function(userSocial){
							return done(null, userSocial);
						});
					}
					else return done("error");
				});
			});
		}
	));
	// Kiểm tra đăng nhập local
	passport.use("local-customer", new LocalStrategy(
		{
			usernameField: 'username',	// tên của input username được request từ client
	    	passwordField: 'password'	// tên của input password được request từ client
		},
		function(username, password, done){
			console.log(username + password)
			dao.login(username, password, function(success){
				if(success){
					dao.getUser(username, function(user){
						if (user.role.name != "customer")
							return done(null, false);
						return done(null, user);
					});
				} else{ return done(null, false); }
			});
		}
	));
	// Kiểm tra đăng nhập local admin
	passport.use("local-admin", new LocalStrategy(
		{
			usernameField: 'username',	// tên của input username được request từ client
	    	passwordField: 'password',	// tên của input password được request từ client
	    	passReqToCallback: true
		},
		function(req, username, password, done){
			dao.login(username, password, function(success){
				if(success){
					dao.getUser(username, function(user){
						if (user.role.name != "admin")
							return done(null, false, req.flash("error", "Tên đăng nhập hoặc mật khẩu không đúng"));
						return done(null, user);
					});
				} else{ return done(null, false, req.flash("error", "Tên đăng nhập hoặc mật khẩu không đúng")); }
			});
		}
	));

	// Test đăng nhập
	router.get("/private", function(req, res){
		if(req.isAuthenticated()){
			res.send("Đăng nhập thành công");
		} else res.send("Đăng nhập thất bại");
	});
	// Routing logout customer
	router.post("/logout", function(req, res){
		if(req.isAuthenticated() && req.user.role.name == "customer")
			req.logout();
		res.json({});
	});
	// Logout admin
	router.get("/admin/logout", (req, res) => {
		if(req.isAuthenticated() && req.user.role.name != "customer")
			req.logout();
		res.redirect("/admin");
	});


module.exports = router;

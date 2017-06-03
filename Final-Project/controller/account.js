// type: admin or custumer
module.exports = function(app){
	var dao = require('../database/dao.js');
	var passport = require("passport");
	var LocalStrategy = require("passport-local").Strategy;
	var FacebookStrategy = require("passport-facebook").Strategy;
	var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

	/***************************** CẤU HÌNH CÁC ROUTING *******************/
	// Routing login local
	app.post("/auth/local", function(req, res, next) {
		var redirect = 
 		passport.authenticate('local', function(err, user, info) {
			if (err) { return next(err); }
			if (!user) { return res.redirect('/login?fail=true'); }
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.redirect('/');
			});
		})(req, res, next);
	});
	// Cấu hình routing login facebook
	app.get("/auth/fb", passport.authenticate('facebook', {scope:["email", "user_location"]}));
	app.get("/auth/fb/cb", passport.authenticate("facebook", {failureRedirect: "/login?fail=true", successRedirect:"/"}), function(req, res){
		res.json({success: true});
	});
	// Cấu hình routing login google
	app.get("/auth/gg", passport.authenticate('google', {scope:["profile", "email"]}));
	app.get("/auth/gg/cb", passport.authenticate("google", {failureRedirect: "/login?fail=true", successRedirect:"/"}), function(req, res){
		res.json({success: true});
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
			callbackURL: "http://localhost:3000/auth/fb/cb",
			//profileFields: ["email", "displayName", "location"]
		}, 
		function (accessToken, refreshToken, profile, done){
			dao.getUserSocial({facebook: profile._json.id}, function(user){
				if(user != null) return done(null, user);
				// Viết thêm vào database
				user = {
					uid: {facebook: profile._json.id},
					fullName: profile._json.name,
					type: "facebook",
					email: profile._json.email,
					address: (profile._json.location==undefined) ? "" : profile._json.location.name,
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
			callbackURL: "http://localhost:3000/auth/gg/cb",
		}, 
		function (accessToken, refreshToken, profile, done){
			dao.getUserSocial(profile.id, function(user){
				if(user != null) return done(null, user);
				// Viết thêm vào database
				user = {
					uid: {google: profile.id},
					fullName: profile.displayName,
					type: "google",
					email: profile.emails[0].value,
				};
				dao.addUserSocial(user, function(success){
					if(success){
						dao.getUserSocial(user.uid.google, function(userSocial){
							return done(null, userSocial);
						});
					}
					else return done("error");
				});
			});
		}
	));
	// Kiểm tra đăng nhập local
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

	// Test đăng nhập
	app.get("/private", function(req, res){
		if(req.isAuthenticated()){
			res.send("Đăng nhập thành công");
		} else res.send("Đăng nhập thất bại");
	});
	// Routing logout
	app.post("/logout", function(req, res){
		req.logout();
		res.json({});
	});
}
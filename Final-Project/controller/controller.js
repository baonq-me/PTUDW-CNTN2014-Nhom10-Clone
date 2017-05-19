module.exports = function(app) {
	var dao = require('../database/dao.js');
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
	/*
	var setSite = function(setHeader, setSidebar, setFooter, setContent, viewengine){
		setHeader(function(header){
			setSidebar(function(sidebar){
				setFooter(function(footer){
					setContentHome(function(content){
						res.render("index", {"header": header})
					});
				});
			});
		});
	}*/


	var setContentHome = function(callback){
		dao.getNewProduct(6, function(newProducts){
			dao.getPromotionProduct(6, function(promotionProducts){
				callback ({"newProducts": newProducts, "promotionProducts": promotionProducts});
			});
		});
	}
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
		dao.getProductsByCategory(catSlug, 9, function(products){
			callback({"products": products});
		});
	}
	app.get("/category/:slug", function(req, res){
		setHeader(function(header){
			setSidebar(function(sidebar){
				setFooter(function(footer){
					setContentCategory(req.params.slug, function(content){
						res.render("category", {"header": header, "sidebar": sidebar, "footer": footer, "content": content});
					});
				});
			});
		});
	});







	app.get("*", function(req, res){
		setHeader(function(header){
			setFooter(function(footer){
				res.render("404", {"header": header, "footer": footer});
			});
		});
	});
}
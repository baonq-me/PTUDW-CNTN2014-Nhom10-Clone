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
	// Routing trang chủ
	app.get("/", function(req, res){
		dao.connect(function(){
			setHeader(function(header){
				setSidebar(function(sidebar){
					setFooter(function(footer){
						setContentHome(function(content){
							res.render("index", {"header": header, "sidebar": sidebar, "footer": footer, "content": content});
							dao.close();
						});
					});
				});
			});
		});
	});
	var setContentCategory = function(catSlug, callback){
		dao.getProductsByCategory(catSlug, 9, function(products){
			dao.getCatName(catSlug, function(catName){
				callback({"catName": catName, "products": products});
			});
		});
	}
	// Rounting category
	app.get("/category/:slug", function(req, res){
		dao.connect(function(){
			setHeader(function(header){
				setSidebar(function(sidebar){
					setFooter(function(footer){
						setContentCategory(req.params.slug, function(content){
							res.render("category", {"header": header, "sidebar": sidebar, "footer": footer, "content": content});
							dao.close();
						});
					});
				});
			});
		})
		
	});


	var setContentSearch = function(search, searchBy, callback){
		dao.getProductsBySearch(search, searchBy, 12, function(products){
			callback({"products": products});
		});
	}
	// Rounting search
	app.get("/search", function(req, res){
		var search = req.query.search;
		var searchBy = req.query.searchBy;
		dao.connect(function(){
			setHeader(function(header){
				setSidebar(function(sidebar){
					setFooter(function(footer){
						setContentSearch(search, searchBy, function(content){
							res.render("search", {"query": req.query, "header": header, "sidebar": sidebar, "footer": footer, "content": content});
							dao.close();
						});
					});
				});
			});
		})
		
	});

	var setContentProductDetail = function(slug, callback){
		dao.getProductDetail(slug, function(product){
			dao.getProductsByCategory(product.categorySlug, 8, function(relatedProducts){
				callback({"product": product, "relatedProducts": relatedProducts});
			});
		});
	}
	// Rounting search
	app.get("/product/:slug", function(req, res){
		var requrl = req.protocol + "://" + req.get('host') + req.originalUrl;
		dao.connect(function(){
			setHeader(function(header){
				setFooter(function(footer){
					setContentProductDetail(req.params.slug, function(content){
						res.render("product-detail", {"urlReq": requrl, "header": header, "footer": footer, "content": content});
						dao.close();
					});
				});
			});
		})
		
	});


	app.get("*", function(req, res){
		setHeader(function(header){
			setFooter(function(footer){
				res.render("404", {"header": header, "footer": footer});
			});
		});
	});
}
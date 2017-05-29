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
				if(catName == null)
					callback(null);
				else
					callback({"catName": catName, "products": products});
			});
		});
	}
	// Rounting category
	app.get("/category/:slug", function(req, res){
		console.log(req.params.slug);
		dao.connect(function(){
			setHeader(function(header){
				setSidebar(function(sidebar){
					setFooter(function(footer){
						setContentCategory(req.params.slug, function(content){
							if(content == null){
								set404(res, function(){
									dao.close();
								});
							} else {
								res.render("category", {"header": header, "sidebar": sidebar, "footer": footer, "content": content});
								dao.close();
							}
						});
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
		dao.connect(function(){
			setHeader(function(header){
				setFooter(function(footer){
					setContentProductDetail(req.params.slug, function(content){
						if(content == null){
							set404(res, function(){
								dao.close();
							});
							return;
						}
						res.render("product-detail", {"urlReq": requrl, "header": header, "footer": footer, "content": content});
						dao.close();
					});
				});
			});
		})
		
	});

	//Routing sign up
	app.get("/sign-up", function(req, res){
		dao.connect(function(){
			setHeader(function(header){
				setFooter(function(footer){
					//if(req.bodyParser.onsubmit=="true")
					res.render("sign-up", {"header": header, "footer" : footer});
					dao.close();
				});
			});
		});	
/*
		$("#name").focusout(function(){
			//check front-end
			//Check back-end use ajax
		})
*/
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
		dao.connect(function(){
			set404(res, function(){
				dao.close();
			});
		});
	});
}
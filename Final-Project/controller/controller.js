module.exports = function(app) {
	var dao = require('../database/dao.js');

	app.get("/", function(req, res){
		dao.getAllCategory(function(categorys){
			dao.getNewProduct(6, function(newProducts){
				dao.getPromotionProduct(6, function(promotionProducts){
					res.render("index", {"categorys": categorys, "newProducts": newProducts, "promotionProducts": promotionProducts});
				});
			});
		});
	});
}
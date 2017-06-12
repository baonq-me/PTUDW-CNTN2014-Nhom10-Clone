var router = require("express").Router();

var dao = require('../database/dao.js');
var braintree = require('braintree');
var csrf = require('csurf');
var csrfProtection = csrf();
var gateway = braintree.connect({
  accessToken: 'access_token$sandbox$yxq79p88jhvjh5rm$b4d73266122796a1a58e79b1507dfec7'
});

/*var csrf = require('csurf');
var csrfProtection = csrf({ignoreMethods: ['GET','POST']});
router.use(csrfProtection);*/

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


function setHeader(req, res, next){
	var user = getCustomer(req);
	dao.getAllCategory(function(categorys){
		if(user != null && user.role.name == "customer"){
			var avatarPath = (user.baseInfo.avatarPath) ? user.baseInfo.avatarPath : "images/avatar_member.png";
			 res.locals.header = {"categorys": categorys, login: {avatarPath: avatarPath, fullname: user.baseInfo.fullName, changePassword: user.loginInfo.typeLg==="local"}};
		}else res.locals.header = {"categorys": categorys};
		return next()
	});
}
function setFooter(req, res, next){
	res.locals.footer = {};
	return next();
}
function setSidebar(req, res, next){
	dao.getAllCategory(function(categorys){
		res.locals.sidebar = {"categorys": categorys};
		return next();
	});
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
	dao.getNewProduct(0, 6, function(newProducts){
		dao.getPromotionProduct(0, 6, function(promotionProducts){
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
var getContentSearch = function(search, priceFrom, priceTo, searchBy, start, step, callback){
	dao.getProductsBySearch({
		search: search,
		priceFrom: priceFrom,
		priceTo: priceTo,
		searchBy: searchBy,
		skip: start,
		step: step
	},
	function(products){
		dao.getCountProductBySlugBySearch({
			search: search,
			priceFrom: priceFrom,
			priceTo: priceTo,
			searchBy: searchBy
		},
		function(countProduct){
				var countPage = Math.ceil(countProduct / step);
				var pageActive = Math.ceil(start / step);
				start = pageActive * step;

				var startPrev = (start - step < 0) ? 0 : start - step;
				var startNext = (start + step > countProduct - 1) ? countProduct - 1 : start + step;

				var hrefPrev = (pageActive > 0) ? "?start=" + startPrev : undefined;
				var hrefNext = (pageActive < countPage - 1) ? "?start=" + startNext : undefined;

				var count = 0;
				var pages = [];
				var pageStart = (countPage - 1 - pageActive < 2) ? countPage - 5 : pageActive - 2;
				for (i = pageStart; i < countPage; i++){
					if (i < 0) continue;
					if (count == 5) break;
					if (i == pageActive)
						pages.push({ page: i+1, start: i*step, class: "active"});
					else pages.push({ page: i+1, start: i*step, class: "" });
					count ++;
				}

				callback({
						"products": products,
						"pages": pages,
						"start_have_page": pageActive > 2,
						"end_have_page": countPage - pageActive - 1 > 2,
						"hrefNext": hrefNext,
						"hrefPrev": hrefPrev
					});
		});
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
		dao.getProductsByCategory(product.categorySlug, 0, 8, function(relatedProducts){
			callback({"product": product, "relatedProducts": relatedProducts});
		});
	});
}

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
// Format giá tiền theo định dạng 100,000
// @param: string 	giá tiền
function formatingPrice(price){
	return price.replace(/./g, function(c, i, a) {
		return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
	});
}
// Kiểm tra chuỗi rỗng hoặc ""
function isEmpty(v){
	return v == undefined || v == "";
}
// Kiểm tra receiverInfo có hợp lệ không
function checkReceiverInfo(receiverInfo){
	return !(isEmpty(receiverInfo.name) || isEmpty(receiverInfo.phone) || isEmpty(receiverInfo.date)
		|| isEmpty(receiverInfo.address) || isEmpty(receiverInfo.district) || isEmpty(receiverInfo.city))
}
// Kiểm tra đã đăng nhập chưa
function isLoggedIn(req, res, next){
	var user = getCustomer(req);
	if(user == null || user.role.name != "customer") {
		req.session.redirectFromLogin = req.path;
		return res.redirect("/login");
	}
	return next();
}
/******************************** CẤU HÌNH CÁC ROUTING *****************/
// Routing trang chủ
router.get("/", setHeader, setSidebar, setFooter, function(req, res, next){
	getContentHome(function(content){
		res.render("index", {"content": content});
	});
});
// Rounting sản phẩm mới
router.get("/san-pham-moi", setHeader, setFooter, setSidebar,function(req, res){
	var step = 9;
	var catSlug = req.params.slug;
	var start = (req.query.start) ? parseInt(req.query.start) : 0;
	if (start < 0) return set404(req, res, function(){});

	dao.getNewProduct(start, step, function(products){
		if(products.length < 1)
			return set404(req, res, function(){});
		dao.countProducts(function(countProduct){
			var countPage = Math.ceil(countProduct / step);
			var pageActive = Math.ceil(start / step);
			start = pageActive * step;

			var startPrev = (start - step < 0) ? 0 : start - step;
			var startNext = (start + step > countProduct - 1) ? countProduct - 1 : start + step;

			var hrefPrev = (pageActive > 0) ? "?start=" + startPrev : undefined;
			var hrefNext = (pageActive < countPage - 1) ? "?start=" + startNext : undefined;

			var count = 0;
			var pages = [];
			var pageStart = (countPage - 1 - pageActive < 2) ? countPage - 5 : pageActive - 2;
			for (i = pageStart; i < countPage; i++){
				if (i < 0) continue;
				if (count == 5) break;
				if (i == pageActive)
					pages.push({ page: i+1, start: i*step, class: "active"});
				else pages.push({ page: i+1, start: i*step, class: "" });
				count ++;
			}

			res.render("category", 
				{"content": {
					"catName": "Sản phẩm mới",
					"products": products,
					"pages": pages,
					"start_have_page": pageActive > 2,
					"end_have_page": countPage - pageActive - 1 > 2,
					"hrefNext": hrefNext,
					"hrefPrev": hrefPrev
				}}
			);
		});
	});
});
// Rounting sản phẩm khuyến mãi
router.get("/san-pham-khuyen-mai", setHeader, setFooter, setSidebar,function(req, res){
	var step = 9;
	var catSlug = req.params.slug;
	var start = (req.query.start) ? parseInt(req.query.start) : 0;
	if (start < 0) return set404(req, res, function(){});

	dao.getPromotionProduct(start, step, function(products){
		if(products.length < 1)
			return set404(req, res, function(){});
		dao.getCountPromotionProduct(function(countProduct){
			var countPage = Math.ceil(countProduct / step);
			var pageActive = Math.ceil(start / step);
			start = pageActive * step;

			var startPrev = (start - step < 0) ? 0 : start - step;
			var startNext = (start + step > countProduct - 1) ? countProduct - 1 : start + step;

			var hrefPrev = (pageActive > 0) ? "?start=" + startPrev : undefined;
			var hrefNext = (pageActive < countPage - 1) ? "?start=" + startNext : undefined;

			var count = 0;
			var pages = [];
			var pageStart = (countPage - 1 - pageActive < 2) ? countPage - 5 : pageActive - 2;
			for (i = pageStart; i < countPage; i++){
				if (i < 0) continue;
				if (count == 5) break;
				if (i == pageActive)
					pages.push({ page: i+1, start: i*step, class: "active"});
				else pages.push({ page: i+1, start: i*step, class: "" });
				count ++;
			}

			res.render("category", 
				{"content": {
					"catName": "Sản phẩm mới",
					"products": products,
					"pages": pages,
					"start_have_page": pageActive > 2,
					"end_have_page": countPage - pageActive - 1 > 2,
					"hrefNext": hrefNext,
					"hrefPrev": hrefPrev
				}}
			);
		});
	});
});
// Rounting category
router.get("/category/:slug", setHeader, setSidebar, setFooter, function(req, res){
	var step = 9;
	var catSlug = req.params.slug;
	var start = (req.query.start) ? parseInt(req.query.start) : 0;
	if (start < 0) return set404(req, res, function(){});
	dao.getProductsByCategory([catSlug], start, step, function(products){
		if(products.length < 1)
			return set404(req, res, function(){});
		dao.getCatName(catSlug, function(catName){
			if(catName == null)
				return set404(req, res, function(){});
			dao.getCountProductBySlug([catSlug], function(countProduct){
				var countPage = Math.ceil(countProduct / step);
				var pageActive = Math.ceil(start / step);
				start = pageActive * step;

				var startPrev = (start - step < 0) ? 0 : start - step;
				var startNext = (start + step > countProduct - 1) ? countProduct - 1 : start + step;

				var hrefPrev = (pageActive > 0) ? "?start=" + startPrev : undefined;
				var hrefNext = (pageActive < countPage - 1) ? "?start=" + startNext : undefined;

				var count = 0;
				var pages = [];
				var pageStart = (countPage - 1 - pageActive < 2) ? countPage - 5 : pageActive - 2;
				for (i = pageStart; i < countPage; i++){
					if (i < 0) continue;
					if (count == 5) break;
					if (i == pageActive)
						pages.push({ page: i+1, start: i*step, class: "active"});
					else pages.push({ page: i+1, start: i*step, class: "" });
					count ++;
				}

				res.render("category", 
					{"content": {
						"catName": catName,
						"products": products,
						"pages": pages,
						"start_have_page": pageActive > 2,
						"end_have_page": countPage - pageActive - 1 > 2,
						"hrefNext": hrefNext,
						"hrefPrev": hrefPrev
					}}
				);
			});
		});
	});
});
// Rounting Hoa và cuộc sống
router.get("/meaning-flowers", setHeader, setFooter, function(req, res){
	res.render("meaning-flowers/index");
});

// Rounting Hoa và cuộc sống
router.get("/meaning-flowers/:flowername", setHeader, setFooter, function(req, res){
	var flowername = req.params.flowername;
	var renderFile = "meaning-flowers/" + flowername;
	res.render(renderFile, function(err, data, next){
		if(err) return set404(req, res, function(){});
		res.render(renderFile);
	});
});

// Rounting search
router.get("/search", setHeader, setSidebar, setFooter, function(req, res){
	var queryString = req.url;
	queryString += (req.url.indexOf("?") == -1) ? "?" : "";
	var step = 9;
	var start = (req.query.start) ? parseInt(req.query.start) : 0;

	var searchBy = (req.query.searchBy) ? req.query.searchBy : "0";
	var search = req.query.search;
	var priceFrom = req.query.priceFrom;
	var priceTo = req.query.priceTo;

	priceTo = (Number.isNaN(parseInt(priceTo))) ? 9999999999 : parseInt(priceTo);
	priceFrom = (Number.isNaN(parseInt(priceFrom))) ? 0 : parseInt(priceFrom);
	getContentSearch(search, priceFrom, priceTo, searchBy, start, step, function(content){
		var query = "";
		if (searchBy == "price" && priceFrom > 0)
			query += "Từ " + priceFrom + " đồng - ";
		if (searchBy == "price" && priceTo < 9999999999)
			query += priceTo + " đồng";
		if (searchBy != "price")
			query = search;
		res.render("search", {"query": query, "queryString": queryString, "content": content});
	});
});

// Rounting search
router.get("/product/:slug",setHeader, setFooter,  function(req, res){
	var requrl = req.protocol + "://" + req.get('host') + req.originalUrl;
	setContentProductDetail(req.params.slug, function(content){
		if(content == null){
			set404(req, res, function(){
				
			});
			return;
		}
		res.render("product-detail", {"urlReq": requrl, "content": content});
	});
});

// Routin login
router.get("/login", function(req, res, next){
	var user = getCustomer(req);
	if (user != null) return res.redirect("/");
	next();
}, setHeader, setFooter,
function(req, res){
	var login_fail = req.query.fail === "true";
	var username = (req.query.username !== undefined) ? req.query.username : "";
	res.render("login", {"login_fail": login_fail, "username": username});
});

// Routing sign-up
router.get("/sign-up", csrfProtection, setHeader, setFooter, function(req, res){
	var user = getCustomer(req);
	res.render("sign-up", {csrfToken: req.csrfToken()});
});

// ĐĂNG KÝ TÀI KHOẢN
router.post("/sign-up", csrfProtection, function(req, res){
	dao.signup(req.body, function(success){
		if(success)
			res.redirect("/login?username=" + req.body.sign_up_username);
		else res.redirect("/sign-up");
	});
});

// Request từ sign up
router.post("/field-sign-up", function(req, res){
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
router.get("/forget-password", setHeader, setFooter, function(req, res){
	username_forget_passwork = req.session.username_forget_passwork || "";
	res.render("forget-password", {username: username_forget_passwork})
});

// Kiểm tra thông tin username và mã được gửi email có khớp không
router.post("/forget-password", 
	function (req, res, next){
		var code = req.body.forget_pass_code;
		var username = req.body.forget_user;
		var code_forget_password = req.session.code_forget_password;
		req.session.username_forget_passwork = username;
		if(code_forget_password != undefined && code_forget_password.username == username 
			&& code_forget_password.code == code){
				return next();
			}
		return res.redirect("/forget-password");
	}, setHeader, setFooter,
	function(req, res){
		res.render("set-new-password", {});
	}
);

// Gửi email
router.post("/send-email", function(req, res){
	let username = req.body.username;
	dao.getMail(username, function(mailTo){
		console.log(mailTo);
		if(mailTo == null){
			res.json({success: false});
			return;
		}
		let code = Math.floor(Math.random()*9000+1000);
		req.session.code_forget_password = {"username": username, "code": code};
		//codes.push({"username": username, "code": code});
		mail = require("./mail");
		console.log(mail);
		if(mail({
			"mailTo": mailTo,
			subject: 'Mã xác nhận từ Shop hoa KHTN', // Subject line
			text: 'Mã xác nhận', // plain text body
			html: 'Mã xác nhận của bạn là: <b>' + code + '</b>' // html body
		})) 
			res.json({success: true});
		else 
			res.json({success: false});
	});

});

// Cái password mới
router.post("/set-new-password", setHeader, setFooter, function(req, res){
	var user = getCustomer(req);
	let username = req.session.username_forget_passwork;
	let newpass = req.body.set_new_pass_pass1;
	dao.setNewPassword(username, newpass, function(){
		res.render("set-new-password-success", {});
	});
});

// Rounting cho trang thay đổi mật khẩu khi đã đăng nhập
router.get("/change-password", isLoggedIn, setHeader, setFooter, function(req, res){
	var user = getCustomer(req);
	if(user.loginInfo.typeLg == "local")
		res.render("change-password", {});
	else res.redirect("/");
});
// Thay đổi mật khẩu
router.post("/change-password", isLoggedIn, setHeader, setFooter, function(req, res){
	var user = getCustomer(req);
	let oldpass = req.body.old_password;
	let passwordHash = require('password-hash');

	if (! passwordHash.verify(oldpass, user.loginInfo.localLogin.password))
		return res.redirect("/change-password");

	let newpass = req.body.set_new_pass_pass1;
	console.log("set new password: " + user.loginInfo.localLogin.username +":"+ newpass);

	dao.setNewPassword(user.loginInfo.localLogin.username, newpass, function(){
		res.render("set-new-password-success", {});
	});
});

// Rounting cart info
router.get("/cart-info", setHeader, setFooter, (req, res) => {
	var user = getCustomer(req);
	//if(user == null) res.redirect("/login");
	//else {
	dao.getNewProduct(8, function(newProducts){
		res.render("cart-info", {"content": {"newProducts": newProducts}});
	});
	//}
});
// Lấy thông tin product trong cart
router.get("/product-in-cart", (req, res) => {
	productID = req.query.productID;
	dao.getProductDetailByID(productID, (productInfo)=>{
		/*		productInfo
		*			- id: mã sản phẩm (duy nhất)
		*			- name: tên sản phẩm
		*			- imgPath: đường dẫn tới hình ảnh
		*			- price: giá sản phẩm (đơn vị đông - kiểu number)
		*			- newPrice: giá sản phẩm khuyến mãi (đơn vị đông - kiểu number)
		*			- slug: đường dẫn tới sản phẩm
		*			- categorySlug: category cho sản phẩm
		*			- detail: thông tin chi tiết sản phẩm
		*/
		res.json(productInfo);
	});
});

// Rounting receiver info
router.get("/pay/receiver-info", isLoggedIn, setHeader, setFooter, (req, res) => {
	var user = getCustomer(req);
	res.render("pay/receiver-info", {});
});
// Rounting submit form receiver info
router.post("/pay/receiver-info", isLoggedIn, (req, res) => {
	// Kiểm tra các thông tin được submit lên
	/*
	*	receiverInfo: { name: string, phone: String, date: MM/DD/YYYY HH:MM AM, address: String, district: String, city: String}
	*/
	var receiverInfo = req.body;
	// Nếu các thông tin không chính xác => Redirect về /pay/billing-info
	if (!checkReceiverInfo(receiverInfo))
		return res.redirect("/pay/receiver-info");
	else {
		// Lưu receiverInfo vào session payinfo
		req.session.payinfo = {"receiverInfo": receiverInfo};
		// redirect tới step tiếp theo
		res.redirect("/pay/billing-info");
	}
});

function isComplateReceiverInfo(req, res, next){
	// Kiểm tra receiverInfo đã có và đủ các giá trị trong session chưa
	// Nếu chưa redirect về trang /pay/receiver-info
	var receiverInfo = (req.session.payinfo == undefined) ? undefined : req.session.payinfo.receiverInfo;
	if (receiverInfo == undefined || !checkReceiverInfo(receiverInfo))
		return res.redirect("/pay/receiver-info");
	if(res.locals.content == undefined)
		res.locals.content = {"receiverInfo": receiverInfo};
	else res.locals.content.receiverInfo = receiverInfo;
	next();
}
function isComplateBillingInfo(req, res, next){
	var billingInfo = (req.session.payinfo == undefined) ? undefined : req.session.payinfo.billingInfo;
	if (billingInfo == undefined || isEmpty(billingInfo.recieve) || isEmpty(billingInfo.pay_method))
		return res.redirect("/pay/billing-info");

	if(billingInfo.recieve == "in-store") billingInfo.recieveName = "Nhận hàng tại của hàng";
	else if (billingInfo.recieve == "in-house") billingInfo.recieveName = "Nhận hàng tại địa chỉ người nhận";

	if(billingInfo.pay_method == "face-to-face") billingInfo.payMethodName = "Thanh toán trực tiếp";
	else if(billingInfo.pay_method == "by-card") billingInfo.payMethodName = "Thanh toán qua thẻ";
	else if(billingInfo.pay_method == "by-online") billingInfo.payMethodName = "Thanh toán Online";

	if(res.locals.content == undefined)
		res.locals.content = {"billingInfo": billingInfo};
	else res.locals.content.billingInfo = billingInfo;
	next();
}
// Rounting billing info
router.get("/pay/billing-info", isLoggedIn, isComplateReceiverInfo, setHeader, setFooter, (req, res) => {
	res.render("pay/billing-info", {});
});
// Lấy dữ liệu từ thanh toán
router.post("/pay/billing-info", isLoggedIn, isComplateReceiverInfo, (req, res, next) =>{
		// Lấy thông tin thanh toán
		// billingInfo: {recieve: (in-store | in-house), pay_method: (face-to-face | by-card | by-online)}
		var billingInfo = req.body;
		// Viết dữ liệu vào session
		req.session.payinfo.billingInfo = billingInfo;
		req.session.cartInfo = JSON.parse(req.body.cart_info);
		console.log(req.session.cartInfo);
		next();

	},isComplateBillingInfo,
	(req, res, next) =>{
		var billingInfo = req.session.payinfo.billingInfo;
		if (billingInfo.pay_method != "by-online"){
			var payInfo = req.session.payinfo;
			var cartInfo = req.session.cartInfo;
			dao.addBill({userID: getCustomer(req)._id,"payInfo": payInfo, cartInfo: cartInfo},
				function(){
					return res.redirect("/pay/done");
				});
		}
		else
			next();
	}, setHeader, setFooter,
	(req, res, next) =>{
		return	res.render("pay/online", {});
	}
);


// Thanh toán bằng paypal
router.get('/paypal_client_token',isLoggedIn,isComplateReceiverInfo,isComplateBillingInfo,function(req, res) {
	gateway.clientToken.generate({}, function (err, response) {
		res.send(response.clientToken);
	});
});

router.post('/paypal_checkout',function(req, res, next) {
		console.log(req.body.amount);
		var saleRequest = {
			amount: req.body.amount,			// Số lượng tiền
			paymentMethodNonce: req.body.nonce, // Nonce từ client
			shipping: {
				firstName: "Huy",
				lastName: "Nguyễn Văn"
		  },
		  options: {
			  paypal: {
				  customField: "Tiêu đề ",	  // Thông tin hiển thị lên hóa đơn
				  description: "Mô tả"
			  },
			  submitForSettlement: true
		  }
		};
		gateway.transaction.sale(saleRequest, function (err, result) {
			if (err) {
				res.sendStatus(404);
			} else if (result.success) {
				next();
			} else {
				res.send(result.message);
			}
		});
	}, function(req, res, next){
		var payInfo = req.session.payinfo;
		var cartInfo = req.body.cartInfo;
		dao.addBill({userID: getCustomer(req)._id, "payInfo": payInfo, "cartInfo": cartInfo}, 
			function(){
				return res.redirect("/pay/done");
			});
});

router.get("/pay/done", isLoggedIn,isComplateReceiverInfo,isComplateBillingInfo, setHeader, setFooter, function(req, res, next){
	res.render("pay/done", {})
})


// Routing profile 
router.get("/profile", isLoggedIn, setHeader, setFooter, function(req, res){
	var user = getCustomer(req);
	var stringDate = function(date){
		var d = new Date(date);
		return "Ngày " + d.getDate() + " tháng " + (d.getMonth() + 1) + " năm " + (d.getYear()+1900);
	}
	res.render("profile", {content: {
		name: (user.baseInfo.fullName) ? user.baseInfo.fullName : "Chưa biết",
		email: (user.baseInfo.email) ? user.baseInfo.email : "Chưa biết",
		avatarPath: (user.baseInfo.avatarPath) ? user.baseInfo.avatarPath : "images/avatar_member.png",
		address: (user.baseInfo.address) ? user.baseInfo.address : "Chưa biết",
		phone: (user.baseInfo.tel) ? user.baseInfo.tel : "Chưa biết",
		dateAdded: (user.dateAdded) ? stringDate(user.dateAdded) : "Chưa biết",
	}});
})
// Routing profile 
router.post("/profile/:type", isLoggedIn, setHeader, setFooter, function(req, res){
	var type = req.params.type;
})

// Routing cho trang 404
router.get("*", function(req, res){
	set404(req, res, function(){});
});

module.exports = router;
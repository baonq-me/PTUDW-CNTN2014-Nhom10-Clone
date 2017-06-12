var dao = {
	mongoose : require ('mongoose'),
	passwordHash : require('password-hash'),
	dbName: 'do_an_web',
	dbUser: 'nhom10',
	dbPass: 'nhom10',
	userName: 'hiennguyen',
	pass: 'hiennguyen249',
	connStr: 'mongodb://nhom10:nhom10@ds157439.mlab.com:57439/do_an_web',

	model: {
		categories: null,
		products: null,
		users: null,
		usersSocial: null,
		bills: null,
		meaningflowers: null,
	},

	//Hàm lấy/tạo Category model
	getCategoryModel: function(){
		//nếu đã tồn tại Category model thì return
		if (this.model.categories !== null)
			return this.model.categories;
		//Ngược lại, tạo model Category mới
		//Tạo Schema category 
	  	var categorySchema = this.mongoose.Schema({
	  		id : this.mongoose.Schema.ObjectId,
	  		name: {type: String, require : true, unique: true},
	  		slug: {type: String, require : true, unique: true},
	  		icon: String,
	  		countProduct: Number
	  	});

	  	//Tạo model từ categorySchema và có tên collection là 'categories'
	  	this.model.categories = this.mongoose.model('categories', categorySchema);
	  	return this.model.categories;
	},

	//Hàm lấy/tạo Product model
	getProductModel: function(){
		//nếu đã tồn tại Product model thì return 
		if (this.model.products !== null)
			return this.model.products;
		//Ngược lại, tạo model Product mới
		//Tạo Schema Product
	  	var productSchema = this.mongoose.Schema({
	  		name: {type: String, require : true},
	  		imgPath: {type: String, require : true},
	  		slug: {type: String, require : true},		//Đường dẫn đến sản phẩm
	  		price: Number,
	  		categorySlug : [String],	//Đường dẫn của loại sản phẩm, 1 sản phẩm có thể có nhiều loại sản phẩm
	  		newPrice: Number,
	  		detail: String, 
	  		quality: Number,
	  		dateAdded :{ type: Date, default: Date.now },
	  		status: String
	  	});

	  	//Tạo model từ productSchema và có tên collection là 'products'
	  	this.model.products = this.mongoose.model('products', productSchema);
	  	return this.model.products;
	},

	//Hàm lấy/tạo User model
	getUserModel: function(){
		//nếu đã tồn tại User model thì return
		if (this.model.users !== null)
			return this.model.users;
		//Ngược lại, tạo model User mới
		//Tạo Schema User
	  	var UserSchema = this.mongoose.Schema({
			loginInfo: {
				typeLg: String,
				socialLoginId : { facebook: String, google: String, twitter: String },
				localLogin: { username: String, password: String }
			},
			baseInfo: {
				fullName: String,
				email: String,
				address: String,
				tel: String,
				avatarPath: String
			},
			dateAdded: { type: Date, default: Date.now },
			role: {
				name: String,
				permission: Object
			},
			status: String
		});

	  	//Tạo model từ categorySchema và có tên collection là 'categories'
	  	this.model.users = this.mongoose.model('users', UserSchema);
	  	return this.model.users;
	},

	//Hàm lấy/tạo Bill model
	getBillsModel: function(){
		//nếu đã tồn tại User model thì return
		if (this.model.bills !== null)
			return this.model.bills;
		//Ngược lại, tạo model Bills mới
		//Tạo Schema Bills
	  	var UserSchema = this.mongoose.Schema({
	  		userID : String,
	  		billingInfo: {recieve: String, pay_method: String},
	  		receiverInfo: {name: String, phone: String, date: String, address: String, district: String, city: String},
	  		cartInfo: Array,
			dateAdded: { type: Date, default: Date.now },
			//status: String    //Đang xử lí, Đã hủy, Hoàn tất, Đã xóa
	  	});	

	  	//Tạo model từ categorySchema và có tên collection là 'categories'
	  	this.model.bills = this.mongoose.model('bills', UserSchema);
	  	return this.model.bills;
	},
	getMeaningFlowersModel: function(){
		//nếu đã tồn tại meaningflowers model thì return
		if (this.model.meaningflowers !== null)
			return this.model.meaningflowers;
		//Ngược lại, tạo model meaningflowers mới
		//Tạo Schema meaningflowers
	  	var UserSchema = this.mongoose.Schema({
	  		slug: {type: String, require : true},
			nameFlower: String,
			imagePath: String,
			summary: String,
			detail: String,
	  	});	

	  	//Tạo model từ meaningflowersSchema và có tên collection là 'meaningflowers'
	  	this.model.meaningflowers = this.mongoose.model('meaningflowers', UserSchema);
	  	return this.model.meaningflowers;
	},

	//Hàm connect database
	connect: function(){
		console.log('Connecting to database. Please wait....');
		if (this.mongoose.connection.readyState == 0){
			this.mongoose.connect(this.connStr);
			var db = this.mongoose.connection;
			db.on('error', console.error.bind(console, 'Error when connection to MongoDB:'));
			db.once('open', function(){
				console.log('Connected to MongoDB do_an_web database!');
			});
		};
	},

	//Hàm đóng kết nối database
	close: function(){
		this.mongoose.connection.close();
	},

	/*	Lấy tất cả category
	*	@param callback(data) được gọi khi lất tất cả category xong
	*		output là data: mảng thông tin các category
	*		với mỗi category có các thông tin sau:
	*			- name: tên category
	*			- slug: đường dẫn tới category (không chứa root - localhost:3000)
	*			- icon: icon cho category
	*/
	getAllCategory: function(callback){
		//Lấy category model
		var categoryModel = this.getCategoryModel();

		//Câu truy vấn lấy tất cả category
		categoryModel.find(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},

	/*	Lấy sản phẩm mới
	*	@start vị trí product đầi tiên (tính từ 0)
	*	@step số lượng product cần lấy
	*	@callback(data) được gọi khi lấy sản phẩm mới xong
	*		@output là data: mảng thông tin các product
	*		với mỗi sản phẩm có các thông tin sau:
	*			- id: mã sản phẩm (duy nhất)
	*			- name: tên sản phẩm
	*			- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*			- newPrice: Giá khuyến mãi (đơn vị đông - kiểu number)
	*			- price: giá sản phẩm (đơn vị đông - kiểu number)
	*			- slug: đường dẫn tới sản phẩm (không chứa root - localhost:3000)
	*/
	getNewProduct: function(start, step, callback){
		//Lấy category model và product model
		var productModel = this.getProductModel();

		//Truy vấn DB lấy product có category là "san-pham-moi"
		var data = productModel.find()
		.limit(step)
		.sort({"dateAdded":-1})
		.skip(start)
		.select('id name imgPath price newPrice slug')
		.exec(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},

		/*	Lấy sản phẩm khuyến mãi
	*	@start vị trí product đầi tiên (tính từ 0)
	*	@step số lượng product cần lấy
	*	@callback(data) được gọi khi lấy sản phẩm khuyến mãi xong
	*		@data mảng thông tin các product
	*		với mỗi sản phẩm có các thông tin sau:
	*			- id: mã sản phẩm (duy nhất)
	*			- name: tên sản phẩm
	*			- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*			- newPrice: Giá khuyến mãi (đơn vị đông - kiểu number)
	*			- price: giá sản phẩm (đơn vị đông - kiểu number)
	*			- slug: đường dẫn tới sản phẩm (không chứa root - localhost:3000)
	*/
	getPromotionProduct: function(start, step, callback){
		//Lấy category model và product model
		var productModel = this.getProductModel();
		
		//Truy vấn DB lấy product có category là "san-pham-khuyen-mai"
		productModel.find()
		.exists('newPrice', true)
		.limit(step)
		.skip(start)
		.sort({"dateAdded":-1})
		.select('id name imgPath price newPrice slug')
		.exec(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},
	getCountPromotionProduct: function(callback){
		var productModel = this.getProductModel();

		productModel.count().exists('newPrice', true).exec(function(err, count){
			if (err) throw err;
			callback(count);
		});
	},

		/*	Lấy sản phẩm theo category
	*	@slugs: mảng các slug của category
	*	@skip: số lượng sản phẩm được bỏ qua (bắt đầu lấy từ skip + 1)
	*	@count: số lượng product cần lấy
	*	@callback(data): được gọi khi lấy sản phẩm theo category xong
	*		@data mảng thông tin các product
	*		với mỗi sản phẩm có các thông tin sau:
	*			- id: mã sản phẩm (duy nhất)
	*			- name: tên sản phẩm
	*			- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*			- price: giá sản phẩm (đơn vị đông - kiểu number)
	*			- newPrice: giá khuyến mãi (đơn vị đông - kiểu number)
	*			- slug: đường dẫn tới sản phẩm (không chứa root - localhost:3000)
	*/
	getProductsByCategory: function(slugs, skip, count, callback){
		//Lấy category model và product model
		var productModel = this.getProductModel();

		/*
		var condition = {$or:[{},{}]};
		var i;
		for(i=0; i<slugs.length ; i++){
			condition.$or.add(condition[i]);
		}
		*/
		
		//Truy vấn DB lấy product có categorySlug là slugs
		productModel.find({categorySlug: {"$in": slugs}})
		.limit(count)
		.skip(skip)
		.select('id name imgPath price newPrice slug')
		.exec(function(err, data){
			if (err) throw err; 
			callback(data);
		});
	},
		/*	Lấy số lượng sản phẩm theo category
	*	@slugs: mảng các slug của category
	*	@callback(countProduct): được gọi khi lấy số lượng sản phẩm theo category xong
	*		@countProduct số lượng product theo category
	*/
	getCountProductBySlug: function(slugs, callback){
		//Lấy category model và product model
		var productModel = this.getProductModel();

		productModel.count({categorySlug: {"$in": [slugs]}}, function(err, count){
			if (err) throw err; 
			callback(count);
		});
	},

	/*
	*	Lấy tên category dựa vào slug
	*	@param	slug của category
	*	@param	callback(data) được gọi khi lấy tên category xong
	*		@data object thông tin của tên category
				{"name": "name"}
	*/
	getCatName: function(slug, callback){
		var categoryModel = this.getCategoryModel();
		categoryModel.findOne({slug: slug}, function(err, data){
			if(err) throw err;
			callback(data);
		});
	},

	/*
	*	Lấy sản phẩm theo category
	*	@param
	*		@search từ khóa cần tìm kiếm
	*		@priceFrom
	*		@priceTo
	*		@searchBy tiêu chí tìm kiếm [ 'price' | 'category']
	*		@step số lượng product
	*		@skip số lượng product bỏ qua
	*	@param	callback(data) được gọi khi lấy sản phẩm xong
	*		@data mảng thông tin các product
	*		với mỗi sản phẩm có các thông tin sau:
	*			- id: mã sản phẩm (duy nhất)
	*			- name: tên sản phẩm
	*			- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*			- price: giá sản phẩm (đơn vị đông - kiểu number)
	*			- newPrice: giá khuyến mãi (đơn vị đông - kiểu number)
	*			- slug: đường dẫn tới sản phẩm (không chứa root - localhost:3000)
	*/
	getProductsBySearch: function(searchInfo, callback){
		//Lấy category model và product model
		var productModel = this.getProductModel();
		
		//Truy vấn DB
		if(searchInfo.searchBy == 'price'){
			productModel.find({
				$or : [
					{newPrice: {$exists: false}, price: {$gte: searchInfo.priceFrom, $lte: searchInfo.priceTo}},
					{newPrice: {$exists: true}, newPrice: {$gte: searchInfo.priceFrom, $lte: searchInfo.priceTo}}
				]
			})
			.limit(searchInfo.step)
			.skip(searchInfo.skip)
			.select('id name imgPath price newPrice slug')
			.exec(function(err, data){
				if (err) throw err;
				callback(data);
			});
		}
		else {
			productModel.find({name: new RegExp(searchInfo.search, "i")})
			.limit(searchInfo.step)
			.skip(searchInfo.skip)
			.select('id name imgPath price newPrice slug')
			.exec(function(err, data){
				if (err) throw err;
				callback(data);
			});
		}
	},
	getCountProductBySearch: function(searchInfo, callback){
		//Lấy category model và product model
		var productModel = this.getProductModel();
		
		//Truy vấn DB
		if(searchInfo.searchBy == 'price'){
			productModel.find({
				$or : [
					{newPrice: {$exists: false}, price: {$gte: searchInfo.priceFrom, $lte: searchInfo.priceTo}},
					{newPrice: {$exists: true}, newPrice: {$gte: searchInfo.priceFrom, $lte: searchInfo.priceTo}}
				]
			})
			.count()
			.exec(function(err, data){
				if (err) throw err;
				callback(data);
			});
		}
		else {
			productModel.find({name: new RegExp(searchInfo.search, "i")})
			.count()
			.exec(function(err, data){
				if (err) throw err;
				callback(data);
			});
		}
	},

	/*
	*	Lấy thông tin chi tiết của sản phẩm
	*	@slug là slug của sản phẩm cần lấy thông tin chi tiết
	*	@callback(data) được gọi khi lấy sản phẩm xong
	*		@data là object thông tin chi tiết product
	*			- id: mã sản phẩm (duy nhất)
	*			- name: tên sản phẩm
	*			- imgPath: đường dẫn tới hình ảnh
	*			- price: giá sản phẩm (đơn vị đông - kiểu number)
	*			- newPrice: giá sản phẩm khuyến mãi (đơn vị đông - kiểu number)
	*			- slug: đường dẫn tới sản phẩm
	*			- categorySlug: category cho sản phẩm
	*			- detail: thông tin chi tiết sản phẩm
	*/
	getProductDetail: function(slug, callback){
		var productModel = this.getProductModel();

		productModel.findOne({slug: slug}, function(err, data){
			if (err) throw err;
			callback(data);
		});
	},
	/*
	*	Lấy thông tin chi tiết của sản phẩm
	*	@id là id của sản phẩm cần lấy thông tin chi tiết
	*	@callback(data) được gọi khi lấy sản phẩm xong
	*		@data null nếu không tìm thấy
	*		@data là object thông tin chi tiết product
	*			- id: mã sản phẩm (duy nhất)
	*			- name: tên sản phẩm
	*			- imgPath: đường dẫn tới hình ảnh
	*			- price: giá sản phẩm (đơn vị đông - kiểu number)
	*			- newPrice: giá sản phẩm khuyến mãi (đơn vị đông - kiểu number)
	*			- slug: đường dẫn tới sản phẩm
	*			- categorySlug: category cho sản phẩm
	*			- detail: thông tin chi tiết sản phẩm
	*/
	getProductDetailByID: function(id, callback){
		var productModel = this.getProductModel();
		if (id.match(/^[0-9a-fA-F]{24}$/)) {
			productModel.findById(id, function(err, data){
				if (err) throw err;
				callback(data);
			});
		}
		else callback(null);
	},

	/*
	* Thêm user
	* @user: object user, gồm thông tin user
	*/

	/*
	*	args {name: string, sign_up_email: string, sign_up_username: string, sign_up_password: string, 
	*		sign_up_addr: string, sign_up_tel: string}
	*/
	addUserLocal: function(args){
		var userModel = this.getUserModel();
		var user = new userModel({
			"loginInfo": {
				typeLg: "local",
				localLogin: { username: args.sign_up_username, password: this.passwordHash.generate(args.sign_up_password) }
			},
			baseInfo: {
				fullName: args.name,
				email: args.sign_up_email,
				address: args.sign_up_addr,
				tel: args.sign_up_tel
			},
			role: {
				name: "customer"
			},
			status: ""
		});
		user.save(function(err, data){
			if(err) throw err;
		});
	},
	/* Hàm kiểm tra thông tin username và password khi đăng nhập
	* @username: username người dùng nhập vào
	* @password: Password người dùng nhập vào
	* @callback: thực hiện sau khi login thành công
	* login thành công: return true 
	* login thất bại: return false 
	*/
	login: function(username, password, callback){
		var userModel = this.getUserModel();
		userModel.findOne({"loginInfo.localLogin.username":username}, function(err, data){
			if (err) throw err;
			if(data == null)
				callback(false)
			else{
				callback(dao.passwordHash.verify(password, data.loginInfo.localLogin.password));
			}
		});
	},

	/* Hàm lấy thông tin user
	* @username: username cần lấy thông tin
	* @callback: thực hiện sau khi lấy thông tin
	* return thông tin user
	*/
	getUser: function(username, callback){
		var userModel = this.getUserModel();
		userModel.findOne({"loginInfo.localLogin.username":username}, function(err, data){
			if (err) throw err;
			callback(data);
		});
	},

	/* Hàm lấy thông tin user theo id
	* @id: id của user cần lấy thông tin
	* @callback: thực hiện sau khi lấy thông tin
	* return thông tin user
	*/

	getUserByID: function(id, callback){
		var userModel = this.getUserModel();
		userModel.findOne({"_id":id}, function(err, data){
			if (err) throw err;
			callback(data);
		});
	},

	/*
	* Kiểm tra username đã tồn tại hay chưa
	* @username: username cần kiểm tra
	* Kết quả trả về, true: đã tồn tại, false: chưa tồn tại
	*/
	hadUsername: function(username, callback){
		var userModel = this.getUserModel();

		userModel.findOne({"loginInfo.localLogin.username": username}, function(err, data){
			if(err) throw err;
			//Username đã tồn tại
			if(data != null)
				callback(true);
			else
				callback(false);
		});
	},

	/*
	* Kiểm tra email của tài khoản local đã tồn tại hay chưa
	* @email: email cần kiểm tra
	* Kết quả trả về, true: đã tồn tại, false: chưa tồn tại
	*/
	hadEmail: function(email, callback){
		var userModel = this.getUserModel();

		userModel.findOne({"baseInfo.email": email, "loginInfo.typeLg": "local"}, function(err, data){
			console.log(data);
			if(err) throw err;
			//Nếu email đã tồn tại
			if(data != null){
				callback(true);
			}
			else{
				callback(false);
			}
		});
	},
	/*
	*	args {name: string, sign_up_email: string, sign_up_username: string, sign_up_password: string, 
	*		sign_up_addr: string, sign_up_tel: string}
	*/
	signup: function(args, callback){
		var userModel = this.getUserModel();
		this.hadUsername(args.sign_up_username, function(hadusername){
				dao.hadEmail(args.sign_up_email, function(hademail){
				if(hademail || hadusername) callback(false);	// sign up thất bại
				else {
					dao.addUserLocal(args);
					callback(true);
				}
			});
		});
	},	
	setNewPassword: function(username, newpass, callback){
		var userModel = this.getUserModel();
		userModel.findOne({"loginInfo.localLogin.username": username}, function(err, user){
			if(err) throw err;
			user.loginInfo.localLogin.password = dao.passwordHash.generate(newpass);
			user.save(function(err, data){
				if(err) throw err;
				callback(true);
			});
		});
	},
	getMail: function(username, callback){
		var userModel = this.getUserModel();
		userModel.findOne({"loginInfo.localLogin.username": username})
		.select('baseInfo.email')
		.exec(function(err, data){
			if(data == null) callback (null)
			else callback(data.baseInfo.email);
		});
	},

	/*Hàm lấy permission của 1 user
	*/
	getPermission: function(username, callback){
		var userModel = this.getUserModel();
		userModel.findOne({username: username})
		.select('permission')
		.exec(function(err, data){
			callback(data);
		});
	},

	/*
	*	Lấy thông tin user đăng nhập từ
	*	Không tìm thấy trả về null 
	*/
	getUserSocial: function(uid, callback){
		var userModel = this.getUserModel();
		userModel.findOne({"loginInfo.socialLoginId":uid}, function(err, data){
			if (err) throw err;
			callback(data);
		});
	},

	/*
	*	Thêm thông tin user đăng nhập từ mạng xã hội
	*/
	addUserSocial: function(user, callback){
		var userModel = this.getUserModel();
		var user = new userModel({
			loginInfo: {
				typeLg: "social",
				socialLoginId : user.uid
			},
			baseInfo: {
				fullName: user.fullName,
				email: user.email,
				address: user.address,
				avatarPath: user.avatarPath
			},
			role: {
				name: "customer",
			},
			status: ""
		});
		user.save(function(err, data){
			if(err) {callback(false); throw err;}
			callback(true);
		});
	},

	/*
	*	Thêm bill trong database
	*	@param	thông tin hóa đơn
	*		- userID: Id của người mua
	*		- payInfo: {billingInfo: {recieve: (in-store | in-house), pay_method: (face-to-face | by-card | by-online)}
	*				receiverInfo: { name: string, phone: String, date: MM/DD/YYYY HH:MM AM, address: String, district: String, city: String}}
	*		- cartInfo: [{productID, count}]
	*/
	addBill: function(billInfo, callback){
		var billModel = this.getBillsModel();
		/*
			userID : String,
	  		billingInfo: {recieve: String, pay_method: String},
	  		receiverInfo: {name: String, phone: String, date: String, address: String, district: String, city: String},
	  		cartInfo: Array
	  	*/
		var bill = new billModel({
			userID: billInfo.userID,
			billingInfo: billInfo.payInfo.billingInfo,
			receiverInfo: billInfo.payInfo.receiverInfo,
			cartInfo: billInfo.cartInfo,
		});
		bill.save(function(err, data){
			if(err) throw err;
			callback();
		});
	},

	/*************** Trang admin index *********************/
	/*
	*  Đếm số lượng tất cả sản phẩm đang bán
	*	@param thực hiện sau khi đếm số lượng sản phẩm
	*   count: số lượng sản phẩm được trả về
	*/
	countProducts : function(callback){
		var productModel = this.getProductModel();

		productModel.count({}, function(err, count){
			if (err) throw err;
			callback(count);
		});
	},
	/*
	*  Đếm số lượng đơn hàng
	*	@param thực hiện sau khi đếm số lượng đơn hàng
	*   count: số lượng đơn hàng được trả về
	*/
	countBills : function(callback){
		var billModel = this.getBillsModel();

		billModel.count({}, function(err, count){
			if (err) throw err;
			callback(count);
		});
	},
	/*
	*  Đếm số lượng sản phẩm
	*	@param thực hiện sau khi đếm số lượng sản phẩm
	*   count: số lượng sản phẩm được trả về
	*/
	countUsers : function(callback){
		var userModel = this.getUserModel();

		userModel.count({}, function(err, count){
			if (err) throw err;
			callback(count);
		});
	},

	/*
	* Lấy Danh sách sản phẩm đang bán hết hàng
	* @param thực hiện sau khi đếm số lượng sản phẩm
	*   data: mảng các object
	*   mỗi object là thông tin sản phẩm hết hàng gồm id, tên sản phẩm
	*/
	getOutOfProduct : function(count, skip , callback){
		var productModel= this.getProductModel();

		productModel.find({$and:[{"quality" : 0}, {"status": "Đang bán"}]})
		.skip(skip)
		.limit(count)
		.exec(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},

	/*
	* Đếm số lượng sản phẩm đang bán hết hàng
	* @param thực hiện sau khi đếm số lượng sản phẩm
	*   data: mảng các object
	*   mỗi object là thông tin sản phẩm hết hàng gồm id, tên sản phẩm
	*/
	countOutOfProduct : function(callback){
		var productModel= this.getProductModel();

		productModel.count({$and:[{"quality" : 0}, {"status": "Đang bán"}]}, function(err, count){
			if (err) throw err;
			callback(count);
		});
	},

	/*
	* Lấy sản phẩm được thêm gần đây
	* @param số lượng sản phẩm cần lấy
	* 
	*/
	getNewProductAdmin : function(count, skip, callback){
		var productModel = this.getProductModel();

		productModel.find({status: "Đang bán"})
		.sort({dateAdded: -1})
		.select('id name quality dateAdded')
		.limit(count)
		.skip(skip)
		.exec(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},
	/*
	* Lấy users mới được thêm gần đây
	* @param số lượng users cần lấy
	* @param thực hiện khi lấy users
	* data: mảng các object user mới được thêm vào
	*/
	getNewUsers : function(count, skip, callback){
		var userModel = this.getUserModel();

		userModel.find()
		.sort({dateAdded: -1})
		.select('baseInfo.fullName loginInfo.localLogin.username dateAdded')
		.limit(count)
		.skip(skip)
		.exec(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},

/*************** Trang admin product *********************/

	/*
	*  Đếm số lượng danh mục sản phẩm (nhóm sản phẩm)
	*	@param thực hiện sau khi đếm số lượng sản phẩm
	*   count: số lượng sản phẩm được trả về
	*/
	countCategories : function(callback){
		var categoryModel = this.getCategoryModel();

		categoryModel.count({}, function(err, count){
			if (err) throw err;
			callback(count);
		});
	},

	/* 
	* Đếm số sản phẩm mới được thêm trong tuần
	* @param thực hiện sau khi đếm số lượng sản phẩm
	*   count: số lượng sản phẩm được trả về
	*/
	countNewProductInWeek : function(callback){
		callback(10);
	},

	/* 
	* Đếm số sản phẩm khuyến mãi hiện có
	* @param thực hiện sau khi đếm số lượng sản phẩm
	*   count: số lượng sản phẩm được trả về
	*/

	countPromotionProduct: function(callback){
		var productModel = this.getProductModel();

		productModel.count({categorySlug: {"$in": ["san-pham-khuyen-mai"]}, status: "Đang bán"}, function(err, count){
			if (err) throw err;
			callback(count);
		});
	},

	/*
	* Lấy sản phẩm bán chạy nhất (Được mua nhiều nhất) 
	* @param thực hiện sau khi lấy sản phẩm
	* data trả về là tên sản phẩm bán chạy nhất
	*/

	getBestSellProduct: function(callback){
		callback("Hoa tình yêu 1");
	},

	/*
	* Lấy danh sách tất cả sản phẩm
	* @param thực hiện sau khi lấy sản phẩm
	* data trả về là mảng các object sản phẩm
	*/
	getAllProduct: function(count, skip, callback){
		var productModel = this.getProductModel();

		productModel.find({})
		.limit(count)
		.skip(skip)
		.exec(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},


	/*
	* Lấy danh sách sản phẩm đang bán và còn hàng 
	* @param thực hiện sau khi lấy sản phẩm
	* data trả về là mảng các object sản phẩm
	*/
	getStockProduct: function(count, skip, callback){
		var productModel = this.getProductModel();

		productModel.find({quality: {$gt: 0}, status: "Đang bán"})
		.limit(count)
		.skip(skip)
		.exec(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},
	/*
	* Đếm số lượng sản phẩm đang bán còn hàng
	* @param thực hiện sau khi đếm số lượng sản phẩm
	* count: số lượng sản phẩm trả về
	*/
	countStockProduct : function(callback){
		var productModel= this.getProductModel();

		productModel.count({"quality" : {$gt: 0}, status: "Đang bán"}, function(err, count){
			if (err) throw err;
			callback(count);
		});
	},
	/*
	* Lấy danh sách sản phẩm ngưng bán 
	* @param thực hiện sau khi lấy sản phẩm
	* data trả về là mảng các object sản phẩm
	*/
	getStopSellProduct: function(count, skip, callback){
		var productModel = this.getProductModel();

		productModel.find({status: "Ngừng bán"})
		.exec(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},

	/*
	* Đếm số lượng sản phẩm đã ngưng bán
	* @param thực hiện sau khi đếm số lượng sản phẩm
	* count: số lượng sản phẩm trả về
	*/
	countStopSellProduct : function(callback){
		var productModel= this.getProductModel();

		productModel.count({status: "Ngừng bán"}, function(err, count){
			if (err) throw err;
			callback(count);
		});
	},
	/*
	* Lấy danh sách sản phẩm đã xóa
	* @param thực hiện sau khi lấy sản phẩm
	* data trả về là mảng các object sản phẩm
	*/
	getDeletedProduct: function(count, skip, callback){
		var productModel = this.getProductModel();

		productModel.find({status: "Đã xóa"})
		.limit(count)
		.skip(skip)
		.exec(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},

	/*
	* Đếm số lượng sản phẩm đã xóa
	* @param thực hiện sau khi đếm số lượng sản phẩm
	* count: số lượng sản phẩm trả về
	*/
	countDeletedProduct : function(callback){
		var productModel= this.getProductModel();

		productModel.count({status: "Đã xóa"}, function(err, count){
			if (err) throw err;
			callback(count);
		});
	}

	/***************** TRANG ADMIN GROUP *******************************/
	//getAllCategory

};

module.exports = dao;
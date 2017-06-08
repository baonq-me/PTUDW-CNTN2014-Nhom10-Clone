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
		bills: null
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
	  		icon: String
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
	  		_id: this.mongoose.Schema.ObjectId,
	  		id : {type: String, require : true, unique: true},
	  		name: {type: String, require : true},
	  		imgPath: {type: String, require : true},
	  		slug: {type: String, require : true},		//Đường dẫn đến sản phẩm
	  		price: Number,
	  		categorySlug : [String],	//Đường dẫn của loại sản phẩm, 1 sản phẩm có thể có nhiều loại sản phẩm
	  		newPrice: Number,
	  		detail: String
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
	  		id : this.mongoose.Schema.ObjectId,
	  		social_id : { facebook: String, google: String, twitter: String },			// Dùng cho đăng nhập mạng xã hội
	  		type: {type: String, require: true},		// local, facebook, google, twitter
	  		fullName: String,
	  		username: String,
	  		email: String,
	  		password: String,
	  		address: String,
	  		tel: String
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
	  		cartInfo: Array
	  	});	

	  	//Tạo model từ categorySchema và có tên collection là 'categories'
	  	this.model.bills = this.mongoose.model('bills', UserSchema);
	  	return this.model.bills;
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
	*	@count số lượng product cần lấy
	*	@callback(data) được gọi khi lấy sản phẩm mới xong
	*		@output là data: mảng thông tin các product
	*		với mỗi sản phẩm có các thông tin sau:
	*			- id: mã sản phẩm (duy nhất)
	*			- name: tên sản phẩm
	*			- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*			- price: giá sản phẩm (đơn vị đông - kiểu number)
	*			- slug: đường dẫn tới sản phẩm (không chứa root - localhost:3000)
	*/
	getNewProduct: function(count, callback){
		//Lấy category model và product model
		var productModel = this.getProductModel();
		
		//Truy vấn DB lấy product có category là "san-pham-moi"
		var data = productModel.find({categorySlug: {"$in": ["san-pham-moi"]}})
		.limit(count)
		.select('id name imgPath price slug')
		.exec(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},

		/*	Lấy sản phẩm khuyến mãi
	*	@count số lượng product cần lấy
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
	getPromotionProduct: function(count, callback){
		//Lấy category model và product model
		var productModel = this.getProductModel();
		
		//Truy vấn DB lấy product có category là "san-pham-khuyen-mai"
		productModel.find({categorySlug: {"$in": ["san-pham-khuyen-mai"]}} )
		.limit(count)
		.select('id name imgPath price newPrice slug')
		.exec(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},

		/*	Lấy sản phẩm theo category
	*	@slugs: mảng các slug của category
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
	getProductsByCategory: function(slugs, count, callback){
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
		.select('id name imgPath price newPrice slug')
		.exec(function(err, data){
			if (err) throw err; 
			callback(data);
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
	*	@search từ khóa cần tìm kiếm
	*	@searchBy tiêu chí tìm kiếm [ 'price' | 'category']
	*	@count số lượng product
	*	@callback(data) được gọi khi lấy sản phẩm xong
	*		@data mảng thông tin các product
	*		với mỗi sản phẩm có các thông tin sau:
	*			- id: mã sản phẩm (duy nhất)
	*			- name: tên sản phẩm
	*			- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*			- price: giá sản phẩm (đơn vị đông - kiểu number)
	*			- newPrice: giá khuyến mãi (đơn vị đông - kiểu number)
	*			- slug: đường dẫn tới sản phẩm (không chứa root - localhost:3000)
	*/
	getProductsBySearch: function(search, searchBy, count, callback){
		//Lấy category model và product model
		var productModel = this.getProductModel();
		
		//Truy vấn DB
		if(searchBy == 'category'){
			productModel.find({name: new RegExp(search, "i")})
			.limit(count)
			.select('id name imgPath price slug')
			.exec(function(err, data){
				if (err) throw err;
				callback(data);
			});
		}
		else if(searchBy == 'price')
		{
			productModel.find({price: search})
			.limit(count)
			.select('id name imgPath price newPrice slug')
			.exec(function(err, data){
				if (err) throw err;
				callback(data);
			});
		};
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
	* Kiểm tra username đã tồn tại hay chưa
	* @username: username cần kiểm tra
	* @callback (data) : được gọi sau khi kiểm tra xong, 
	* data là kết quả trả về, 1: đã tồn tại, 0: chưa tồn tại
	*/
	checkUsername: function(username, callback){
		var userModel = this.getUserModel();

		userModel.findOne({username: username}, function(err, data){
			if(err) throw err;
			//Username đã tồn tại
			if(data != null){
				callback(1);
			}
			else
				callback(0);
		});
	},

	/*
	* Kiểm tra email đã tồn tại hay chưa
	* @email: email cần kiểm tra
	* @callback (data) : được gọi sau khi kiểm tra xong, 
	* data là kết quả trả về, 1: đã tồn tại, 0: chưa tồn tại
	*/
	checkUsername: function(email, callback){
		var userModel = this.getUserModel();

		userModel.findOne({email: email}, function(err, data){
			if(err) throw err;
			//Email đã tồn tại
			if(data != null){
				callback(1);
			}
			else
				callback(0);
		});
	},

	/*
	* Thêm user
	* @user: object user, gồm thông tin user
	*/

	/*
	*	args {name: string, sign_up_email: string, sign_up_username: string, sign_up_password: string, 
	*		sign_up_addr: string, sign_up_tel: string}
	*/
	addUserLocal: function(user){
		var userModel = this.getUserModel();

		var user = new userModel({
			fullName: user.name,
			email: user.sign_up_email,
			type: "local",
			username : user.sign_up_username,
			password: this.passwordHash.generate(user.sign_up_password),
			address: user.sign_up_addr,
			tel: user.sign_up_tel
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
		userModel.findOne({username:username}, function(err, data){
			if (err) throw err;
			if(data == null)
				callback(false)
			else{
				callback(dao.passwordHash.verify(password, data.password));
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
		userModel.findOne({"username":username}, function(err, data){
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

		userModel.findOne({username: username}, function(err, data){
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

		userModel.findOne({email: email, type: "local"}, function(err, data){
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
		userModel.findOne({username: username}, function(err, user){
			if(err) throw err;
			user.password = dao.passwordHash.generate(newpass);
			user.save(function(err, data){
				if(err) throw err;
				callback(true);
			});
		});
	},
	getMail: function(username, callback){
		var userModel = this.getUserModel();
		userModel.findOne({username: username})
		.select('email')
		.exec(function(err, data){
			callback(data);
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
		userModel.findOne({"social_id":uid}, function(err, data){
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
	  		social_id : user.uid,
	  		fullName: user.fullName,
	  		type: user.type,
	  		email: user.email,
	  		address: user.address
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

	/*
	*  Đếm số lượng sản phẩm
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
	* Lấy Danh sách sản phẩm hết hàng
	* @param thực hiện sau khi đếm số lượng sản phẩm
	*   data: mảng các object
	*   mỗi object là thông tin sản phẩm hết hàng gồm id, tên sản phẩm
	*/
	outOfProduct : function(callback){
		var productModel= this.getProductModel();

		productModel.find({quality : 0})
		.select('id name')
		.exec(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},

	/*
	* Lấy sản phẩm được thêm gần đây
	* @param số lượng sản phẩm cần lấy
	* 
	*/
	getNewProductAdmin : function(callback){
		var productModel = this.getProductModel();

		productModel.find()
		.select('id name quality dateAdded')
		.sort({dateAdded: -1})
		.limit(5)
		.exec(function(err, data){
			if (err) throw err;
			callback(data);
		});
	}
};

module.exports = dao;
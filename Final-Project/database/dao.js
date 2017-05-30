var dao = {
	mongoose : require ('mongoose'),
	dbName: 'do_an_web',
	dbUser: 'nhom10',
	dbPass: 'nhom10',
	userName: 'hiennguyen',
	pass: 'hiennguyen249',
	connStr: 'mongodb://nhom10:nhom10@ds157439.mlab.com:57439/do_an_web',

	model: {
		categories: null,
		products: null,
		users: null
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
	  		fullName: {type: String, require : true},
	  		username: {type: String, require : true, unique: true},
	  		email: {type: String, require : true, unique: true},
	  		password: {type: String, require : true},
	  		address: String,
	  		tel: String
	  	});

	  	//Tạo model từ categorySchema và có tên collection là 'categories'
	  	this.model.users = this.mongoose.model('users', UserSchema);
	  	return this.model.users;
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
	* Thêm username
	* @fullName: full name
	* @email: email
	* @username: username 
	* @password: password
	* @address: address user
	8 @tel: tel user
	* @callback (data) : được gọi sau khi kiểm tra xong, 
	* data là bộ dũ liệu mới được thêm vào
	*/

	addUser: function(fullName, email, username, password, address, tel, callback){
		var userModel = getUserModel();

		var user = new userModel({
			fullName: fullName,
			email: email,
			username : username,
			password: password,
			address: address,
			tel: tel
		});
		user.save(function(err, data){
			if(err) throw err;
			callback(data);
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
		userModel.findOne({username:username, password: password}, function(err, data){
			if (err) throw err;
			if(data == null)
				callback(false)
			else
				callback(true);
		});
	},

	/* Hàm lấy thông tin user
	* @username: username cần lấy thông tin
	* @callback: thực hiện sau khi lấy thông tin
	* return thông tin user
	*/

	getUser: function(username, callback){
		var userModel = this.getUserModel();
		userModel.findOne({username:username}, function(err, data){
			if (err) throw err;
			if(data != null)
				callback(data);
		});
	},
	hadUsername: function(username){
		return true;
	},
	hadEmail: function(email){
		return true;
	},
	/*
	*	args {name: string, sign_up_email: string, sign_up_username: string, sign_up_password: string, 
	*		sign_up_addr: string, sign_up_tel: string}
	*/
	signup: function(args, callback){
		callback(false);	// sign up thất bại
	}	

};
module.exports = dao;
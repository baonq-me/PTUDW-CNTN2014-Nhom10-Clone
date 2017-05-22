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
		products: null
	},

	//Hàm lấy/tạo Category model
	getCategoryModel: function(){
		//nếu đã tồn tại Category model thì return lại
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

	  	//Tạo model từ Schema và có tên collection là 'categorys'
	  	this.model.categories = this.mongoose.model('categories', categorySchema);
	  	return this.model.categories;
	},

	//Hàm lấy/tạo Product model
	getProductModel: function(){
		//nếu đã tồn tại Product model thì return lại
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
	  		categorySlug : Array,	//Đường dẫn của loại sản phẩm, 1 sản phẩm có thể có nhiều loại sản phẩm
	  		newPrice: Number,
	  		detail: String
	  	});

	  	//Tạo model từ Schema và có tên collection là 'categorys'
	  	this.model.products = this.mongoose.model('products', productSchema);
	  	return this.model.products;
	},

	//Hàm lấy/tạo Product Detail model
	/*getProductDetailModel: function(){
		//nếu đã tồn tại Product Detail model thì return lại
		if (this.model.productDetail !== null)
			return this.model.productDetail;
		//Ngược lại, tạo model Product mới
		//Tạo Schema Product
	  	var productDetailSchema = this.mongoose.Schema({
	  		id: {type: String, require : true, unique: true},
	  		name: {type: String, require : true},
	  		imgPath: {type: String, require : true},
	  		slug: {type: String, require : true},
	  		price: Number,
	  		categories : [{type: this.mongoose.Schema.ObjectId, ref : 'categories'}]
	  	});

	  	//Tạo model từ Schema và có tên collection là 'categorys'
	  	this.model.products = this.mongoose.model('products', productSchema);
	  	return this.model.products;
	},*/

	//Hàm connect database
	connect: function(callback){
		console.log('Connecting to database. Please wait....');
		if (this.mongoose.connection.readyState == 0){
			this.mongoose.connect(this.connStr);
			var db = this.mongoose.connection;
			db.on('error', console.error.bind(console, 'Error when connection to MongoDB:'));
			db.once('open', function(){
				console.log('Connected to MongoDB do_an_web database!');
				//After connected database, then excute callback
				callback();
			});
		} else callback();
	},


	close: function(){
		//this.mongoose.connection.close();
	},

	/*	Lấy tất cả category
	*	@param callback(data) được gọi khi lất tất cả category xong
	*		@data mảng thông tin các category
	*		với mỗi category có các thông tin sau:
	*			- name: tên category
	*			- slug: đường dẫn tới category (không chứa root - localhost:3000)
	*			- icon: icon cho category
	*/
	getAllCategory: function(callback){
		//Lấy category model
		var categoryModel = this.getCategoryModel();

		//Câu truy vấn lấy DB
		categoryModel.find(function(err, data){
			if (err) throw err;
			callback(data);
		});
	},

	/*	Lấy sản phẩm mới
	*	@param số lượng product
	*	@param callback(data) được gọi khi lấy sản phẩm mới xong
	*		@data mảng thông tin các product
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
		
		//Truy vấn DB lấy product có category là new-product
		var data = productModel.find({categorySlug: {"$in": ["san-pham-moi"]}}, function(err, data){
			if (err) throw err;
			callback(data);
		} )
		.limit(count)
		.select('id name imgPath price slug');
	},
		/*	Lấy sản phẩm khuyến mãi
	*	@param số lượng product
	*	@param callback(data) được gọi khi lấy sản phẩm khuyến mãi xong
	*		@data mảng thông tin các product
	*		với mỗi sản phẩm có các thông tin sau:
	*			- id: mã sản phẩm (duy nhất)
	*			- name: tên sản phẩm
	*			- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*			- newPrice: Giá khuyến mãi
	*			- price: giá sản phẩm (đơn vị đông - kiểu number)
	*			- slug: đường dẫn tới sản phẩm (không chứa root - localhost:3000)
	*/
	getPromotionProduct: function(count, callback){
		//Lấy category model và product model
		var productModel = this.getProductModel();
		
		//Truy vấn DB lấy product có category là new-product
		productModel.find({categorySlug: {"$in": ["san-pham-khuyen-mai"]}}, function(err, data){
			if (err) throw err;
			callback(data);
		})
		.limit(count)
		.select('id name imgPath price newPrice slug');
	},
		/*	Lấy sản phẩm theo category
	*	@param mảng các slug của category
	*	@param số lượng product
	*	@param callback(data) được gọi khi lấy sản phẩm theo category xong
	*		@data mảng thông tin các product
	*		với mỗi sản phẩm có các thông tin sau:
	*			- id: mã sản phẩm (duy nhất)
	*			- name: tên sản phẩm
	*			- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*			- price: giá sản phẩm (đơn vị đông - kiểu number)
	*			- slug: đường dẫn tới sản phẩm (không chứa root - localhost:3000)
	*/
	getProductsByCategory: function(slugs, count, callback){
		//Lấy category model và product model
		var productModel = this.getProductModel();
		
		//Truy vấn DB lấy product có categorySlug là slugs
		productModel.find({categorySlug: {"$in": slugs}}, function(err, data){
			if (err) throw err;
			callback(data);
		} )
		.limit(count)
		.select('id name imgPath price slug');
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
	*	@param từ khóa cần tìm kiếm
	*	@param tiêu chí tìm kiếm [ 'price' | 'category']
	*	@param số lượng product
	*	@param callback(data) được gọi khi lấy sản phẩm xong
	*		@data mảng thông tin các product
	*		với mỗi sản phẩm có các thông tin sau:
	*			- id: mã sản phẩm (duy nhất)
	*			- name: tên sản phẩm
	*			- imagePath: đường dẫn tới hình ảnh (không chứa root - localhost:3000)
	*			- price: giá sản phẩm (đơn vị đông - kiểu number)
	*			- slug: đường dẫn tới sản phẩm (không chứa root - localhost:3000)
	*/
	getProductsBySearch: function(search, searchBy, count, callback){
		//Lấy category model và product model
		var productModel = this.getProductModel();
		
		//Truy vấn DB
		if(searchBy == 'category'){
			productModel.find({name: new RegExp(search, "i")}, function(err, data){
				if (err) throw err;
				callback(data);
			})
			.limit(count)
			.select('id name imgPath price slug');
		}
		else if(searchBy == 'price')
		{
			productModel.find({price: search}, function(err, data){
				if (err) throw err;
				callback(data);
			})
			.limit(count)
			.select('id name imgPath price slug');
		};
	},

	/*
	*	Lấy thông tin chi tiết của sản phẩm
	*	@param slug của sản phẩm
	*	@param callback(data) được gọi khi lấy sản phẩm xong
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


};
module.exports = dao;
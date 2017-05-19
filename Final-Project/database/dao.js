var dao = {
	mongoose : require ('mongoose'),
	dbName: 'do_an_web',
	dbUser: 'nhom10',
	dbPass: 'nhom10',
	connStr: 'mongodb://nhom10:nhom10@ds157439.mlab.com:57439/do_an_web',

	model: {
		categorys: null
	},

	//Hàm lấy/tạo Category model
	getCategoryModel: function(){
		//nếu đã tồn tại Category model thì return lại
		if (this.model.categorys !== null)
			return this.model.categorys;
		//Ngược lại, tạo model Category mới
		//Tạo Schema category 
	  	var categorySchema = this.mongoose.Schema({
	  		name: String,
	  		slug: String,
	  		icon: String
	  	});

	  	//Tạo model từ Schema và có tên collection là 'categorys'
	  	this.model.categorys = this.mongoose.model('categorys', categorySchema);
	  	return this.model.categorys;
	},

	//Hàm connect database
	connect: function(callback){
		console.log('Connecting to database. Please wait....');
		this.mongoose.connect(this.connStr);
		var db = this.mongoose.connection;
		db.on('error', console.error.bind(console, 'Error when connection to MongoDB:'));
		db.once('open', function(){
			console.log('Connected to MongoDB hien-test database!');
			//After connected database, then excute callback
			callback();
		});
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
			//Test
			console.log(data);
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
		callback([
			{
				id: 1,
				name: "Sản phẩm 1",
				imagePath: "/images/new_product/pro1.jpg",
				price: 100000,
				slug: "/product/product-1"
			},
			{
				id: 2,
				name: "Sản phẩm 2",
				imagePath: "/images/new_product/pro2.jpg",
				price: 100000,
				slug: "/product/product-1"
			},
			{
				id: 3,
				name: "Sản phẩm 3",
				imagePath: "/images/new_product/pro3.jpg",
				price: 100000,
				slug: "/product/product-1"
			},
			{
				id: 4,
				name: "Sản phẩm 4",
				imagePath: "/images/new_product/pro4.jpg",
				price: 100000,
				slug: "/product/product-1"
			},
			{
				id: 5,
				name: "Sản phẩm 5",
				imagePath: "/images/new_product/pro5.jpg",
				price: 100000,
				slug: "/product/product-1"
			},
			{
				id: 6,
				name: "Sản phẩm 6",
				imagePath: "/images/new_product/pro6.jpg",
				price: 100000,
				slug: "/product/product-1"
			},
		]);
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
	promotionProducts: function(count, callback){
		callback([
			{
				id: 1,
				name: "Sản phẩm 1",
				imagePath: "/images/new_product/pro1.jpg",
				newPrice: 50000,
				price: 100000,
				slug: "/product/product-1"
			},
			{
				id: 2,
				name: "Sản phẩm 2",
				imagePath: "/images/new_product/pro2.jpg",
				newPrice: 50000,
				price: 100000,
				slug: "/product/product-1"
			},
			{
				id: 3,
				name: "Sản phẩm 3",
				imagePath: "/images/new_product/pro3.jpg",
				newPrice: 50000,
				price: 100000,
				slug: "/product/product-1"
			},
			{
				id: 4,
				name: "Sản phẩm 4",
				imagePath: "/images/new_product/pro4.jpg",
				newPrice: 50000,
				price: 100000,
				slug: "/product/product-1"
			},
			{
				id: 5,
				name: "Sản phẩm 5",
				imagePath: "/images/new_product/pro5.jpg",
				newPrice: 50000,
				price: 100000,
				slug: "/product/product-1"
			},
			{
				id: 6,
				name: "Sản phẩm 6",
				imagePath: "/images/new_product/pro6.jpg",
				newPrice: 50000,
				price: 100000,
				slug: "/product/product-1"
			},
		]);
	},


};
module.exports = dao;
var dao = {
	





	/*	Lấy tất cả category
	*	@param callback(data) được gọi khi lất tất cả category xong
	*		@data mảng thông tin các category
	*		với mỗi category có các thông tin sau:
	*			- name: tên category
	*			- slug: đường dẫn tới category (không chứa root - localhost:3000)
	*			- icon: icon cho category
	*/
	getAllCategory: function(callback){
		callback([
			{
				'name': "Hoa chúc mừng",
				'slug': "/hoa-chuc-mung",
				'icon': "glyphicon glyphicon-glass"
			},
			{
				'name': "Hoa chúc mừng",
				'slug': "/hoa-chuc-mung",
				'icon': "glyphicon glyphicon-glass"
			},
			{
				'name': "Hoa chúc mừng",
				'slug': "/hoa-chuc-mung",
				'icon': "glyphicon glyphicon-glass"
			},
			{
				'name': "Hoa chúc mừng",
				'slug': "/hoa-chuc-mung",
				'icon': "glyphicon glyphicon-glass"
			},
			{
				'name': "Hoa chúc mừng",
				'slug': "/hoa-chuc-mung",
				'icon': "glyphicon glyphicon-glass"
			},
		]);
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
	getPromotionProduct: function(count, callback){
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
		/*	Lấy sản phẩm theo category
	*	@param slug của category
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
	getProductsByCategory: function(slug, count, callback){
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
			{
				id: 7,
				name: "Sản phẩm 4",
				imagePath: "/images/new_product/pro4.jpg",
				price: 100000,
				slug: "/product/product-1"
			},
			{
				id: 8,
				name: "Sản phẩm 5",
				imagePath: "/images/new_product/pro5.jpg",
				price: 100000,
				slug: "/product/product-1"
			},
			{
				id: 9,
				name: "Sản phẩm 6",
				imagePath: "/images/new_product/pro6.jpg",
				price: 100000,
				slug: "/product/product-1"
			},
		]);
	},


};
module.exports = dao;
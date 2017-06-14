$(document).ready(function(){
	
	/******** Admin product **************/
	// 0: all
	// 1: stock
	// 2: out of
	// 3: deleted
	// 4: stop sell
	var productFilter = {"product-all": 0, "product-stock": 1, "product-out-of": 2, "product-deleted": 3, "product-stop-sell": 4};


	function loadProducts(count, skip, isEmpty = true) {
		$("table").css("opacity", "0.5");
		var type = productFilter[$(".filter-product.active").attr("id")];
		var query = $("#product-search").val();
		var catID = $("select[name='category'] option:selected").val();
		function addRow(product) {
			var row = '<tr><td><div class="checkbox"><label><input data-id="' + product._id + '" type="checkbox" value=""></label></div></td><td><img src="' + product.imgPath + '" class="img-thumbnail"></td><td><a href="/admin/product/edit?id=' + product._id + '"><strong>' + product.name + '</strong></a></td><td>' + product.quality + '</td><td>' + product.price + '</td><td>' + product.newPrice+ '</td><td>' + product.categorySlug+ '</td><td>' + product.dateAdded+ '</td><td>' + product.status+ '</td></tr>';
			$('#products').append(row);
		}

		// Set viewmore
		$(".view-more").data("type", type);

		$.ajax({
			url: '/admin/api/products', //URL lay du lieu
			type: 'GET',
			data: {
				type: type,
				skip: skip,
				count: count,
				query: query,
				catID: catID
			},
			success: function(res) {
				if(isEmpty)
					$('#products').empty();
				for (i = 0; i < res.length; ++i) {
					if (res[i].newPrice == undefined)
						res[i].newPrice = '';
					addRow(res[i]);
				}
				if(res.length < count)
					$(".view-more").hide()
				else
					$(".view-more").show()

				$("table").css("opacity", "1");
			}
		});
	}

	$('#product-all').on('click', function(e) {
		e.preventDefault();
		$(".filter-product").removeClass("active");
		$(this).addClass("active");
		loadProducts(10, 0);
	});

	$('#product-stock').on('click', function(e) {
		e.preventDefault();
		$(".filter-product").removeClass("active");
		$(this).addClass("active");
		loadProducts(10, 0);
	});

	$('#product-out-of').on('click', function(e) {
		e.preventDefault();
		$(".filter-product").removeClass("active");
		$(this).addClass("active");
		loadProducts(10, 0);
	});

	$('#product-deleted').on('click', function(e) {
		e.preventDefault();
		$(".filter-product").removeClass("active");
		$(this).addClass("active");
		loadProducts(10, 0);
	});

	$('#product-stop-sell').on('click', function(e) {
		e.preventDefault();
		$(".filter-product").removeClass("active");
		$(this).addClass("active");
		loadProducts(10, 0);
	});

	$(".view-more").click(function(e){
		e.preventDefault();
		var type = parseInt($(this).data("type"));
		var count = 10;
		var skip = $("tbody#products tr").length;
		loadProducts(count, skip, false);
	});

	$("#product-search").change(function(){
		loadProducts(10, 0);
	});
	$("select[name='category']").change(function(){
		loadProducts(10, 0);
	});


	loadProducts(10, 0);

	$("#check-all").change(function(){
		if($("#check-all:checked").length > 0){
			$("#products .checkbox input").attr("checked", true);
		} else $("#products .checkbox input").attr("checked", false);
	});

	$("#delete-product").click(function(){
		setActionProduct("delete");
	});
	$("#sale-product").click(function(){
		setActionProduct("sale");
	});
	$("#stop-product").click(function(){
		setActionProduct("stop");
	});
	
	function setActionProduct(action){
		var status = {delete: "Đã xóa", stop: "Ngừng bán", sale: "Đang bán"};
		var products = [];
		$("#products .checkbox input:checked").each(function(){
			products.push($(this).data("id"));
		});
		$.ajax({
			url: "/admin/api/products",
			type: "post",
			data: {
				"products": products, 
				"status": status[action]
			},
			async: false,
			success: function(data, status){
				if(status == "success")
					loadProducts(10, 0);
				else alert(action + " không thành công!")
			}
		});
	}
})
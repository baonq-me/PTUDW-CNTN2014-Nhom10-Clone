$(document).ready(function(){

	/******** Admin product **************/
	// 0: all
	// 1: stock
	// 2: out of
	// 3: deleted
	// 4: stop sell

	function loadProducts(type, count, skip, isEmpty = true) {
		$("table").css("opacity", "0.5");
		var query = $("#product-search").val();
		var catID = $("select[name='category'] option:selected").val();
		function addRow(product) {
			var row = '<tr><td><div class="checkbox"><label><input type="checkbox" value=""></label></div></td><td><img src="' + product.imgPath + '" class="img-thumbnail"></td><td>' + product.name + '</td><td>' + product.quality + '</td><td>' + product.price + '</td><td>' + product.newPrice+ '</td><td>' + product.categorySlug+ '</td><td>' + product.dateAdded+ '</td><td>' + product.status+ '</td></tr>';
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
		loadProducts(0, 10, 0);
	});

	$('#product-stock').on('click', function(e) {
		e.preventDefault();
		$(".filter-product").removeClass("active");
		$(this).addClass("active");
		loadProducts(1, 10, 0);
	});

	$('#product-out-of').on('click', function(e) {
		e.preventDefault();
		$(".filter-product").removeClass("active");
		$(this).addClass("active");
		loadProducts(2, 10, 0);
	});

	$('#product-deleted').on('click', function(e) {
		e.preventDefault();
		$(".filter-product").removeClass("active");
		$(this).addClass("active");
		loadProducts(3, 10, 0);
	});

	$('#product-stop-sell').on('click', function(e) {
		e.preventDefault();
		$(".filter-product").removeClass("active");
		$(this).addClass("active");
		loadProducts(4, 10, 0);
	});

	$(".view-more").click(function(e){
		e.preventDefault();
		var type = parseInt($(this).data("type"));
		var count = 10;
		var skip = $("tbody#products tr").length;
		loadProducts(type, count, skip, false);
	});
	var productFilter = {"product-all": 0, "product-stock": 1, "product-out-of": 2, "product-deleted": 3, "product-stop-sell": 4};
	$("#product-search").change(function(){
		var type = productFilter[$(".filter-product.active").attr("id")];
		loadProducts(type, 10, 0);
	});
	$("select[name='category']").change(function(){
		var type = productFilter[$(".filter-product.active").attr("id")];
		loadProducts(type, 10, 0);
	});


	loadProducts(0, 10, 0);



})

$(document).ready(function(){

	/******** Admin product **************/
	// 0: all
	// 1: stock
	// 2: out of
	// 3: deleted
	// 4: stop sell

	function loadProducts(type, count, skip, isEmpty = true) {
		function addRow(product) {
			var row = '<tr data-name="' + product.name.toLowerCase() + '"><td><div class="checkbox"><label><input type="checkbox" value=""></label></div></td><td><img src="' + product.imgPath + '" class="img-thumbnail"></td><td>' + product.name + '</td><td>' + product.quality + '</td><td>' + product.price + '</td><td>' + product.newPrice+ '</td><td>' + product.categorySlug+ '</td><td>' + product.dateAdded+ '</td><td>' + product.status+ '</td></tr>';
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
				count: count
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
			}
		});
	}

	$('#product-all').on('click', function(e) {
		e.preventDefault();
		loadProducts(0, 10, 0);
	});

	$('#product-stock').on('click', function(e) {
		e.preventDefault();
		loadProducts(1, 10, 0);
	});

	$('#product-out-of').on('click', function(e) {
		e.preventDefault();
		loadProducts(2, 10, 0);
	});

	$('#product-deleted').on('click', function(e) {
		e.preventDefault();
		loadProducts(3, 10, 0);
	});

	$('#product-stop-sell').on('click', function(e) {
		e.preventDefault();
		loadProducts(4, 10, 0);
	});

	$(".view-more").click(function(e){
		e.preventDefault();
		var type = parseInt($(this).data("type"));
		var count = 10;
		var skip = $("tbody#products tr").length;
		loadProducts(type, count, skip, false);
	});

	loadProducts(0, 10, 0);

	// Tìm kiếm
	$("#product-search").keyup(function(e){
		var q = $(this).val().toLowerCase();
		if(q == "") $("tbody#products tr").show(200);
		else{
			var selectorShow = "tbody#products tr[data-name*='" + q + "']";
			$("tbody#products tr").not(selectorShow).hide(200);
			//alert($(selectorShow).length)
			$(selectorShow).show(200);
		}
	});

})

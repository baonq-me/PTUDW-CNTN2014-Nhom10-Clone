$(document).ready(function(){	

	/******** Admin product **************/
	// 0: all
	// 1: stock
	// 2: out of
	// 3: deleted
	// 4: stop sell

	function loadProducts(type) {
		function addRow(product) {
			var row = '<tr><td><div class="checkbox"><label><input type="checkbox" value=""></label></div></td><td><img src="' + product.imgPath + '" class="img-thumbnail"></td><td>' + product.name + '</td><td>' + product.quality + '</td><td>' + product.price + '</td><td>' + product.newPrice+ '</td><td>' + product.categorySlug+ '</td><td>' + product.dateAdded+ '</td><td>' + product.status+ '</td></tr>';
			$('#products').append(row);
		}

		$.ajax({
			url: '/admin/api/products', //URL lay du lieu
			type: 'GET',
			data: {
				type: type
			},
			success: function(res) {
				$('#products').empty();
				for (i = 0; i < res.length; ++i) {
					addRow(res[i]);
				}
			}
		});
	}

	$('#product-all').on('click', function(e) {
		e.preventDefault();
		loadProducts(0);
	});
	
	$('#product-stock').on('click', function(e) {
		e.preventDefault();
		loadProducts(1);
	});

	$('#product-outOf').on('click', function(e) {
		e.preventDefault();
		loadProducts(2);
	});

	$('#product-deleted').on('click', function(e) {
		e.preventDefault();
		loadProducts(3);
	});

	$('#product-stop-sell').on('click', function(e) {
		e.preventDefault();
		loadProducts(4);
	});

	loadProducts(0);
})
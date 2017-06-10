$(document).ready(function(){
	var full = true;
	$("#site-container .left-menu .toggle").click(function(){
		if(full){
			$("#site-container").removeClass("menu-small");
			$("#site-container").addClass("menu-full");
		}else{
			$("#site-container").removeClass("menu-full");
			$("#site-container").addClass("menu-small");
		}
		full = !full;
	});
	var path = window.location.pathname;
	path = (path == "/admin/") ? '/admin/dashboard' : path;
	var selector = "a[href|='" + path + "']";
	$(selector).parent().addClass("active");

	/******** Admin index **************/
	function loadOutOfProducts() {
		function addRow(id, name) {
			var row = '<tr><td>' + id + '</td><td><b>' + name + '</b></td></tr>';
			$('#out-of-products').append(row);
		}

		$.ajax({
			url: '/admin/out-of-products', //URL lay du lieu
			type: 'GET',
			data: {},
			success: function(res) {
				for (i = 0; i < res.length; ++i) {
					addRow(res[i].id, res[i].name);
				}
			}
		});
	}

	loadOutOfProducts();

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

	$('#product-out-of').on('click', function(e) {
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
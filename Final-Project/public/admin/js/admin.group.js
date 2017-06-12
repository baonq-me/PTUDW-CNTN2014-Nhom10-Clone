$(document).ready(function(){
	/******** Admin index **************/
	function loadCategories() {
		function addRow( name, slug, countProduct) {
			var row = '<tr><td><div class="checkbox"><label><input id="product-select-all-btn" type="checkbox" value=""></label></div></td><td>' +name + '</td><td>' + slug + '</td><td>' + countProduct + '</td></tr>';
			$('#categories').append(row);
		}

		$.ajax({
			url: '/admin/categories', //URL lay du lieu
			type: 'GET',
			data: {},
			success: function(res) {
				for (i = 0; i < res.length; ++i) {
					addRow(res[i].name, res[i].slug, res[i].countProduct);
				}
			}
		});
	}

	loadCategories();
})
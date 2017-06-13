$(document).ready(function(){
	/******** Admin index **************/
	function loadCategories(count, skip, isEmpty = true) {
		function addRow( name, slug, countProduct) {
			var row = '<tr><td><div class="checkbox"><label><input id="product-select-all-btn" type="checkbox" value=""></label></div></td><td>' +name + '</td><td>' + slug + '</td><td>' + countProduct + '</td></tr>';
			$('#categories').append(row);
		}

		$.ajax({
			url: '/admin/categories', //URL lay du lieu
			type: 'GET',
			data: {count: count, skip: skip},
			success: function(res) {
				if(isEmpty)
					$('#categories').empty();
				for (i = 0; i < res.length; ++i) {
					addRow(res[i].name, res[i].slug, res[i].countProduct);
				}
				if(res.length < count)
					$(".view-more").hide();
				else
					$(".view-more").show();
			}
		});
	}

	loadCategories();

	$(".view-more").click(function(e){
		e.preventDefault();
		var count = 10;
		var skip = $("tbody#categories tr").length;
		loadCategories(count, skip, false);
	});
})
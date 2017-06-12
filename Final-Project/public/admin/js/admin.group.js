$(document).ready(function(){
	/******** Admin index **************/
	function loadCategories() {
		function addRow(id, name) {
			var row = '<tr><td>' + id + '</td><td><b>' + name + '</b></td></tr>';
			$('#out-of-products').append(row);
		}

		$.ajax({
			url: '/admin/categories', //URL lay du lieu
			type: 'GET',
			data: {},
			success: function(res) {
				for (i = 0; i < res.length; ++i) {
					addRow(res[i].id, res[i].name);
				}
			}
		});
	}

	loadCategories();
})
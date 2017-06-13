$(document).ready(function(){
	/******** Admin index **************/
	function loadCategories(count, skip, isEmpty = true) {

		function addRow(category) {
			var row = '<tr><td><div class="checkbox"><label><input data-id="'+ category._id + '" type="checkbox" value=""></label></div></td><td>' + category.name + '</td><td>' + category.slug + '</td><td>' + category.icon + '</td><td>' + category.countProduct + '</td></tr>';
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
					addRow(res[i]);
				}
				if(res.length <= count){					
					$(".view-more").hide();
				}
				else{
					$(".view-more").show();					
				}
			}
		});
	};

	loadCategories(10, 0, true);

	$(".view-more").click(function(e){
		e.preventDefault();
		var count = 10;
		var skip = $("tbody#categories tr").length;
		loadCategories(count, skip, false);
	});

	//Xử lý khi click chọn tất cả
	$("#check-all").change(function(){
		if($("#check-all:checked").length > 0){
			$("#categories .checkbox input").attr("checked", true);
		} else $("#categories .checkbox input").attr("checked", false);
	});

	//Xóa category
	$("#delete-category").click(function(){
		//alert(123);
		var categories = [];
		$('#category .checkbox input:checked').each(function(){
			categories.push($(this).data("id"));
			console.log(categories);
		});
		$.ajax({
			url: '/admin/categories/delete',
			type: 'POST',
			data: {
				categories:categories
			},
			success: function(status){
				if (status=="success")
					loadCategories(10, 0);
				else
					alert('Xóa không thành công!');

			}


		});
	});
});
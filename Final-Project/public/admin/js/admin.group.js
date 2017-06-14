$(document).ready(function(){
	/******** Admin index **************/
	function loadCategories(count, skip, isEmpty = true) {

		function addRow(category) {
			var row = '<tr><td><div class="checkbox"><label><input data-id="'+ category._id + '" type="checkbox" value=""></label></div></td><td><a href="/admin/group/edit?id=' + category._id + '"><strong>' + category.name + '</strong></a></td><td>' + category.slug + '</td><td>' + category.icon + '</td><td>' + category.countProduct + '</td></tr>';
			$('#categories').append(row);
		}

		function setQuality(quality){
			$("#quality").text (quality);
		}

		$.ajax({
			url: '/admin/categories', //URL lay du lieu
			type: 'GET',
			data: {count: count, skip: skip},
			success: function(res) {
				if(isEmpty)
					$('#categories').empty();
				setQuality(res.quality);
				for (i = 0; i < res.categories.length; ++i) {
					addRow(res.categories[i]);
				}

				if(res.categories.length <= count){					
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
		var categories = [];
		$('#categories .checkbox input:checked').each(function(){
			categories.push($(this).data("id"));
		});
		$.ajax({
			url: '/admin/categories/delete',
			type: 'POST',
			data: {
				categories:categories
			},
			success: function(results){
				var fails = 0, success = 0;
				for (i=0; i<results.length; i++){
					if(results[i] == "fail"){
						fails++;
					}
					else
						success++;
				}
				if(fails == 0 ){
					alert(success + ' Nhóm sản phẩm được xóa thành công! ');
				}
				else if(success ==0 ){
					alert(fails  + ' Nhóm sản phẩm không được xóa thành công! ');
				}
				else
					alert(success + ' Nhóm sản phẩm được xóa thành công! ' + fails+  ' Nhóm sản phẩm không được xóa thành công!');
				
			}

		});
	});

	//Sửa thông tin category
	//$("category ")
});
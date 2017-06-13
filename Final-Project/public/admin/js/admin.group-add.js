$(document).ready(function(){
	//Kiểm tra tên nhóm sản phẩm đã tồn tại hay chưa
	$("#category-add-name").focusout(function(){
		var name = $(this).val();
		if (name == "") return;
		$.ajax({
			url: "/admin/categories/add/checkName",
			type: "POST",
			data: {name: name},
			success: function(res){
				//Nếu đã có tên nhóm sản phẩm
				if(res){
					$("#msgNameCat").text("Tên nhóm sản phẩm đã tồn tại!");
					//$("#category-add-name").text("");
				}
				else{
					$("#msgNameCat").text("");
				}
			}
		});
	});

	//Kiểm tra slug nhóm sản phẩm đã tồn tại hay chưa
	$("#category-add-slug").focusout(function(){
		var slug = $(this).val();
		if (slug == "") return;
		$.ajax({
			url: "/admin/categories/add/checkSlug",
			type: "POST",
			data: {slug: slug},
			success: function(res){
				//Nếu đã có tên nhóm sản phẩm
				if(res){
					$("#msgSlugCat").text("Slug nhóm sản phẩm đã tồn tại!");
					//$("#category-add-name").text("");
				}
				else{
					$("#msgSlugCat").text("");
				}
			}
		});
	});
});
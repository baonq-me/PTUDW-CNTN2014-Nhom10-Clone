$(document).ready(function(){
	function catValid(){
		var numCat = parseInt($("input[name='count_cat']").val());
		for (i = 0; i < numCat; i++){
			var selector = "select[name='cat_" + i + "'] option:checked";
			if ($(selector).length == 0 || $(selector).val() == "0")
				return false;
		}
		return true;
	} 
	function catUnique(){
		var numCat = parseInt($("input[name='count_cat']").val());
		var tmp = [];
		for (i = 0; i < numCat; i++){
			var selector = "select[name='cat_" + i + "']";
			if(tmp.indexOf($(selector).val()) != -1)
				return false
			tmp.push($(selector).val());
		}
		return true;
	}
	function addEventCat(selectName){
		var selector = "select[name='" + selectName + "']";
		$(selector).change(function(){
			if(catUnique()) return true;
			return false;
		})
	}
	addEventCat("cat_0");
	$("#add_cat").click(function(){
		if (!catValid() || !catUnique()) return;
		var selectBoxHtml = $("select[name='cat_0']")[0].outerHTML;
		$("input[name='count_cat']").before(selectBoxHtml);
		var numCat = parseInt($("input[name='count_cat']").val()) + 1;
		$("input[name='count_cat']").val(numCat);
		$("select[name='cat_0']:last-of-type").attr("name", "cat_" + (numCat - 1));
		addEventCat("cat_" + (numCat - 1));
	});
	$("#del_cat").click(function(){
		var numCat = parseInt($("input[name='count_cat']").val());
		if (numCat <= 1) return;
		$("select.category:last-of-type").remove();
		$("input[name='count_cat']").val(numCat-1);
	});

	$("input[name='name']").focusout(function(){
		var name = $(this).val();
		$.ajax({
			url: "/admin/api/product/add",
			data: {
				type: "name",
				data: name
			},
			type: "get",
			success: function(isUnique, status){
				if (status == 'success' && isUnique)
					$("#err_name").hide();
				else $("#err_name").show();
			}
		});
	})
	$("input[name='slug']").focusout(function(){
		var name = $(this).val();
		$.ajax({
			url: "/admin/api/product/add",
			data: {
				type: "slug",
				data: name
			},
			type: "get",
			success: function(isUnique, status){
				if (status == 'success' && isUnique)
					$("#err_slug").hide();
				else $("#err_slug").show();
			}
		});
	})

	// upload hình ảnh
	$("#image-upload").change(function(){
		if ($(this)[0].files && $(this)[0].files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$('#view-img').attr('src', e.target.result);
			};
			reader.readAsDataURL($(this)[0].files[0]);
			$('#display-image-upload').css("display", "block")
			if($("input[name='edit_img']").length > 0)
				$("input[name='edit_img']").val("true");
		}
	});

});
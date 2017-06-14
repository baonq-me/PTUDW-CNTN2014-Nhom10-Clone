$(document).ready(function(){
	function refreshTotalPrice(){
		var totalPrice = 0;
		$(".product_set").each(function(){
			if($(this).find("select").val() != "0")
				totalPrice += parseInt($(this).find("select option:checked").data("uniprice"))
						* parseInt($(this).find(".count_product").val());
		});
		$("#total-price").text(totalPrice + " đ");
	}
	function productValid(){
		var numProduct = parseInt($("input[name='count_line']").val());
		for (i = 0; i < numProduct; i++){
			var selector = "select[name='product_" + i + "'] option:checked";
			if ($(selector).length == 0 || $(selector).val() == "0")
				return false;
		}
		return true;
	} 
	function productUnique(){
		var numProduct = parseInt($("input[name='count_line']").val());
		var tmp = [];
		for (i = 0; i < numProduct; i++){
			var selector = "select[name='product_" + i + "']";
			if(tmp.indexOf($(selector).val()) != -1)
				return false
			tmp.push($(selector).val());
		}
		return true;
	}
	function addEventCat(selectName){
		var selector = "select[name='" + selectName + "']";
		$(selector).change(function(){
			refreshTotalPrice()
			if(productUnique()) return true;
			return false;
		})
		selector = "input[name='count_" + selectName + "']";
		$(selector).change(function(){
			refreshTotalPrice()
			if(productUnique()) return true;
			return false;
		})
	}
	refreshTotalPrice();
	addEventCat("product_0");
	$("#add_product").click(function(){
		if (!productValid() || !productUnique()) return;
		var selectBoxHtml = $(".product_set")[0].outerHTML;
		$("input[name='count_line']").before(selectBoxHtml);
		var numProduct = parseInt($("input[name='count_line']").val()) + 1;
		$("input[name='count_line']").val(numProduct);
		$("select[name='product_0']:last").attr("name", "product_" + (numProduct - 1));
		$("input[name='count_product_0']:last").attr("name", "count_product_" + (numProduct - 1));
		addEventCat("product_" + (numProduct - 1));
	});
	$("#del_product").click(function(){
		var numProduct = parseInt($("input[name='count_line']").val());
		if (numProduct <= 1) return;
		$(".product_set:last").remove();
		$("input[name='count_line']").val(numProduct-1);
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
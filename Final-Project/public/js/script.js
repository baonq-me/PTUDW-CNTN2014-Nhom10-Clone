/*Kiểm tra tính đúng đắn của form đăng ký tài khoản*/
function validateFormSignUp(){
	var password1 = document.forms["sign_up_form"]["sign_up_password"].value;
	var password2 = document.forms["sign_up_form"]["sign_up_reenter_password"].value;

	if(password1 != password2){
		document.getElementById("sign_up_msg_reenter_pass").innerHTML = "Mật khẩu nhập lại không trùng khớp!!!"
		return false;
	}
};


/*Kiểm tra tính đúng đắn của form set lại password*/
function validateFormSetNewPass(){
	var password1 = document.forms["set_new_pass"]["set_new_pass_pass1"].value;
	var password2 = document.forms["set_new_pass"]["set_new_pass_pass2"].value;

	if(password1 != password2){
		document.getElementById("set_new_pass_msg_reenter_pass").innerHTML = "Mật khẩu nhập lại không trùng khớp!!!"
		return false;
	}
};

/*Kiểm tra tính đúng đắn của form thay đổi password*/
function validateFormChangePass(){
	var password1 = document.forms["change_pass"]["changepass_pass1"].value;
	var password2 = document.forms["change_pass"]["changepass_pass2"].value;

	if(password1 != password2){
		document.getElementById("sign_up_msg_reenter_pass").innerHTML = "Mật khẩu nhập lại không trùng khớp!!!"
		return false;
	}
};


$(document).ready(function(){
	// Active menu
	var path = window.location.pathname;
	var selector = "a[href|='" + path + "']";
	$(selector).parent().addClass("active");

	if(path.startsWith("/category"))
		$("a[href|='/category']").parent().addClass("active");

	$(".left-menu a").each(function(){
		if(path.startsWith($(this).attr("href")))
			$(this).parent().addClass("active");
	})
	// Focus search
	$(".search-form .form-group input").focusin(function(){
		$(".search-form .form-group").css("width", "150%");
	})
	// Focus search
	$(".search-form .form-group input").focusout(function(){
		$(".search-form .form-group").css("width", "32px");
	})

	// Chọn input thích hợp
	$("#search-body select[name='searchBy']").change(function(){
		if($(this).find("option:selected").val() == "price"){
			$("#search-body input[name='search']").hide();
			$("#search-body input[name='priceFrom']").show();
			$("#search-body input[name='priceTo']").show();
		}else{
			$("#search-body input[name='search']").show();
			$("#search-body input[name='priceFrom']").hide();
			$("#search-body input[name='priceTo']").hide();
		}
	});

	if($("body").outerHeight() <  $(window).height()){
		var min_height = $(window).height() - $("#header").outerHeight() - $("#footer").outerHeight();
		min_height = "" + min_height + "px";
		$("#content").css("min-height",min_height);
	}
	$(window).scroll(function(){
		if ($("#footer").offset().top + $("#footer").outerHeight() - $(window).height() > $("#primary-menu").outerHeight() )
			if($(window).scrollTop() > $(".top-menu").outerHeight())
				$("#primary-menu").addClass("sticky");
			else $("#primary-menu").removeClass("sticky");
	});
	if ($("#content .sidebar").length > 0){
		$(window).scroll(function(){
			var p1 = $("#primary-menu").offset().top + $("#primary-menu").outerHeight();
			var p2 = $("#content").offset().top;
			var posLimTop = (p1 > p2) ? p1 : p2;
			var posLimBot = $("#content").offset().top + $("#content").outerHeight() - 100;

			var hSidebar = $("#content .sidebar").outerHeight();
			var posTop = $("#content .sidebar").offset().top;
			var posBot = $("#content .sidebar").offset().top + $("#content .sidebar").outerHeight();

			var position = posLimTop;

			if (posLimBot - posLimTop > hSidebar){
				position = posLimTop;
			}
			else {
				position = posLimBot - hSidebar;
			}

			position -= p2;

			$("#content .sidebar").css("top", position + "px");
		});
	}



// Popup
    $(".popup .close-popup").click(function(){
    	$(this).parents(".popup").css("display", "none");
    });

    $(".show-popup-login").click(function(){
    	$(".popup-login").css("display", "block");
    });


    //Kiểm tra độ mạnh của password ở trang đăng ký tài khoản
    $('#sign_up_password').keyup(function()
	{
		$('#result_strength_pass').html(checkStrength($('#sign_up_password').val()))
	});

	//Kiểm tra độ mạnh của password ở trang set lại tài khoản mới
    $('#set_new_pass_pass1').keyup(function()
	{
		$('#set_new_pass_result_strength_pass').html(checkStrength($('#set_new_pass_pass1').val()))
	});

	//Kiểm tra độ mạnh của password ở trang thay đổi mật khẩu
    $('#changepass_pass1').keyup(function()
	{
		$('#result_strength_pass').html(checkStrength($('#changepass_pass1').val()))
	});
	
	
	function checkStrength(password)
	{
		//initial strength
		var strength = 0
		
		//if the password length is less than 8, return message.
		if (password.length < 8) { 
			$('#result_strength_pass').removeClass()
			$('#result_strength_pass').addClass('short')
			return '<div style="color:red">Quá ngắn!</div>'
		}
		
		//length is ok, lets continue.
		
		//if length is 8 characters or more, increase strength value
		if (password.length > 7) strength += 1
		
		//if password contains both lower and uppercase characters, increase strength value
		if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))  strength += 1
		
		//if it has numbers and characters, increase strength value
		if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))  strength += 1 
		
		//if it has one special character, increase strength value
		if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))  strength += 1
		
		//if it has two special characters, increase strength value
		if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
		
		//now we have calculated strength value, we can return messages
		
		//if value is less than 2
		if (strength < 2 )
		{
			$('#result_strength_pass').removeClass()
			$('#result_strength_pass').addClass('weak')
			return '<div style="color:#f7aa25">Yếu!</div>'			
		}
		else if (strength == 2 )
		{
			$('#result_strength_pass').removeClass()
			$('#result_strength_pass').addClass('good')
			return '<div style="color:#2285da">Khá!</div>'		
		}
		else
		{
			$('#result_strength_pass').removeClass()
			$('#result_strength_pass').addClass('strong')
			return '<div style="color:#19bd1b">Mạnh!</div>'
		}
	}

    // Set Bill info
    //setBillingInfo();

    // Set Phương thức thanh toán
	$(".cart-pay .form-pay-info .pay-info").slideUp(0);
	$(".cart-pay input[name=pay_method]").change(function(){
		if($(".cart-pay input[name=pay_method]:checked").val() === "by-card"){
			$(".cart-pay .form-pay-info .pay-info").slideDown(500);
			setNoneValFormPayInfo();
		}
		else{
			$(".cart-pay .form-pay-info .pay-info").slideUp(500);
			setDefaultFormPayInfo();
		}
	});

	// Kiểm tra email
	$("#sign_up_email").focusout(function(){
		let email = $(this).val();
		if(email == "") return;
		$.post("/field-sign-up",
			{
				field: "email",
				value: email
			},
			function(data, status){
				if(!data.success){
					$("#err-email").text(data.status);
				}
				else {
					$("#err-email").text("");
				}
			}
		)
	});

	// Kiểm tra username
	$("#sign_up_username").focusout(function(){
		let username = $(this).val();
		if (username == "") return;
		$.post("/field-sign-up",
			{
				field: "username",
				value: username,
			},
			function(data, status){
				if(!data.success){
					$("#err-username").text(data.status);
				}
				else {
					$("#err-username").text("");
				}
			}
		)
	});
	// Yêu cầu gửi mail xác nhận
	$("#get-code").click(function(){
		let username = $("#forget_user").val();
		if (username == "") return;
		$.post("/send-email",
			{
				"username": username
			},
			function(data, status){
				if(data.success){
					$(".message_forget_password p").text("Chúng tôi đã gửi mã xác nhận đến email của bạn. Vui lòng kiểm tra email để điền mã xác nhận vào khung bên dưới.");
					$(".message_forget_password p").css("color", "#00b0ff");
				}
				else{
					$(".message_forget_password p").text("Tên đăng nhập không chính xác");
					$(".message_forget_password p").css("color", "red");
				} 
					
			}
		)
	});

	// logout
	$("#logout").click(function(){
		$.post("/logout",
			{
			},
			function(data, status){
				window.location.reload();
			}
		)
	});
	/***************** Xử lý cart **************/
	// set count Cart
	function setCountCart(){
		var cartCount = getProductFromCart().length;
		$(".cart .cart-count").text(cartCount);
	}
	setCountCart();
	// Thêm product
	$(".add-cart").click(function(){
		var id = $(this).data("id");
		if(addProductToCart(id, 1)){
			alert("Đã thêm sản phẩm vào giỏ hàng");
			setCountCart();
		}
		else alert("Thêm sản phẩm vào giỏ hàng thất bại");
	});
	if($(".product_detail").length > 0){
		$("input[name=quantity]").change(function(){
			alert(ok);
			//if(parseInt($(this).val()) < 1) $(this).val("1");
			//else (parseInt($(this).val()) > 999) $(this).val("999");
		})
		$("input.minus").click(function(){
			$("input[name=quantity]").val(parseInt($("input[name=quantity]").val()) - 1 + "");
		})
		$("input.plus").click(function(){
			$("input[name=quantity]").val(parseInt($("input[name=quantity]").val()) + 1 + "");
		})
		$("#buy-now").click(function(){
			var id = $(this).data("id");
			var quantity = parseInt($("input[name=quantity]").val());
			if (quantity < 1) alert("Nhập lại số lượng");
			else {
				addProductToCart(id, quantity);
				window.location = "/cart-info";
			}
		});
	}

	if ($(".cart-pay .list-cart").length > 0){
		var products = getProductFromCart();
		var totalPrice = 0;
		products.forEach((item,index, arr) => {
			$.ajax({
				url: "/product-in-cart",
				type: "get",
				data: { "productID": item.productID },
				async: false,
				success: function(data){
					var static = ($(".cart-pay .list-cart table").data("static") === true);
					if (data !== null){
						var price = (data.newPrice == undefined) ? data.price : data.newPrice;
						
						var output = "<tr class='product-info' id='" + data._id + "' data-price='" + price + "'>"
									+	'<td class="stt">' + index + '</td>'
									+	'<td class="img"><a href="/product/'+ data.slug +'"><img src="'+ data.imgPath +'"></a></td>'
									+	'<td class="info">'
										+	'<a href="/product/'+ data.slug +'">'+ data.name +'</a>';
						if (data.newPrice == undefined) output += '<span class="cost">Giá: '+ formatingPrice(data.price+"") +' đ</span>';
						else output += '<span class="old-cost">Giá: '+ formatingPrice(data.price+"") +' đ</span>'
										+	'<span class="cost">Giảm còn: '+ formatingPrice(data.newPrice+"") +' đ</span>';

						output += 		'</td>'
						output += (static) ? '<td class="count">' + item.count + '</td>' : '<td class="count"><input type="number" data-id="' + data._id + '" min="1" value="'+ item.count +'"></td>';
						output +=		'<td class="total-cost">'+ formatingPrice((item.count * price)+"") +' đ</td>';
						output += (static) ? "" : '<td class="delete" data-id="' + data._id + '"><i class="fa fa-close"></i></td>'
						output +=	'</tr>';
						$(".cart-pay .list-cart table tbody .total-price").before(output);
						// Set total Price
						totalPrice += item.count * price;
					}
				}
			})
			
		});
		// Hiển thị tổng giá tiền
		$(".cart-pay .list-cart table tbody .total-price .cost-sum").text(formatingPrice(totalPrice + "") + " đ");
		$(".cart-pay .list-cart table tbody .total-price .cost-sum").data("value", totalPrice);
		// Cài sự kiện remove
		$(".cart-pay .list-cart table tbody .delete i").click(function(){
			if(confirm("Bạn có chắc muốn xóa sản phẩm không?")){
				var id = $(this).parent().data("id");
				removeProductFromCart(id, -1);	// remove tất cả product có id là id
				$(("#" + id)).remove();
				var totalPrice = 0;	
				$(".cart-pay .list-cart table tbody .product-info").each(function(){
					totalPrice += parseInt($(this).find(".count input").val()) * parseInt($(this).data("price"));
				});
				
				$(".cart-pay .list-cart table tbody .total-price .cost-sum").text(formatingPrice(totalPrice + "") + " đ");
				
		setCountCart();
			}
		});
		$(".cart-pay .list-cart table tbody .count input").on("change click",function(){
			var count = parseInt($(this).val());
			var productID = $(this).data("id");
			setProductCount(productID, count);
			var selector = ".cart-pay .list-cart table tbody #" + productID;
			var price = parseInt($(selector).data("price"));
			selector = ".cart-pay .list-cart table tbody #" + productID +" .total-cost";
			$(selector).text(formatingPrice((price*count) + "") + " đ")

			var totalPrice = 0;	
			$(".cart-pay .list-cart table tbody .product-info").each(function(){
				totalPrice += parseInt($(this).find(".count input").val()) * parseInt($(this).data("price"));
			});
			
			$(".cart-pay .list-cart table tbody .total-price .cost-sum").text(formatingPrice(totalPrice + "") + " đ");
		});
		if (products.length == 0)
		$("#to-receiver-info").attr("href","");
	}

	if($("form[name=bill-info]").length > 0){
		$("input[name=cart_info]").val(JSON.stringify(getProductFromCart()));
	}
});
function formatingPrice(price){
	return price.replace(/./g, function(c, i, a) {
	    return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
	});
}
function setNoneValFormPayInfo(){
	var form = document.forms["bill-info"];
	form['name'].value = form['card-id'].value = form['cvv'].value 
		= form['email'].value = form['address'].value = form['city'].value = "";
}
function setDefaultFormPayInfo(){
	var form = document.forms["bill-info"];
	form['name'].value = form['card-id'].value = form['cvv'].value 
		= form['email'].value = form['address'].value = form['city'].value = "default";
}

function getPramJs(param) {
	var query = window.location.search.substring(1);
	var parms = query.split('&');
	for (var i=0; i<parms.length; i++) {
	var pos = parms [ i ].indexOf('=');
	if (pos > 0) {
	var key = parms [ i ].substring(0,pos).toLowerCase();
	var val = parms [ i ].substring(pos+1);
	if(key == param.toLowerCase())
	return val;
	}
	}
	return null;
}

function setBillingInfo(){
	$(".cart-pay .customer-info .name i").text(getPramJs("name"));
	$(".cart-pay .customer-info .phone i").text(getPramJs("phone"));
	$(".cart-pay .customer-info .date i").text(decodeURIComponent(getPramJs("date")));
	var tmp = getPramJs("base-add") + ", Quận " + getPramJs("district-add") + ", Tỉnh " + getPramJs("city-add");
	$(".cart-pay .customer-info .address i").text(tmp);
}

/********************** CART ******************/
function getProductFromCart(){
	var result = [];

	$.ajax({
		url: "/api/cart-info",
		type: "get",
		async: false,
		success: function(res, status){
			if(status == "success")
				result = res;
		}
	});
	return result;
}
function setProductCount(productID, count){
	var result = false;
	$.ajax({
		url: "/api/cart-info",
		type: "put",
		data: {
			"productID": productID,
			"count": count
		},
		async: false,
		success: function(res, status){
			result = status == "success";
		}
	});
	return result;
}
function addProductToCart(productID, count){
	var result = false;
	$.ajax({
		url: "/api/cart-info",
		type: "post",
		data: {
			"productID": productID,
			"count": count
		},
		async: false,
		success: function(res, status){
			result = status == "success";
		}
	});
	return result;
}
// count = -1 -> remove tất cả
function removeProductFromCart(productID, count){
	var result = false;
	$.ajax({
		url: "/api/cart-info",
		type: "delete",
		data: {
			"productID": productID,
			"count": count
		},
		async: false,
		success: function(res, status){
			result = status == "success";
		}
	});
	return result;
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

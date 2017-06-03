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
	if ($("#content .sidebar")){
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
    setBillingInfo();

    // Set Phương thức thanh toán
	$(".cart-pay .form-pay-info .pay-info").slideUp(0);
	$(".cart-pay input[name=pay-method]").change(function(){
		if($(".cart-pay input[name=pay-method]:checked").val() === "by-card"){
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
				value: username
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
});
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
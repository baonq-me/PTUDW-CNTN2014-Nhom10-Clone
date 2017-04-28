/*Kiểm tra tính đúng đắn của form đăng ký tài khoản*/
function validateFormSignUp(){
	var password1 = document.forms["sign_up_form"]["sign_up_password"].value;
	var password2 = document.forms["sign_up_form"]["sign_up_reenter_password"].value;

	if(password1 != password2){
		document.getElementById("sign_up_msg_reenter_pass").innerHTML = "Mật khẩu nhập lại không trùng khớp!!!"
		return false;
	}
};

$(document).ready(function(){
	$(window).scroll(function(){
		if($(window).scrollTop() > $(".top-menu").outerHeight())
			$("#primary-menu").addClass("sticky");
		else $("#primary-menu").removeClass("sticky");
	});
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




// Popup
    $(".popup .close-popup").click(function(){
    	$(this).parents(".popup").css("display", "none");
    });

    $(".show-popup-login").click(function(){
    	$(".popup-login").css("display", "block");
    });


    //Kiểm tra độ mạnh của password
    $('#sign_up_password').keyup(function()
	{
		$('#result_strength_pass').html(checkStrength($('#sign_up_password').val()))
	});
	
	
	function checkStrength(password)
	{
		//initial strength
		var strength = 0
		
		//if the password length is less than 8, return message.
		if (password.length < 8) { 
			$('#result_strength_pass').removeClass()
			$('#result_strength_pass').addClass('short')
			return 'Quá ngắn!' 
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
			return 'Yếu!'			
		}
		else if (strength == 2 )
		{
			$('#result_strength_pass').removeClass()
			$('#result_strength_pass').addClass('good')
			return 'Khá!'		
		}
		else
		{
			$('#result_strength_pass').removeClass()
			$('#result_strength_pass').addClass('strong')
			return 'Mạnh!'
		}
	}

});








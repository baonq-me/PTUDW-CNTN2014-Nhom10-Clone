

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

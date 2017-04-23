

$(document).ready(function(){
	$(window).scroll(function(){
		if($(window).scrollTop() > $(".top-menu").outerHeight())
			$("#primary-menu").addClass("sticky");
		else $("#primary-menu").removeClass("sticky");
	});
});
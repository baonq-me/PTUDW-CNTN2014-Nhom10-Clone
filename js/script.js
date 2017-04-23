

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
});


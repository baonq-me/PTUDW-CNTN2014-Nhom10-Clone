$(document).ready(function(){
	var full = true;
	$("#site-container .left-menu .toggle").click(function(){
		if(full){
			$("#site-container").removeClass("menu-small");
			$("#site-container").addClass("menu-full");
		}else{
			$("#site-container").removeClass("menu-full");
			$("#site-container").addClass("menu-small");
		}
		full = !full;
	});
	var path = window.location.pathname;
	path = (path == "/admin/") ? '/admin/dashboard' : path;
	var selector = "a[href|='" + path + "']";
	$(selector).parent().addClass("active");

	$(".left-menu a").each(function(){
		if(path.startsWith($(this).attr("href")))
			$(this).parent().addClass("active");
	})

})
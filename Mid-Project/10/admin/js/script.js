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
})
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

	/******** Admin index **************/
	function loadOutOfProducts() {
		function addRow(id, name) {
			var row = '<tr><td>' + id + '</td><td><b>' + name + '</b></td></tr>';
			$('#out-of-products').append(row);
		}

		$.ajax({
			url: '/admin/out-of-products', //URL lay du lieu
			type: 'GET',
			data: {},
			success: function(res) {
				for (i = 0; i < res.length; ++i) {
					addRow(res[i].id, res[i].name);
				}
			}
		});
	}

	loadOutOfProducts();

	function loadNewProducts() {
		function addRow(id, name, quality, dateAdded) {
			var row = '<tr><td> ' + id + ' </td><td> <b> ' + name + ' </b></td><td> <b>' + quality + ' </b></td><td> ' + dateAdded + ' </td></tr>'
			$('#new-products').append(row);
		}

		$.ajax({
			url: '/admin/new-products', //URL lay du lieu
			type: 'GET',
			data: {},
			success: function(res) {
				for (i = 0; i < res.length; ++i) {
					addRow(res[i].id, res[i].name, res[i].quality, res[i].dateAdded);
				}
			}
		});
	}

	loadNewProducts();

	function loadNewUsers() {
		function addRow(fullName, username, dateAdded) {
			alert(fullName);
			var row = '<tr><td> ' + fullName + ' </td><td> <b> ' + username + ' </b></td><td> ' + dateAdded + ' </td></tr>';
			$('#new-users').append(row);
		};

		$.ajax({
			url: '/admin/new-users', //URL lay du lieu
			type: 'GET',
			data: {},
			success: function(res) {
				for (i = 0; i < res.length; ++i) {
					addRow(res[i].baseInfo.fullName, res[i].loginInfo.localLogin.username, res[i].dateAdded);
					  
				}
			}
		});
	};

	loadNewUsers();

})
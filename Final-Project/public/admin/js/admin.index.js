$(document).ready(function(){


	/******** Admin index **************/
	function loadOutOfProducts() {
		function addRow(id, name) {
			var row = '<tr><td>' + id + '</td><td><b>' + name + '</b></td></tr>';
			$('#out-of-products').append(row);
		}

		$.ajax({
			url: '/admin/api/index/out-of-products', //URL lay du lieu
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
			url: '/admin/api/index/new-products', //URL lay du lieu
			type: 'GET',
			data: {},
			success: function(res) {
				for (i = 0; i < res.length; ++i) {
					addRow(res[i].id, res[i].name, res[i].quality, res[i].dateAdded.substring(0,10));
				}
			}
		});
	}

	loadNewProducts();

	function loadNewUsers() {
		function addRow(fullName, username, dateAdded, role) {
			//alert(fullName);
			var row = '<tr><td> ' + fullName + ' </td><td> <b> ' + username + ' </b></td><td> ' + dateAdded + ' </td><td> <b> ' + role + ' </b></td></tr>';
			$('#new-users').append(row);
		};

		$.ajax({
			url: '/admin/api/index/new-users', //URL lay du lieu
			type: 'GET',
			data: {},
			success: function(res) {
				console.log(res);
				for (i = 0; i < res.length; ++i) {
					if (res[i].loginInfo && res[i].loginInfo.typeLg == "social") 
						addRow(res[i].baseInfo.fullName, 'External auth (' + res[i].loginInfo.socialLoginId.typeS + ')', res[i].dateAdded.substring(0,10), res[i].role.name);
					else
						addRow(res[i].baseInfo.fullName, res[i].loginInfo.localLogin.username, res[i].dateAdded.substring(0,10), res[i].role.name);

				}
			}
		});
	};

	loadNewUsers();
})

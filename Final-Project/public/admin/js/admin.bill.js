$(document).ready(function(){

	/******** Admin Order **************/
	// 0: all
	// 1: delivered
	// 2: not delivered
	// 3: paid
	// 4: not paid
	// 5: completed
	// 6: canceled

	function loadBills(type) {
		function addRow(id, userID, name, phone, address, district, city, cartInfo, totalMoney, dateAdd, payMethod, status) {
			var row = '<tr><td><div class="checkbox"><label><input id="product-select-all-btn" type="checkbox" value=""></label></div></td> \
								<td> ' + id + '</td> \
								<td> ' + userID + '</td> \
								<td><div class="ho-ten"><b> '+ name + '</b></div> <div class="phone">'+ phone + ' </div></td>\
								<td class="delivery-address"><div class="address">'+ address + '</div>", "<div class="district"> '+ district + '</div> ", " <div class="city"> '+ city + '</div></td>\
								<td> ' + cartInfo + '</td> \
								<td> ' + totalMoney + '</td> \
								<td> ' + dateAdd + '</td> \
								<td> ' + payMethod + '</td> \
								<td> ' + status + '</td> ';
			$('#bills').append(row);
		}

		$.ajax({
			url: '/admin/api/bills', //URL lay du lieu
			type: 'GET',
			data: {
				type: type
			},
			success: function(res) {
				$('#bills').empty();
				console.log(res.length);
				for (i = 0; i < res.length; ++i) {
					addRow(res[i]._id, res[i].userID, res[i].receiverInfo.name, res[i].receiverInfo.phone,
						res[i].receiverInfo.address, res[i].receiverInfo.district, res[i].receiverInfo.city,
						res[i].cartInfo, res[i].totalMoney, res[i].dateAdd, res[i].billingInfo.pay_method, res[i].status );
				}
			}
		});
	}

	$('#bill-all').on('click', function(e) {
		e.preventDefault();
		loadBills(0);
	});

	$('#bill-delivered').on('click', function(e) {
		e.preventDefault();
		loadBills(1);
	});

	$('#bill-not-delivered').on('click', function(e) {
		e.preventDefault();
		loadBills(2);
	});

	$('#product-paid').on('click', function(e) {
		e.preventDefault();
		loadBills(3);
	});

	$('#product-not-paid').on('click', function(e) {
		e.preventDefault();
		loadBills(4);
	});

	$('#product-completed').on('click', function(e) {
		e.preventDefault();
		loadBills(5);
	});

	$('#product-canceled').on('click', function(e) {
		e.preventDefault();
		loadBills(6);
	});

	loadBills(0);
})

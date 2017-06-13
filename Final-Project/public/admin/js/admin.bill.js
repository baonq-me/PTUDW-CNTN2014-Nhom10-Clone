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
								<td> Người đặt: ' + userID + ' <br/> Đơn hàng: ' + id + '</td> \
								<td><div class="ho-ten"><b> '+ name + '</b></div> \
								<div class="phone"> 0'+ phone + ' </div></td> \
								<td class="delivery-address"><span class="address">'+ address + '</span>, \
								<span class="district"> '+ district + '</span>, \
								<span class="city"> '+ city + '</span></td>, \
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
				var status, pay_method;
				for (i = 0; i < res.length; ++i) {
						pay_method = res[i].billingInfo.pay_method;
						if(pay_method === "face-to-face"){
							pay_method = "Thanh toán khi giao hàng";
						}
						else if (pay_method === "by-card"){
							pay_method = "Thanh toán qua thẻ online";
						}
						else if (pay_method === "by-online"){
							pay_method = "Thanh toán qua ví điện tử";
						}

						status = res[i].status;
						if (status.delivered == 1 && status.paid == 1){
							status = "Đã hoàn tất";
						}
						else if (status.delivered == 0 && status.paid == 1){
							status = "Đã thanh toán, Chờ giao hàng";
						}
						else if (status.canceled == 1){
							status = "Đã hủy";
						}
						else if (status.delivered == 0 && status.paid == 0 && status.canceled == 0){
							status = "Đang chờ giao hàng và thanh toán";
						}
						
						addRow(res[i]._id, res[i].userID, res[i].receiverInfo.name, res[i].receiverInfo.phone,
							res[i].receiverInfo.address, res[i].receiverInfo.district, res[i].receiverInfo.city,
							res[i].cartInfo[0].productName + ' (count: ' + res[i].cartInfo[0].count + ')', res[i].totalMoney, res[i].dateAdded.substring(0, 10), pay_method, status);
				}
			}
		});
	}

	var bills = ['#bill-all', '#bill-delivered', '#bill-not-delivered',
							'#product-paid', '#product-not-paid', '#product-completed', '#product-canceled'];
	for (i = 0; i < 6; i++)
	{
		$(bills[i]).on('click', function(e) {
			e.preventDefault();
			loadBills(i);
		});
	}

	loadBills(0);
})

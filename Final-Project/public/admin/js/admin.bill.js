$(document).ready(function(){

	/******** Admin Order **************/
	// 0: all
	// 1: delivered
	// 2: not delivered
	// 3: paid
	// 4: not paid
	// 5: completed
	// 6: canceled
	var count = 3;
	var skip = 0;
	function loadBills(isEmpty) {
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
		$(".order-table").css("opacity", "0.5");
		var type = bills["#" + $(".bills-filter a.active").attr("id")];
		if(isEmpty) skip = 0;
		$.ajax({
			url: '/admin/api/bills', //URL lay du lieu
			type: 'GET',
			data: {
				type: type,
				count: count,
				skip: skip
			},
			success: function(res) {
				if(isEmpty)
					$('#bills').empty();
				skip+= res.length;
				if(res.length < count)
					$("#viewmore").parent().css("display", "none");
				else
					$("#viewmore").parent().css("display", "block");
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
						var totalMoney = 0;
						var products = "";
						res[i].cartInfo.forEach(function(p){
							totalMoney += parseInt(p.count) * parseInt(p.unitPrice);
							products += "<p>" + p.productName + "(" + p.count + ")" + "</p>";
						})
						addRow(res[i]._id, res[i].userID, res[i].receiverInfo.name, res[i].receiverInfo.phone,
							res[i].receiverInfo.address, res[i].receiverInfo.district, res[i].receiverInfo.city,
							products , totalMoney, res[i].dateAdded.substring(0, 10), pay_method, status);
				}
				$(".order-table").css("opacity", "1");
			}
		});
	}

	var bills = {'#bill-all': 0, '#bill-delivered': 1, '#bill-not-delivered': 2, '#bill-paid': 3, '#bill-not-paid': 4, '#bill-completed': 5, '#bill-canceled': 6};
	for (var key in bills){
		$(key).click(function(e){
			$(".bills-filter a").removeClass("active");
			$(this).addClass("active");
			e.preventDefault();
			loadBills(true);
		})
	}
	$("#viewmore").click(function(){
		loadBills(false);
	})

	loadBills(true);
})

$(document).ready(function(){
	var stt = 0;
	function addProduct(bill){
		paid = (bill.status.paid == 1) ? "fa fa-check-square-o" : "fa fa-square-o";
		delivered = (bill.status.delivered == 1) ? "fa fa-check-square-o" : "fa fa-square-o";
		var listProduct = "";
		var totalCost = 0;
		bill.cartInfo.forEach(function(p){
			listProduct += "<p>" + p.productName + "</p>";
			totalCost += parseInt(p.count) * p.unitPrice;
		})
		var out = '\
		<tr class="product-info" > \
			<td class="stt">' + stt + '</td> \
			<td class="info">' + bill._id + '</td> \
			<td>' + bill.dateAdded.substring(0,10) + '</td> \
			<td>' + listProduct + '</td> \
			<td class="total-cost">' + formatingPrice(totalCost + "") + '</td> \
			<td style="text-align: center;"> \
				<i class="' + paid + '" aria-hidden="true"></i> \
			</td> \
			<td style="text-align: center;"> \
				<i class="' + delivered + '" aria-hidden="true"></i> \
			</td> \
		</tr>';
		$(".bill-history tbody").append(out);
		stt++;
	}
	function loadBill(skip, count){
		$(".bill-history").css("opacity", "0.5");
		$.ajax({
			url: "/profile/bill",
			type: "get",
			data: {
				count: count,
				skip: skip
			},
			success: function(data, status){
				data.forEach(function(bill){
					addProduct(bill)
				});
				if(data.length < count)
					$("#viewmore").css("display", "none");
				else $("#viewmore").css("display", "inline-block");
				$(".bill-history").css("opacity", "1");
			}
		})
	}
	loadBill(0,4);
	$("#viewmore").click(function(){
		loadBill(stt,4);
		return false;
	})
})
$(document).ready(function(){
	function addProduct(stt, name, imageUrl, linkProduct, quality, uniPrice, paid, delivered){
		paid = (paid) ? "fa fa-check-square-o" : "fa fa-square-o";
		delivered = (delivered) ? "fa fa-check-square-o" : "fa fa-square-o";
		var out = '\
		<tr class="product-info" > \
			<td class="stt">' + stt + '</td> \
			<td class="img"><a href="' + linkProduct + '"><img src="' + imageUrl + '"></a></td> \
			<td class="info"><a href="' + linkProduct + '">' + name + '</a></td> \
			<td class="count">' + quality + '</td> \
			<td class="total-cost uni-price">' + uniPrice + '</td> \
			<td style="text-align: center;"> \
				<i class="' + paid + '" aria-hidden="true"></i> \
			</td> \
			<td style="text-align: center;"> \
				<i class="' + delivered + '" aria-hidden="true"></i> \
			</td> \
		</tr>'
	}
	function loadBill(skip, count){
		
	}
})
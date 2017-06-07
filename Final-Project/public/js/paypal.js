$(document).ready(function(){

    $.ajax({
        method: "GET",
        url: "/paypal_client_token",
        success: function( token ) {
            paypalCreate(token);
           //console.log($(".paypal-button-container iframe").contents().find("#paypal-button"))
        },
        error: function(xhr, status, errorThrown) {
            var err = eval("(" + xhr.responseText + ")");
            console.error(err.Message);
        }
    });
});

function paypalCreate(token) {
    var amount = $(".cart-pay .list-cart table tbody .total-price .cost-sum").data("value");
    // Create Paypal client
    braintree.client.create({
        authorization: token
    }, function (clientErr, clientInstance) {

      // Stop if there was a problem creating the client.
      // This could happen if there is a network error or if the authorization
      // is invalid.
      if (clientErr) {
          console.error('Error creating client:', clientErr);
          return;
      } 

      // Create a PayPal Checkout component.
      braintree.paypalCheckout.create({
          client: clientInstance
      }, function (paypalCheckoutErr, paypalCheckoutInstance) {
          // Stop if there was a problem creating PayPal Checkout.
          // This could happen if there was a network error or if it's incorrectly
          // configured.
          if (paypalCheckoutErr) {
              console.error('Error creating PayPal Checkout:', paypalCheckoutErr);
              return;
          }
         
          // Set up PayPal with the checkout.js library
          paypal.Button.render({
              env: 'sandbox', // or 'production'
              commit: true,
              payment: function () {
                  return paypalCheckoutInstance.createPayment({
                      flow: 'checkout', // Required
                      "amount": Math.floor(amount/22694.87*100)/100,//amount/22694.87, // Value of Payment, must be float
                      currency: 'USD', // Required
                      locale: 'en_US',	// Position
                      enableShippingAddress: false
                  });
              },

              onAuthorize: function (data, actions) {
                  return paypalCheckoutInstance.tokenizePayment(data)
                                               .then(function (payload) {
                                                  var cartInfo = getProductFromCart();
                                                   $.ajax({
                                                       method: "POST",
                                                       url: "/paypal_checkout",
                                                       data: {
                                                           nonce: payload.nonce,
                                                           "cartInfo": cartInfo,
                                                           "amount": Math.floor(amount/22694.87*100)/100//amount/22694.87 // Amount of money
                                                       },
                                                       success: function( data ) {
                                                           window.location = "/pay/done";
                                                       },
                                                       error: function(xhr, status, errorThrown) {alert("fail");
                                                           var err = eval("(" + xhr.responseText + ")");
                                                           console.error(err.Message);
                                                           window.alert("Đã có lỗi xảy ra, vui lòng thử lại");
                                                       }
                                                   });
                                               });
              },

              onCancel: function (data) {
                  console.log('checkout.js payment cancelled', JSON.stringify(data, 0, 2));
              },

              onError: function (err) {
                  console.error('checkout.js error', err);
              }
          }, '#paypal').then(function () { // id, class of HTML tag to render, 
              // The PayPal button will be rendered in an html element with the id
              // `paypal-button`. This function will be called when the PayPal button
              // is set up and ready to be used.
          });
      });
    });
}

function notify(type, message)
{
  $.notify(message,
  {
    autoHide: true,
    autoHideDelay: 4000,
    style: 'bootstrap',
    className: type,
    showDuration: 400,
  });
}

function addUser(username, fullname, email, role)
{
  $('.account-table tbody:last-child').append('<tr>\
  <td><div class="checkbox"><label><input id="product-select-all-btn" type="checkbox" value=""></label></div></td> \
  <td><img src="images/account/user.png" class="img-thumbnail"><a class="account-customer" href="#"> ' + username + '</a> \
  <td>' + fullname + '</td> \
  <td><a href="mailto:' + email + '">' + email + '</a></td>\
  <td><a class="account-customer" href="#">' + role + '</a></td> \
  <td>Now</td>\
  </tr>');
}

$(".account-table").ready(function() {
    $.ajax({
			url: '/admin/api/account/get/all',
			type: 'GET',
			data: {},
			success: function(res) {
				for (i = 0; i < res.length; ++i)
          if (res[i].loginInfo.typeLg == "local")
            addUser(res[i].loginInfo.localLogin.username, res[i].baseInfo.fullName, res[i].baseInfo.email, res[i].role.name);
          else if (res[i].loginInfo.typeLg = "social")
            addUser(res[i].loginInfo.socialLoginId.typeS + ':' + res[i].loginInfo.socialLoginId.idS, res[i].baseInfo.fullName, res[i].baseInfo.email, res[i].role.name);
      }
    });
});

$('#form-add-account').submit(function (evt) {
    evt.preventDefault();

    var username = $("#username").val();
    var fullname = $("#fullname").val();
    var email = $("#email").val();
    var phone = $("#phone").val();
    var role = $("#role").val();
    var password1 = $("#password1").val();
    var password2 = $("#password2").val();

    if (password1 != password2)
    {
      notify("error", "Password is not matched");
    } else if (password1.length < 7)
    {
      notify("error", "Password need at least 7 characters !");
    } else {
      $.ajax({
  			url: '/admin/api/account/add',
  			type: 'POST',
  			data: {
          username: username,
          fullname: fullname,
          email: email,
          phone: phone,
          role: role,
          password: password1
        },
        statusCode: {
            200: function() {
              notify("success", "Account added !");
              document.getElementById('form-add-account-close').click();
              addUser(username, fullname, email, role);
            },
            400: function() {
              notify("error", "Can't add this account !");
            }
          }
  		});
    }
});

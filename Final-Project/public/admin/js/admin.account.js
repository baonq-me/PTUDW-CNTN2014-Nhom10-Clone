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

function addUser(username, fullname, email, role, date, avatar)
{
  $('.account-table tbody:last-child').append('<tr>\
  <td><div class="checkbox"><label><input id="check-' + username + '" type="checkbox"></label></div></td> \
  <td><img src="' + avatar + '" class="img-thumbnail"><a class="account-' + role + '" href="#"> ' + username + '</a> \
  <td>' + fullname + '</td> \
  <td><a href="mailto:' + email + '">' + email + '</a></td>\
  <td><a class="account-' + role + '" href="#">' + role + '</a></td> \
  <td>' + date + '</td>\
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
            addUser(
              res[i].loginInfo.localLogin.username,
              res[i].baseInfo.fullName,
              res[i].baseInfo.email,
              res[i].role.name,
              res[i].dateAdded,
              //'images/account/' + res[i].loginInfo.localLogin.username + '.jpg');
              'images/account/user.jpg');
          else if (res[i].loginInfo.typeLg = "social")
            addUser(
              res[i].loginInfo.socialLoginId.typeS + ':' + res[i].loginInfo.socialLoginId.idS,
              res[i].baseInfo.fullName,
              res[i].baseInfo.email,
              res[i].role.name,
              res[i].dateAdded,
              'https://graph.facebook.com/' + res[i].loginInfo.socialLoginId.idS + '/picture?type=normal');
      }
    });
});

$('#form-add-account').submit(function(e) {
    e.preventDefault();

    var username = $("#username").val();
    var fullname = $("#fullname").val();
    var email = $("#email").val();
    var phone = $("#phone").val();
    var role = $("#role").val();
    var address = $("#address").val();
    var password1 = $("#password1").val();
    var password2 = $("#password2").val();
    //var avatar = $("#avatar").val();

    if (username.length == 0)
    {
      notify("error", "Username is empty");
    } else if (email.length == 0)
    {
      notify("error", "Email is empty");
    } else if (password1 != password2)
    {
      notify("error", "Password is not matched");
    } else if (password1.length < 7)
    {
      notify("error", "Password need at least 7 characters !");
    } else {
      $.ajax({
  			url: '/admin/api/account/add',
  			type: 'POST',
        contentType: 'multipart/form-data',
  			data: {
          username: username,
          fullname: fullname,
          email: email,
          phone: phone,
          role: role,
          password: password1,
          address: address
          //avatar: avatar
        },
        statusCode: {
            200: function() {
              notify("success", "Account added !");
              document.getElementById('form-add-account-close').click();
              addUser(username, fullname, email, role, "Now");
            },
            400: function() {
              notify("error", "Can't add this account !");
            }
          }
  		});
    }
});

$("<link/>", {
   rel: "stylesheet",
   type: "text/css",
   href: "/admin/css/admin.account.css"
}).appendTo("head");

$("#avatar").fileinput({
    overwriteInitial: true,
    //maxFileSize: 1500,
    showClose: false,
    showCaption: false,
    showBrowse: false,
    browseOnZoneClick: true,
    removeLabel: '',
    removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
    removeTitle: 'Dùng ảnh mặc định',
    //elErrorContainer: '#kv-avatar-errors-2',
    //msgErrorClass: 'alert alert-block alert-danger',
    defaultPreviewContent: '<img src="/admin/images/account/user.jpg" alt="Ảnh đại diện của bạn" style="width:160px"><h6 class="text-muted">Bấm để chọn</h6>',
    layoutTemplates: {main2: '{preview} {remove}'}
    //allowedFileExtensions: ["jpg", "png", "gif"]
});

$('#checkAll').click(function () {
     $('input:checkbox').prop('checked', this.checked);
 });

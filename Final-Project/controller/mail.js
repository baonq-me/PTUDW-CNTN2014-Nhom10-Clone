/*
*	Gửi mail
*	@param object
*		mailTo: list of receivers
*		subject: Subject line
*		text: plain text body
*		html: html body
*/
module.exports = function(mailInfo) {
	console.log("Mail Info: " + mailInfo);
	if( mailInfo.mailTo == null){
		return false;
	}
	const nodemailer = require('nodemailer');
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'nhom10.ptudw@gmail.com',
			pass: '12345678@ptudw'
		}
	});

	// setup email data with unicode symbols
	let mailOptions = {
		from: '"Nhóm 10" <nhom10.ptudw@gmail.com>', // sender address
		to: mailInfo.mailTo, // list of receivers
		subject: mailInfo.subject, // Subject line
		text: mailInfo.text, // plain text body
		html: mailInfo.html // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
			return false;
		}
		console.log('Message %s sent: %s', info.messageId, info.response);
	});
	
	if( mailInfo.mailTo != null)
		return true;
}
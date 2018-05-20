var express = require('express')

var router = express.Router()

router.use('/searchUser', function(req, res) {
    res.json({
        data: {
            userName: '123',
            pwd: '111'
        }
    })
})

router.use('/checkUserExistence', function (req, res) {
    res.json({
        code: 0
    })
    
})

// 产生四位随机数，字母与数字的混合
function generate_code() 
{
	var ecode = ""
	var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	var min = 0, max = arr.length;

	for(var i=0;i<4;i++)
	{
		var range = Math.floor(Math.random() * (max-min)) + min;
		ecode = ecode + arr[range];
	}
	return ecode;
}

// 将验证码发送到用户邮箱
router.use('/sendMailCode', function(req, res){
	console.log('进入 sendMailCode 路由，添加一个参数作为验证码');
	var nodemailer = require('nodemailer');
	var email_address = req.body.mail;		// 邮箱地址
	var sendcode = generate_code();		// 随机验证码
	var email_wrong = 1;		// 0表示成功，1表示失败

	// 邮箱为空
    if (!email_address) {
    	console.log("邮箱地址为空");
        //return res.render("index", {message: "请输入邮箱地址！"});
    }
    //检测邮箱地址是否符合规范
    var reg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/;
    if (!email_address.match(reg)) {
    	console.log("邮箱地址不符合规范");
        //return res.render("index", {message: "邮箱地址不符合规范，请重新输入！"});
    }

    //邮件发送
    var transporter = nodemailer.createTransport({
        service: 'qq',
        auth: {
            user: '715811763@qq.com',	//邮箱账号
            pass: 'hkeakrloadcobcha'	//邮箱smtp口令
        }
    });
    var mailOptions = {
        from: 'FileSharer平台 <715811763@qq.com>', // sender address
        to:email_address, // list of receivers
        subject: '注册验证码', // Subject line
        text: sendcode // plaintext body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(!error){
        	email_wrong = 0;
        	console.log("邮件发送成功，请注意查收!");
            //return res.render("index", {message: "邮件发送成功，请注意查收！"});
        }
        else{
            console.log(error);
            console.log("邮件发送失败，请稍后重试!");
            //return res.render("index", {message: "邮件发送失败，请稍后重试！"});
        }
    });
	
    res.json({
        codeSent: sendcode,
        code: email_wrong
    })

})
module.exports = router

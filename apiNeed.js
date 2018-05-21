// name: /checkUserExistence
// 检查用户名是否存在
send: {
    username: '...'		// 形式为字符串，比如  '715811763@pku.edu.cn'
}
receive: {
    code: 0 // 1 for exist, 0 for not
}

// name : /sendMailCode
// 给邮箱发送验证码，4位字母与数字随机混合
send: {
    mail: '...'
}
receive: {
    codeSent: '...', //the identification code sent to the mail  
    code: 0 or 1		// 0:success  1:wrong
}
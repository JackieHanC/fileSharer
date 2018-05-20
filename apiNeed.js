// the ';' in this file should not be used in json


// name: /checkUserExistence
// 检查用户名是否存在
send: {
    username: '...'
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
    code: 0 ;// 0 for success 1 for error
    codeSent: '...' //the identification code sent to the mail  
}

// name: /signUp
// 注册函数

send: {
    username: '...';
    pwd: '...' // MD5 of pwd , length: 32
}

receive: {
    code: 0; // 0 for success, 1 for error
    userID: xx // ID for this user, for cookie
    // can add new data if needed
}
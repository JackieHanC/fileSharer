// the ';' in this file should not be used in json


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

// name: /getDataList
// 获取帖子信息
// 获得从id n开始的20个帖子，不足20就有多少传多少
send: {
    idBegin: n;
}

receive: {
    dataList: [
        {
            id: x, 
            titile: ''
        },
        //...
    ]
}

// name : /getPostByID
// 获取帖子详细信息

send: {
    ID: n
}

receive: {
    code: 0,// 0 for success, 1 for error
    post: {
        // everything about the post in the database
    }
}

// name: /newPost
// 上传新帖子

send: {
    username: '',
    title: '',
    content: ''
}

receive: {
    code: 0,// 0 for success, 1 for error
    newPostID: n // ID for the newly uploaded Post
}

// name: /uploadComment
send: {
    username: '',
    content: ''
}

receive: {
    code: 0 // 0 for success 1 for error
    id: n // comment id in this post
}
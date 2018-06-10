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
    postid: '',
    username: '',
    content: ''
}

receive: {
    code: 0 // 0 for success 1 for error
    id: n // comment id in this post
}

// name: /getFileList
send: {
    idBegin: 0
}

receive: {
    fileList: {
        id: n,
        titile: '',
        code: 0
    }
}

// name: /getMajor      
// 为下拉框提供专业信息
send: {
}

receive: {
    majorlist: [],       // 一个数组
    code: 0     // 0代表success
}

// name: /getCourse    
// 提供专业信息，实时返回搜索到的课程名
send: {
    major: ''
}

receive: {
    courselist: [],      // 一个数组
    code: 0
}


// name: /getFileListByKeys

send: {
    major: '',
    course: ''
}
receive: {
    fileList: [],
    code: 0
}


//name: /uploadFile
send: {
    file: ''// 二进制文件
}

receive: {
    code: 0
    id: 0
}

//name: updateFileInfo
send: {
    id: 0,
    title: '',
    major: '',
    course: ''
}

receive: {
    code: 0
    id: 0
}

//name: getUrlByID
send: {
    id: 0
}

receive: {
    code: 0,
    url: ''
}

//name: updateLikes
send: {
    id: 0
}

receive: {
    code: 0
}

// // name: /getFileByID
// send: {
//     fileid: '',
// }

// receive: {
//     code: 0 // 0 for success 1 for error
//     title: '',
//     major: '',
//     course: '',
//     intr: '',
//     path: ''
// }

// // name: /searchFile
// send: {
//     major: '',
//     course: ''
// }

// receive: {
//     code: 0 // 0 for success 1 for error
//     fileDataList: [
//     {
//         id: x, 
//         title: '',
//         intr: '',
//         path: ''
//     },
//     //...
//     ]
// }

var express = require('express')
var multiparty = require('multiparty')
var fs = require("fs");

var router = express.Router()


/*
产生四位随机数，字母与数字的混合
*/
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



/*
检查用户名是否存在
*/
router.use('/checkUserExistence', function(req,res){
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/filesharer";
	var is_exist = 0;

	
	//var user = '' + req.body.username;		// 用户账号
	var myquery = {"name": req.body.username};


	//console.log('\n\n\n' + myquery['name']);
	//console.log(typeof(myquery['name'] + '\n\n\n\n\n'));
	console.log("********************************* checkUserExistence *********************************");

	// 连接数据库
	MongoClient.connect(url, function (err, db) {
	    if (err) throw err;
	    console.log('数据库已连接');
	    var dbo = db.db("filesharer");

	    // 查询数据
	    dbo.collection("account").find(myquery).toArray(function(err, result) { // 返回集合中所有数据
	        if (err) 
	        	throw err;
	        // 展示查询结果
	        console.log("query result：" + result.length);
	        if(result.length == 0)
	        	is_exist = 0;
	        else
	        	is_exist = 1;
	        res.json({
        		code: is_exist
    		})	
	        db.close();
	    });
	});

})

/*
将验证码发送到用户邮箱
*/
router.use('/sendMailCode', function(req, res){
	console.log('进入 sendMailCode 路由，添加一个参数作为验证码');
	var nodemailer = require('nodemailer');
	var email_address = req.body.mail;		// 邮箱地址
	var sendcode = generate_code();		// 随机验证码
	var email_wrong = 1;		// 0表示成功，1表示失败

	console.log("********************************* sendMailCode *********************************");

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
        host:'715811763@qq.com',
        auth: {
            user: '715811763@qq.com',	//邮箱账号
            pass: 'zisqyplnoxflbfah'	//邮箱smtp口令
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


/*
检查用户情况，是否存在，密码是否正确 
向前端返回code：0表示用户不存在,1表示密码不正确，-1表示正常
*/
router.use('/searchUser', function(req, res) {

    console.log("检查用户情况，是否存在，密码是否正确");
    var search_result = -1;

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/filesharer";

    var user = '' + req.body.username;		// 用户账号
    var pwd = '' + req.body.password;       // 用户密码
    var myquery = {"name": user};           

    console.log("********************************* searchUser *********************************");
        
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('数据库已连接');
        var dbo = db.db("filesharer");
        // 查询数据
        dbo.collection("account").find(myquery).toArray(function(err, result) { // 返回集合中所有数据
            if (err) throw err;
            if(result.length == 0){                 //用户不存在
                console.log("该用户不存在");
                search_result = 0;
            }
            else if(result[0]["password"]!=pwd){    //密码不正确
                console.log("密码不正确");
                search_result = 1;
            }
		    res.json({
		        code:search_result
		    })
            db.close();
        });
    
    });


})

/*
注册函数
*/
router.use('/signUp', function (req, res) {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/filesharer";

	var return_value;		// 0 for success, else 1
	var username = req.body.username;		// user name
	var pwd = req.body.pwd;		// password

	var myquery = {"name": username};
	var myid = Number(0);
	var insertobj={};		// 要插入的表项

	console.log("********************************* signUp *********************************");

	// 连接数据库
	MongoClient.connect(url, function (err, db) {
	    if (err) throw err;
	    console.log('数据库已连接');
	    var dbo = db.db("filesharer");
	    
	    res.json({
	        userID: 0,
	        code: 0
    	})

	    // 查询数据
	    dbo.collection("account").find(myquery).toArray(function(err, result) { // 返回集合中所有数据
	        if (err) throw err;
	        // 展示查询结果
	        if(result.length == 0){
	        	return_value = 0;

			    dbo.collection("account"). find({}).sort({"userid" : -1}).limit(1).toArray(function(err, res) { // 返回集合中所有数据
			        if (err) throw err;
			        myid = res[0]['userid']+1;
			        insertobj = {"name": username, "password":pwd, "userid":Number(myid)};

			        res['userID'] = myid;

			    	dbo.collection("account").insertOne(insertobj, function(err, ress) {
				        if (err) throw err;
				        console.log("insertobj");
				        console.log("人员信息插入成功");
				        db.close();				// !!!!!!!!!!!!这个写在外面就一直 "MongoError: server instance pool was destroyed"
				    });
				});

		    }
	        else{
	        	return_value = 1;
	        	console.log("用户名已注册");
	        }

	        res['code'] = return_value;

	    });
	});

})

/*
获取帖子列表
*/
router.use('/getDataList', function (req, res) {

	console.log('准备读取帖子信息');
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/filesharer";
	var idBegin = req.body.idBegin;

	var data=[];

	console.log("********************************* getDataList *********************************");

	MongoClient.connect(url,  {useNewUrlParser: true}, function (err, db) {
	    if (err) throw err;
	    console.log('数据库已连接');
	    var dbo = db.db("filesharer");
		dbo.collection("bbs").find({}, {limit: 20, skip:idBegin}).toArray(function(err, ress) {
			if (err) throw err;
			for(var i=0;i<ress.length;++i){
				var obj={"id":ress[i]["bbs_id"],"title":ress[i]["title"]};
				data.push(obj);
			}

			for(var item in data){					//这里后端测试显示读出来的数据是对的，但是前端怎么显示不知道
				console.log( data[item]["id"])
				console.log( data[item]["title"])
			 }
			console.log(data);
			console.log('帖子信息读取完毕');

			res.json({
				dataList:data
			})

			db.close();
		});
	});


})


/*
上传新帖子
*/
router.use('/newPost', function (req, res) {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/filesharer";

	var return_value;		// 0 for success, else 1
	var username = "" + req.body.username;		// user name
	var title = req.body.title;
	var content = req.body.content;

	console.log("********************************* newPost *********************************");

	// 获取当前日期
	var nowdate = new Date();
	var now_year = nowdate.getFullYear();
	var now_month = nowdate.getMonth()+1;
	var now_day = nowdate.getDate();
	var datestring = '' + now_year + '-' + now_month + '-' + now_day;

	var myid = Number(0);
	var insertobj={};		// 要插入的表项

	// 连接数据库
	MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
	    if (err) throw err;
	    console.log('数据库已连接');
	    var dbo = db.db("filesharer");
	    

	    dbo.collection("bbs"). find({}).sort({"bbs_id" : -1}).limit(1).toArray(function(err, ress) { // 返回集合中所有数据
	        if (err) throw err;
	        myid = ress[0]['bbs_id']+1;
	        insertobj = {"name": username, "bbs_id":Number(myid), "like":0, "date": datestring, "title":title, "content":content, "comment":[]};

			res.json({
				newPostID: myid,
				code: 0
			})
	        // res['newPostID'] = myid;

	    	dbo.collection("bbs").insertOne(insertobj, function(err, resss) {
		        if (err) throw err;
		        console.log("insertobj");
		        console.log("新BBS插入成功");
		        db.close();				// !!!!!!!!!!!!这个写在外面就一直 "MongoError: server instance pool was destroyed"
		    });
		});
	});

})

/*
根据ID号获得帖子的具体信息
*/
router.use('/getPostByID', function (req, res) {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/filesharer";

	var return_value;		// 0 for success, else 1
	var postid = Number(req.body.ID);

	console.log("********************************* getPostByID *********************************");
	console.log("GET a postID : " + postid);



	var insertobj={};		// 要插入的表项

	// 连接数据库
	MongoClient.connect(url, function (err, db) {
	    if (err) throw err;
	    console.log('数据库已连接');
	    var dbo = db.db("filesharer");


		dbo.collection("bbs").find({bbs_id:postid}).toArray(function(err, ress) {
			if (err) throw err;
			var returnobj = {}
			var retcode = 1;

			if(ress.length == 0){
				retcode = 1;
			}
			else{
				returnobj = {"bbs_id":postid, "username":ress[0]['username'], "like":ress[0]['like'], "date":ress[0]['date'], "title":ress[0]['title'], "content":ress[0]['content'], "comments":ress[0]['comment']};
				console.log('帖子信息加载完毕');

				retcode = 0;
			}

			res.json({
		    	code: retcode,// 0 for success, 1 for error
			    post: returnobj
			})
		});		
		db.close();

	});

})

/*
添加新评论
先根据postid找到对应的帖子，然后修改comment字段
*/
router.use('/uploadComment', function (req, res) {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/filesharer";

	var return_value;		// 0 for success, else 1
	var retid = -1;			// 返回值（评论id）
	var postid = Number(req.body.postid);
	var username = req.body.username;
	var content = req.body.content;

	console.log("********************************* uploadComment *********************************");
	console.log("GET a postID : " + postid);

	// 连接数据库
	MongoClient.connect(url, function (err, db) {
	    if (err) throw err;
	    console.log('数据库已连接');
	    var dbo = db.db("filesharer");

	    // 根据postid找到相关的帖子
		dbo.collection("bbs").find({bbs_id:postid}).toArray(function(err, ress) {
			if (err) throw err;
			var returnobj = {}
			var retcode = 1;

			if(ress.length == 0){		// 找不到对应的帖子
				retcode = 1;
			}
			else{
				console.log('已找到对应帖子');			

				// 获取评论的具体内容、评论数量
				var comment = ress[0]['comment'];
				var tot_comment = Number(comment.length);
				retid = tot_comment;
				// 插入一条新评论
				var insertone = {'id': tot_comment, 'user': username, 'content': content};
				comment.push(insertone);
				var updateStr = {$set: { "comment" : comment }};
			    dbo.collection("bbs").updateOne({"bbs_id": postid}, updateStr, function(err, res) {
			        if (err) throw err;
			        console.log("comment信息更新成功");
			        db.close();
			    });

				retcode = 0;
			}

			res.json({
		    	code: retcode,// 0 for success, 1 for error
			    id: retid
			})
		});		

	});

})

/*
返回数据库中现有的专业列表
*/
router.use('/getMajor', function (req, res) {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/filesharer";

	var return_value;		// 0 for success, else 1

	console.log("********************************* getMajor *********************************");

	var insertobj={};		// 要插入的表项

	// 连接数据库
	MongoClient.connect(url, function (err, db) {
	    if (err) throw err;
	    console.log('数据库已连接');
	    var dbo = db.db("filesharer");


		dbo.collection("majorcourse").find().toArray(function(err, ress) {
	        if (err) throw err;
	        var returnobj = {}
	        var retcode = 1;
	        var retarr = [];

	        if(ress.length == 0){
	            retcode = 1;
	        }
	        else{
	            retcode = 0;
	            for(var i=0;i<ress.length;i++){
	                var flag = 0;
	                // 查找是否有重复项
	                for(var j=0;j<retarr.length;j++){
	                    if(ress[i]['major'] == retarr[j]){
	                        flag = 1;
	                        break;
	                    }
	                }
	                if(flag == 0){
	                    retarr.push(ress[i]['major']);
	                }
	            }
	            console.log("已查到专业列表：");
	            console.log(retarr);
	        }

			res.json({
		    	code: retcode,// 0 for success, 1 for error
			    majorlist: retarr
			})
			db.close();
		});		
		

	});

})


/*
按起始序号获取文件列表
*/
router.use('/getFileList', function (req, res) {

	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/filesharer";
	var idBegin = req.body.idBegin;

	var data=[];

	console.log("********************************* getFileList *********************************");

	MongoClient.connect(url,  {useNewUrlParser: true}, function (err, db) {
	    if (err) throw err;
	    console.log('数据库已连接');
	    var dbo = db.db("filesharer");
	    dbo.collection("studydata").find({}, {limit: 30, skip:idBegin}).toArray(function(err, ress) {
	        if (err) throw err;
	        for(var i=0;i<ress.length;++i){
	            var obj={"id":ress[i]["file_id"],"title":ress[i]["intro"], code: 0};
	            data.push(obj);
	        }

	        console.log(data);
	        console.log('文件信息读取完毕');

	        res.json({
	        	fileList: data
	        })


	        db.close();
	    });
	});


})

/*
返回数据库中现有的某专业的课程列表
*/
router.use('/getCourse', function (req, res) {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/filesharer";

	var return_value;		// 0 for success, else 1
	var major = req.body.major

	console.log("********************************* getCourse *********************************");

	// 连接数据库
	MongoClient.connect(url, function (err, db) {
	    if (err) throw err;
	    console.log('数据库已连接');
	    var dbo = db.db("filesharer");


		dbo.collection("majorcourse").find({"major": major}).toArray(function(err, ress) {
	        if (err) throw err;
	        var retcode = 1;
	        var retarr = [];

	        if(ress.length == 0){
	            retcode = 1;
	        }
	        else{
	            retcode = 0;
	            for(var i=0;i<ress.length;i++){
	                    retarr.push(ress[i]['course']);
	            }
	            console.log("已查到课程列表：");
	            console.log(retarr);
	        }

			res.json({
		    	code: retcode,// 0 for success, 1 for error
			    courselist: retarr
			})
			db.close();
		});		
		

	});

})

/*
寻找某个课程的课程文件
*/
router.use('/getFileListByKeys', function (req, res) {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/filesharer";

	var return_value;		// 0 for success, else 1
	var major = req.body.major
	var course = req.body.course

	console.log("********************************* getFileListByKeys *********************************");

	// 连接数据库
	MongoClient.connect(url, function (err, db) {
	    if (err) throw err;
	    console.log('数据库已连接');
	    var dbo = db.db("filesharer");


		dbo.collection("studydata").find({"major": major, "course": course}).toArray(function(err, ress) {
			console.log("hhhhhh");
			console.log(ress.length)
	        if (err) throw err;
	        var retcode = 1;
	        var retarr = [];

	        if(ress.length == 0){
	            retcode = 0;
	        }
	        else{
	            retcode = 0;
	            for(var i=0;i<ress.length;i++){
	            	var insertobj = {"id":ress[i]["file_id"], "title": ress[i]["intro"], code: 0}
	                retarr.push(insertobj);
	            }
	            console.log("已查到课程的文件列表：");
	            console.log(retarr);
	        }

			res.json({
		    	code: retcode,// 0 for success, 1 for error
			    fileList: retarr
			})
			db.close();
		});		
		

	});

})


/*
上传文件
*/
router.use('/uploadFile', function (req, res) {
	// console.log(req.Payload);
	// console.log(req['Content-Type']);
	console.log("********************************* getFileListByKeys *********************************");

	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/filesharer";

	var return_value;		// 0 for success, else 1

	// 连接数据库
	MongoClient.connect(url, function (err, db) {
	    if (err) throw err;
	    console.log('数据库已连接');
	    var dbo = db.db("filesharer");


		dbo.collection("studydata").find().toArray(function(err, ress) {
			var now_id = ress.length;		// 当前文件的ID
	        if (err) throw err;
	        var retcode = 0;

			var form = new multiparty.Form();
			//console.log(__dirname);
			form.encoding = 'utf-8'
			form.uploadDir = __dirname + '/uploads';

			form.maxFileSize = 100 * 1024 * 1024

			form.parse(req, function(err, fields, files) {
				if(err) {
					console.log('错误');
					console.log(err);
					return;
				}

				/*
				修改文件名
				*/
				var oldpath = files['file'][0]['path'];		// 下载下来的文件名
				var split_res = oldpath.split('/');		// 按照斜杠分隔
				var split_len = split_res.length;
				var file_old_name = files['file'][0]['originalFilename']		// 旧文件名
				var file_new_name = now_id.toString() + '_' + file_old_name;		// 新的文件名：编号+旧文件名
				var newpath = form.uploadDir + '/' + file_new_name;		// 新的文件路径
				fs.renameSync(oldpath, newpath);
				console.log(files);

				// 插入这条信息
				var insertobj = { "file_id" : now_id, "course" : " ", "major" : " ", "filename" : file_new_name, "intro" : " ", "path" : newpath }
		    	dbo.collection("studydata").insertOne(insertobj, function(err, resss) {
			        if (err) throw err;
			        console.log("新文件信息插入成功");
			        res.json({
				    	code: retcode,// 0 for success, 1 for error
				    	id: now_id
					})
			        db.close();				// !!!!!!!!!!!!这个写在外面就一直 "MongoError: server instance pool was destroyed"
			    });
			
			})
		});		
	});	
})

/*
修改文件信息
*/
router.use('/updataFileInfo', function (req, res) {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/filesharer";

	var retcode = 1;		// 0 for success, else 1
	var id = Number(req.body.id);
	var title = req.body.title;
	var major = req.body.major;
	var course = req.body.course;

	console.log("********************************* updateFileInfo *********************************");

	// 连接数据库
	MongoClient.connect(url, function (err, db) {
	    if (err) throw err;
	    console.log('数据库已连接');
	    var dbo = db.db("filesharer");

	    // 根据 id 找到相关的文件
		dbo.collection("studydata").find({"file_id":id}).toArray(function(err, ress) {
			if (err) throw err;

			if(ress.length == 0){		// 找不到对应的帖子
				retcode = 1;
			}
			else{
				retcode = 0;
				console.log('已找到对应文件的信息');			

				// 修改文件信息
				var updateStr = {$set: {"course":course, "major":major, "intro":title}};
			    dbo.collection("studydata").updateOne({"file_id": id}, updateStr, function(err, res) {
			        if (err) throw err;
			        console.log("文件信息更新成功");
			        db.close();
			    });

			}

			res.json({
		    	code: retcode,// 0 for success, 1 for error
			    id: id
			})
		});		

	});

})

/*
根据ID返回文件的路径
*/
router.use('/getUrlByID', function (req, res) {
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/filesharer";

	var retcode = 1;		// 0 for success, else 1
	var id = Number(req.body.id);

	console.log("********************************* getUrlByID *********************************");

	// 连接数据库
	MongoClient.connect(url, function (err, db) {
	    if (err) throw err;
	    console.log('数据库已连接');
	    var dbo = db.db("filesharer");

	    // 根据 id 找到相关的文件
		dbo.collection("studydata").find({"file_id":id}).toArray(function(err, ress) {
			if (err) throw err;

			if(ress.length == 0){		// 找不到对应的帖子
				retcode = 1;
			}
			else{
				retcode = 0;
				console.log('已找到对应文件的信息');			

				// 修改文件信息
				res.json({
			    	code: retcode,// 0 for success, 1 for error
				    url: ress[0]['path']
				})
			    db.close();

			}
		});		

	});

})

module.exports = router

/*
在运行node.js文件之前，先复制下面的几行，运行mongo命令后，在命令行执行。

use filesharer
db.account.drop()
db.bbs.drop()
db.studydata.drop()
db.createCollection("account")
db.createCollection("bbs")
db.createCollection("studydata")
show tables

*/

/*

初始化数据库，数据库使用mongodb, 然后 sudo mongodb开启数据库
在服务器中，可以使用 tmux 语句，让他一直在后台运行
example:
$ tmux
$ sudo mongod

mongodb 部分语句：
> use filesharer：使用某个数据库
> show dbs：展示所有数据库
> show tables：展示数据库中的表
> db.account.remove({"name":""})  删除记录


DB各个表的项以及项的类型
> db.bbs.find()
{ "_id" : ObjectId("5b02c2f487f25e4685809194"), "bbs_id" : "0", "user_name" : "715811763@pku.edu.cn", "date" : "2018-05-21", "title": 'First BBS', "content" : "大家好这是第一条帖子", "comment" : [ "自己给自己评论一下吧" ], "comment_user" : [ "715811763@pku.edu.cn" ] }
> db.studydata.find()
{ "_id" : ObjectId("5b02c2f487f25e4685809195"), "course" : "test", "major" : "EECS", "filename" : "1.jpg", "intro" : "初始测试文件", "path" : "../public/EECS/1.jpg" }
> db.account.find()
{ "_id" : ObjectId("5b02c2f487f25e4685809193"), "name" : "715811763@pku.edu.cn", "password" : "123456", "userid": 0}
*/

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/filesharer";

function create_account(db, dbo, is_delete){

    // 插入一条初始数据
    var myid = 0;
    var initobj = {'name': '715811763@pku.edu.cn', 'password': '123456', 'userid': myid};
    var whereStr = {"name":'715811763@pku.edu.cn'};  // 查询条件（用于删除）
    dbo.collection("account").insertOne(initobj, function(err, res) {
        if (err) throw err;
        console.log("account 文档插入成功");
    });

    // 是否删除某一项
    if(is_delete){
        dbo.collection("account").deleteMany(whereStr, function(err, res) {
            if (err) throw err;
            console.log("文档删除成功");
        });
    }
}

function create_bbs(db, dbo, is_delete){

    // 插入一条初始数据

    var initobj = [{ "bbs_id":0, "user_name":'715811763@pku.edu.cn', "date":'2018-05-21', "like":0, "title": 'First BBS', "content":'大家好这是第1条帖子', "comment":[ {'id':0, 'user':"715811763@pku.edu.cn", 'content':"自己给自己评论一下吧"} ], },
    {"bbs_id":1, "user_name":'715811763@pku.edu.cn', "date":'2018-05-21', "like":0, "title": 'Second BBS', "content":'大家好这是第2条帖子', "comment":[ {'id':0, 'user':"715811763@pku.edu.cn", 'content':"自己给自己评论一下吧"} ] },
    {"bbs_id":2, "user_name":'715811763@pku.edu.cn', "date":'2018-05-21', "like":0, "title": 'Third BBS', "content":'大家好这是第3条帖子', "comment":[ {'id':0, 'user':"715811763@pku.edu.cn", 'content':"自己给自己评论一下吧"} ] },
    {"bbs_id":3, "user_name":'715811763@pku.edu.cn', "date":'2018-05-21', "like":0, "title": 'Fourth BBS', "content":'大家好这是第4条帖子', "comment":[ {'id':0, 'user':"715811763@pku.edu.cn", 'content':"自己给自己评论一下吧"} ] }
    ]

    var whereStr = {"user_name":'715811763@pku.edu.cn'};  // 查询条件（用于删除）
    dbo.collection("bbs").insertMany(initobj, function(err, res) {
        if (err) throw err;
        console.log("bbs 文档插入成功");
    });

    if(is_delete){
        dbo.collection("bbs").deleteMany(whereStr, function(err, res) {
            if (err) throw err;
            console.log("文档删除成功");
        });
    }
}

function create_studydata(db, dbo, is_delete){


    // 插入一条初始数据
    var initobj = { "course":'test', "major":"EECS", "filename":'1.jpg', "intro":'初始测试文件', "path":'../public/EECS/1.jpg'};
    var whereStr = {"filename":'1.jpg'};  // 查询条件（用于删除）
    dbo.collection("studydata").insertOne(initobj, function(err, res) {
        if (err) throw err;
        console.log("studydata 文档插入成功");
    });

    if(is_delete){
        dbo.collection("studydata").deleteMany(whereStr, function(err, res) {
            if (err) throw err;
            console.log("文档删除成功");
        });
    }
}
 
MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
    if (err) throw err;
    console.log('数据库已创建');
    var dbo = db.db("filesharer");
    var is_delete = 0;      // 插入表项后是否删除--调试的时候需要删除

    create_account(db, dbo, is_delete);
    create_bbs(db, dbo, is_delete);
    create_studydata(db, dbo, is_delete);

    db.close();

});
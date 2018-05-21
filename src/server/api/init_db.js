/*
初始化数据库，数据库使用mongodb, 然后 sudo mongodb开启数据库
在服务器中，可以使用 tmux 语句，让他一直在后台运行
example:
$ tmux
$ sudo mongodb

mongodb 部分语句：
> use filesharer：使用某个数据库
> show dbs：展示所有数据库
> show tables：展示数据库中的表
*/

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/filesharer";
 
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log('数据库已创建');
    var dbo = db.db("filesharer");

    // 创建数据库
    dbo.createCollection('account', function (err, res) {
        if (err) throw err;
        console.log("创建集合!");
        db.close();
    });

    // 插入一条初始数据
    var initobj = {'name': '715811763@pku.edu.cn', 'password': '123456'};
    var whereStr = {"name":'715811763@pku.edu.cn'};  // 查询条件（用于删除）
    dbo.collection("account").insertOne(initobj, function(err, res) {
        if (err) throw err;
        console.log("文档插入成功");
        console.log("插入的文档数量为" + res.insertedCount);
        db.close();
    });

    // 查询数据
    dbo.collection("account"). find(whereStr).toArray(function(err, result) { // 返回集合中所有数据
        if (err) 
            throw err;
        // 展示查询结果
        console.log("query result：" + result.length);
        db.close();
    });

    var use_delete = 0;     // 是否删除某一项
    if(use_delete){
        dbo.collection("account").deleteMany(whereStr, function(err, res) {
            if (err) throw err;
            console.log("文档删除成功");
            db.close();
        });
    }
});
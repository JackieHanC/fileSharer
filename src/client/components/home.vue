<template>
    <div class="ui fluid grid">
        <div class="ui fixed borderless fluid secondary pointing menu">
            <a class="item" @click="returnHome">
                <h2>FileSharer</h2>
            </a>
            <a :class="bbsPageItem" @click="activeBBS" >
                BBS
            </a>
            <a :class="filePageItem" @click="activeFile">
                文件
            </a>
        <!-- </div> -->
            <!-- <div class = "item">
                <select class="ui search dropdown">
                    <option></option>
                </select>
            </div> -->
            <div class="item">
                <div class="ui icon input" id = "searchinfo">
                    <input type="text" placeholder="搜索..." v-model="searchinfo"/>
                    <i class="search link icon" @click="search"></i>
                </div>
            </div>
            <div class="right menu" :style="loginInputs">
                <div class="item">
                    <div class="ui icon input" id = "username" :data-content="usernameError">
                        <input type="text" placeholder="邮箱" v-model="username"/>
                        <i v-bind:class="usernameIcon"></i>
                    </div>
                </div>
                <div class="item">
                    <div class="ui icon input" id = "password" :data-content="passwordError">
                        <input type="password" placeholder="密码" v-model="password"/>
                        <i :class="pwdIcon"></i>
                        
                    </div>
                </div>
                <div class="item">
                    <button id="sendButton" 
                            :class="codeButton" 
                            @click="login">
                            {{ buttonValue1 }}
                    </button>
                </div>
                <div class="item">
                    <button id="sendButton" 
                                :class="codeButton" 
                                @click="register">
                                {{ buttonValue2 }}
                    </button>
                </div>   
            </div>
            <div class="right menu" :style="loginStatus">
                <div class="ui dropdown item">
                    {{username}}
                    <i class="dropdown icon"></i>
                    <div class="menu">
                        <a class="item" @click="newpost">新建帖子</a>
                        <a class="item" @click="logOut">注销</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" style="height: 80px;"></div>
        
        <!-- <div class="ui divider"></div> -->
        
        <div class="four wide column">
            <div class="ui right floated button" :style="singlePost"
                @click="returnHome">Back</div>
        </div>
        <!-- <div class="ui divider"></div> -->
        <div class="eight wide column" :style="mainList">
            <!-- <h2>first row</h2>
            <h2>second row</h2> -->
            <!-- <div class="ui card" v-for="it in lst" :key="it.id">{{it.content}}</div> -->
            <!-- <div class="ui relaxed divided list"> -->
            <div class="ui fluid card" style="cursor: pointer;" v-for="it in dataList" :key="it.id" @click="showPost(it.id)">
                <div class="content">
                    <h3>{{it.title}}</h3>
                </div>
            </div>

            <!-- <div class="ui segments">
                <div class="ui segment" v-for="it in lst" :key="it.id">
                    <p> {{it.content}} </p>
                </div>
            </div> -->
            <!-- </div> -->
        </div>
        <div class="eight wide column" :style="singlePost">
            <showingPost :value="thePost" :getUsername="username"></showingPost>
        </div>
        <div class="eight wide column" :style="singleFile">
            <showingFile :value="theFile" :getUsername="username"></showingFile>
        </div>
        <div class="eight wide column" :style="fileListStyle">
            <div class="ui fluid card" style="cursor: pointer;" v-for="it in fileList" :key="it.id" @click="showFile(it.id)">
                <div class="content">
                    <h3>{{it.title}}</h3>
                    <div class="ui right floated positive button" @click="downloadFile">下载</div>
                </div>
            </div>
        </div>
        <div class="four wide column"></div>
        <div class="ui small modal" id="regModal">
            <div class="content">
                <login v-on:close="closeLogin" ></login>
            </div>
        </div>

        <div class="ui modal" id="newPostModal">
            
            <div class="content">
                <div class="ui form">
                    <div class="field">
                        <label>标题</label>
                        <div class="ui fluid input">
                            <input type="text" v-model="theNewPost.title">
                        </div>
                        
                        
                    </div>
                    
                    <div class="ui divider"></div>

                    <div class="field">
                        <label>内容</label>
                        
                        <div class="ui reply form">
                            <div class="ui field">
                                <textarea v-model="theNewPost.content"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            
            <div class="actions">
                <div class="ui black deny button">取消</div>
                <div class="ui right floated positive button" @click="upNewPost">确认</div>
            </div>
        </div>
    </div>

    
</template>
<script>
    import login from './login.vue'
    import showingPost from './showingPost.vue'
    import showingFile from './showingFile.vue'
    export default {
        data() {
            return {
                codeButton: "ui primary button",
                buttonValue1: "登录",
                buttonValue2: "注册",
                bbsPageItem: "item active",
                filePageItem: "item",
                usernameIcon: "",
                pwdIcon: "",
                username: "",
                password: "",
                usernameError: "",
                passwordError: "",
                loginInputs: "display:none;",
                loginStatus: "",
                searchinfo: "",
                dataList: [],
                fileList: [],
                mainList: "",
                singlePost: "display: none;",
                singleFile: "display: none;",
                fileListStyle: "display: none",
                thePost: {
                    title: "",
                    content: ""
                },
                theFile: {
                    title: "",
                    intr:"",
                },
                theNewPost: {
                    title:'',
                    content: ''
                }
            }
        },
        methods: {
            getUsername: function() {
                return this.username;
            },
            deepcopy: function (oldObj) {
                var newObj;
                var strObj = JSON.stringify(oldObj);
                return newObj = JSON.parse(strObj)
            },
            login: function(){
                let self = this

                var MD5 = require('md5.js')

                this.$ajax({
                    method: "post",
                    url: "api/searchUser",
                    data: {
                        username: this.username,
                        password: new MD5().update(this.password).digest('hex')
                    }
                    
                }).then(function (response) {
                    if(response.data['code'] === 0){
                        self.usernameError = "用户不存在"
                        self.usernameIcon = "red times icon"
                        $('#username').popup()
                    }else if(response.data['code'] === 1){
                        self.passwordError = "密码错误"
                        self.pwdIcon = "red times icon"
                        $('#password').popup()   
                    }else{
                        self.loginInputs = "display: none";
                        self.loginStatus = "";
                        self.$setCookie('username', self.username, 1000*60);
                    }

                    
                })
            },
            search: function(){
                let self = this
                this.$ajax({
                    method: "post",
                    url: "api/search",
                    data: {
                        searchinfo: this.searchinfo
                    }
                }).then(function (response) {                    
                })
            },
            register: function(){
                // this.$router.push({path: '/login'});
                $('#regModal').modal('show');
            },
            logOut: function() {
                this.loginStatus = 'display: none;';
                this.loginInputs = '';
                this.username = '';
            },
            showPost: function (postID) {
                this.mainList = "display: none;";
                this.singlePost = "";
                this.singleFile = 'display: none;';
                this.fileListStyle = "display: none;";
                var self = this;
                this.$ajax({
                    method: 'post',
                    url: 'api/getPostByID',
                    data: {
                        ID: postID
                    },
                    timeout: 3000
                }).then(function(response) {

                    if (response.data['code'] == 0) {
                        self.thePost = response.data['post'];
                        self.thePost['id'] = postID;
                        console.log(response.data['post'].title);
                        console.log(response.data['post'].content);
                        
                        console.log(self.thePost.title);
                        
                        
                        console.log('code = 0');
                        
                    } else {
                        // it should not happen
                    }

                })
            },
            showFile: function (fileID) {
                this.mainList = "display: none;";
                this.singlePost = "display: none;";
                this.fileListStyle = "";
                this.singleFile = "display: none";
                var self = this;
                this.$ajax({
                    method: 'post',
                    url: 'api/getFileByID',
                    data: {
                        ID: fileID
                    },
                    timeout: 3000
                }).then(function(response) {

                    if (response.data['code'] == 0) {
                        self.theFile = response.data['file'];
                        self.theFile['id'] = fileID;
                        console.log(response.data['file'].title);
                        console.log(response.data['file'].intr);
                        console.log(self.theFile.title);    
                        console.log('code = 0');
                        
                    } else {
                        // it should not happen
                    }

                })
            },
            downloadFile: function () {
                
            },
            activeBBS: function(){
                this.bbsPageItem = "item active";
                this.filePageItem = "item";
                this.mainList = "";
                this.singlePost = "display: none;";
                this.singleFile = "display: none";
                this.fileListStyle = "display: none;";
            },
            activeFile: function(){
                this.bbsPageItem = "item";
                this.filePageItem = "item active";
                this.mainList = "display: none";
                this.singlePost = "display: none;";
                this.singleFile = "display: none";
                this.fileListStyle = "";
            },
            returnHome: function(){
                this.bbsPageItem = 'item active';
                this.filePageItem = 'item';
                this.mainList = '';
                this.singlePost = 'display: none;';
                this.singleFile = "display: none";
                this.fileListStyle = "display: none";
            },
            newpost: function(){
                //this.buttonValue1 = "gg";
                //this.buttonValue1 = "登录";
                // this.dataList.length += 1;
                // var a = this.dataList.length-1;
                // this.dataList[a] = new Object();
                // for(var i = a;i>0;i--){
                //     this.dataList[i]['id'] = this.dataList[i-1]['id'];
                //     this.dataList[i]['content'] = this.dataList[i-1]['content'];
                // }
                // this.dataList[0]['id'] = 0;
                // this.dataList[0]['content'] = "newpost";
                // this.$ajax({
                //     method: "post",
                //     url: "api/newPost", 
                //     data: {
                //         username: this.username,
                //         title: this.thePost.title,
                //         content: this.thePost.content
                //     }

                // })
                $('#newPostModal').modal('show');

            },
            upNewPost: function () {
                var self = this
                var newID;
                this.$ajax({
                    method: 'post',
                    url: 'api/newPost',
                    data: {
                        username: this.username,
                        title: this.theNewPost.title,
                        content: this.theNewPost.content,
                    },
                    timeout: 3000
                }).then(function(response) {
                    // 插入成功
                    if (response.data['code'] == 0) {
                        newID = response.data['newPostID'];
                        self.dataList.unshift({
                            id: newID,
                            title: self.theNewPost.title
                        })
                        
                        console.log('newID is ' + newID);
                        self.theNewPost.title = '';
                        self.theNewPost.content = '';   
                    }
                })                
            },
            closeLogin: function () {
                $('#regModal').modal('hide');
            }
        },
        watch:{
            username: function () {
                var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
                if (this.username === "") {
                    this.usernameError = "邮箱不能为空"
                    this.usernameIcon = "red times icon"
                    $('#username').popup()
                    return
                } else if (!reg.test(this.username)) {
                    this.usernameError = "请输入正确的邮箱格式"
                    this.usernameIcon = "red times icon"
                    $('#username').popup()
                    return
                } 
                this.usernameError = ""
                this.usernameIcon = ""
                $('#username').popup('destroy')
                
            },
            // password: function() {
            //     if (this.password.length < 8) {
            //         this.passwordError = "密码长度应不小于8"
            //         this.pwdIcon = "red times icon"
            //         $('#password').popup()
            //     }else {
            //         this.pwdIcon = "green check icon"
            //         $('#password').popup('destroy')
            //     }
            //     if (this.canSignUp()) {
            //         this.signUpBtn = "fluid ui primary button"
            //     }
            // }
        },
        mounted: function () {
            // console.log(this.$getCookie('username'));
            console.log("this is home")
            this.username = this.$getCookie('username')
            if (this.username) {
                this.loginInputs = 'display: none;';
                this.loginStatus = '';
            }else {
                this.loginStatus = 'display: none;';
                this.loginInputs = '';
            }
            $('.ui.dropdown.item').dropdown();


            // this.dataList = new Array(20);
            // for (var i = 0;i < 20;++i) {
            //    this.dataList[i] = new Object();
            //    this.dataList[i]['id'] = i;
            //    this.dataList[i]['content'] = 'item' + i
            // }
            var self = this
            this.$ajax({
                url: 'api/getDataList',
                method: 'post',
                data : {
                    idBegin: 0
                }
            }).then(function(response) {
                // self.dataList = new Object(response.data['dataList'])
                // console.log(response.data['dataList'][4].id);
                // console.log(response.data['dataList'][4].title);
                // for (x in response.data['dataList']) {
                //     self.dataList.push(x)
                // }
                self.dataList = [].concat(response.data['dataList']);
                console.log(self.dataList.length);
                
            })
            
            this.$ajax({
                url: 'api/getFileList',
                method: 'post',
                data: {
                    idBegin: 0
                },
                timeout: 3000
            }).then(function(response) {
                self.fileList = [].concat(response.data['fileList'])
            })
            
        },
        components: {
            login,
            showingPost,
            showingFile,
        }
    }
    
</script>

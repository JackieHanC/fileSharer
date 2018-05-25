<template>
    <div class="ui fluid grid">
        
        <div class="ui fixed borderless fluid primary menu">
            <a class="item">
                <h2>FileSharer</h2>
            </a>
            <div class="item">
                    <div class="ui icon input" id = "searchinfo">
                        <input type="text" placeholder="搜索...">
                        <i class="search link icon"></i>
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
                        <a class="item">item1</a>
                        <a class="item" @click="logOut">注销</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="height: 80px;"></div>
        
        <!-- <div class="ui divider"></div> -->
        
        <div class="four wide column"></div>
        <!-- <div class="ui divider"></div> -->
        <div class="eight wide column">
            <!-- <h2>first row</h2>
            <h2>second row</h2> -->
            <!-- <div class="ui card" v-for="it in lst" :key="it.id">{{it.content}}</div> -->
            <!-- <div class="ui relaxed divided list"> -->
            <div class="ui fluid card" v-for="it in lst" :key="it.id">
                <div class="content">
                    <h3>{{it.content}}</h3>
                </div>
            </div>

            <!-- <div class="ui segments">
                <div class="ui segment" v-for="it in lst" :key="it.id">
                    <p> {{it.content}} </p>
                </div>
            </div> -->
            <!-- </div> -->
        </div>
        <div class="four wide column"></div>
        <div class="ui small modal">
            <div class="content">
                <login></login>
            </div>
        </div>
    </div>

    
</template>
<script>
    import login from './login.vue'
    export default {
        data() {
            return {
                codeButton: "ui primary button",
                buttonValue1: "登录",
                buttonValue2: "注册",
                usernameIcon: "",
                pwdIcon: "",
                username: "",
                password: "",
                usernameError: "",
                passwordError: "",
                loginInputs: "display:none;",
                loginStatus: "",
                // lst: [].fill.call(new Array(20), {
                //     id: 1,
                //     content: "items"
                // })
                dataList: []
            }
        },
        methods: {
            login: function(){
                let self = this
                this.$ajax({
                    method: "post",
                    url: "api/searchUser",
                    data: {
                        username: this.username,
                        password: this.password
                    },
                    
                }).then(function (response) {
                    if(response.data['code'] === 0){
                        self.usernameError = "用户不存在"
                        self.usernameIcon = "red time icon"
                        $('#username').popup()
                    }else if(response.data['code'] === 1){
                        self.passwordError = "密码错误"
                        self.passwordIcon = "red time icon"
                        $('#password').popup()   
                    }else{
                        self.loginInputs = "display: none";
                        self.loginStatus = "";
                        self.$setCookie('username', self.username, 1000*60);
                    }

                    
                })
            },
            register: function(){
                // this.$router.push({path: '/login'});
                $('.ui.small.modal').modal('show');
            },
            logOut: function() {
                this.loginStatus = 'display: none;';
                this.loginInputs = '';
                this.username = '';
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

            var self = this
            this.$ajax({
                url: 'api/getDataList',
                method: 'post',
                data : {
                    id: 0
                }
            }).then(function(response) {
                self.dataList = response.data['dataList']
            })
        },
        components: {
            login
        }
    }
    
</script>

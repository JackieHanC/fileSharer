<template>
    <div class="ui grid container">
        
        <div class="ui fixed borderless fluid primary menu">
            <a class="active item" >FileSharer</a>
            <div class="item">
                    <div class="ui icon input" id = "searchinfo">
                        <input type="text" placeholder="搜索...">
                        <i class="search link icon"></i>
                    </div>
            </div>
            <div class="right menu">
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
        </div>
        
    </div>
</template>
<script>
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
                
                
            }
        },
        methods: {
            login: function(){
                let self = this
                    this.$ajax({
                        method: "post",
                        url: "api/searchUser",
                        data: {
                            username: username,
                            password: password
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
                            
                        }

                        
                    })
            },
            register: function(){
                this.$router.push({path: '/login'});
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
            password: function() {
                if (this.password.length < 8) {
                    this.passwordError = "密码长度应不小于8"
                    this.pwdIcon = "red times icon"
                    $('#password').popup()
                }else {
                    this.pwdIcon = "green check icon"
                    $('#password').popup('destroy')
                }
                if (this.canSignUp()) {
                    this.signUpBtn = "fluid ui primary button"
                }
            }
        }
    }
    
</script>

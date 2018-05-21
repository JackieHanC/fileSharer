<template>
  <div class="ui card">
      <div class="content">  
        <div class="ui form">
            <div class="ui field" align="center">
                <h1>fileSharer</h1>
            </div>
            <div class="ui field">
                <div class="ui icon input"
                     id="username" 
                     :data-content="usernameError">
                    <input 
                        type="text" 
                        placeholder="注册邮箱" 
                        v-model="username"/>
                    <i v-bind:class="usernameIcon"></i>
                </div>
            </div>
            <div class="ui field">
                <div class="ui icon input" id="password" :data-content="passwordError">
                    <input class="ui input" type="password" placeholder="密码" v-model="password"/>
                    <i :class="pwdIcon"></i>
                </div>
            </div>
            <div class="ui field">
                <div class="ui icon input" id="password2" data-content="密码与第一次不符">
                    <input class="ui input" type="password" placeholder="再次输入密码" v-model="password2"/>
                    <i v-bind:class="pwd2Icon"></i>
                </div>
            </div>
            <div class="ui field">
                <div class="fluid ui action input">
                    <div class="fluid ui icon input">
                        <input type="text" placeholder="验证码" v-model="icode">
                        <i :class="icodeIcon"></i>
                    </div>
                    <button id="sendButton" 
                            :class="codeButton" 
                            @click="sendCode">
                            {{ buttonValue }}
                    </button>
                </div>
            </div>
            <div class="ui field">
                <button :class="signUpBtn" @click="sub" >注册</button>
            </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            usernameIcon: "",
            pwdIcon: "",
            pwd2Icon: "",
            icodeIcon: "",
            username: "",
            password: "",
            password2: "",
            codeButton: "ui primary button",
            buttonValue: "发送",
            cnt: 50,
            usernameError: "",
            passwordError: "",
            icode:"",
            mailCode: "",
            signUpBtn: "fluid ui disabled button"
      }
    },
    methods: {
        sub: function () {
            var name = this.username
            var pwd = this.password
            
            var self = this
            var MD5 = require('md5.js')
            console.log(new MD5().update(pwd).digest('hex'));
            
            if (name != '' && pwd != '') {
                this.$ajax({
                    method: 'get',
                    url: 'api/signUp',
                    data: {
                        username: name,
                        pwd: new MD5().update(pwd).digest('hex')
                    },
                    timeout: 3000
                }).then(function(response) {
                    // TODO. cookie, jump over

                    
                })
            }
        },
        sendCode: function() {
            this.codeButton = "ui disabled button"
            if (this.cnt === 50) {
                var self = this
                this.$ajax({
                    method: 'post',
                    url: 'api/sendMailCode',
                    data: {
                        mail: this.username
                    },
                    timeout: 3000
                }).then(function (response) {
                    console.log(response);
                    
                    self.mailCode = response.data['codeSent']
                    console.log(response.data['codeSent']);
                    
                    console.log(self.mailCode)
                })
            }
            this.cnt--
            this.buttonValue = this.cnt + "(s)重新发送"
            // console.log(this.cnt)

            if (this.cnt === 0){
                this.codeButton = "ui primary button"
                this.cnt = 50
                this.buttonValue = "发送"
                return
            }
            setTimeout(this.sendCode, 1000);
            
        },
        canSignUp: function () {
            var rightIcon = "green check icon"
            if (this.usernameIcon === rightIcon &&
                this.pwdIcon === rightIcon &&
                this.pwd2Icon === rightIcon &&
                this.icodeIcon === rightIcon)
                return true;
            else 
                return false;
        }
    },
    watch: {
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
            } else {
                let self = this
                this.$ajax({
                    method: "post",
                    url: "api/checkUserExistence",
                    data: {
                        username: this.username
                    },
                    timeout: 3000
                }).then(function (response) {
                    if (response.data['code'] === 1) {
                        self.usernameError = "邮箱已注册"
                        self.usernameIcon = "red time icon"
                        $('#username').popup()
                    } else if (response.data['code'] === 0){
                        $('#username').popup('destroy')
                        self.usernameIcon = "green check icon"
                    } else {
                        console.log("wrong return code")
                    }
                })
            }
            if (this.canSignUp()) {
                this.signUpBtn = "fluid ui primary button"
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
        },
        password2: function () {
            if (this.password !== this.password2) {
                this.pwd2Icon = "red times icon"
                $('#password2').popup()
            }else {
                this.pwd2Icon = "green check icon"
                $('#password2').popup('destroy')
            }
            if (this.canSignUp()) {
                this.signUpBtn = "fluid ui primary button"
            }
        },
        icode: function () {
            if (this.icode !== this.mailCode) {
                this.icodeIcon = "red times icon"
            } else {
                this.icodeIcon = "green check icon"
            }
            if (this.canSignUp()) {
                this.signUpBtn = "fluid ui primary button"
            }
        }
    }

}
</script>


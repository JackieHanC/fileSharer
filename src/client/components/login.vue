<template>
  <div class="ui card">
      <div class="content">  
        <div class="ui form">
            <div class="ui field">
                <div class="ui icon input"
                     id="username" 
                     data-content="邮箱已注册">
                    <input 
                        type="text" 
                        placeholder="注册邮箱" 
                        v-model="username"/>
                    <i v-bind:class="usernameIcon"></i>
                </div>
            </div>
            <div class="ui field">
                <div class="ui labeled input" id="password">
                    <input class="ui input" type="password" placeholder="密码" v-model="password"/>
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
                    <input type="text" placeholder="验证码">
                    <button id="sendButton" 
                            :class="codeButton" 
                            @click="sendCode">
                            {{ buttonValue }}
                    </button>
                </div>
            </div>
            <div class="ui field">
                <button class="fluid ui primary button" @click="sub" >注册</button>
            </div>
        </div>
      </div>
      <div class="extracontent">
          <p>{{outtext}}</p>
      </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            usernameIcon: "",
            pwd2Icon:"",
            username: "",
            password: "",
            password2: "",
            outtext: "",
            usernameTip: "",
            codeButton: "ui primary button",
            buttonValue: "发送",
            cnt: 50,
      }
    },
    methods: {
        sub: function () {
            var name = this.username
            var pwd = this.password
            if (pwd !== this.password2) {
                this.outtext
            }
            var self = this
            if (name != '' && pwd != '') {
                this.$ajax({
                    method: 'get',
                    url: 'api/searchUser',
                    data: {
                        username: name,
                        pwd: pwd
                    },
                    timeout: 3000
                }).then(function(response) {
                    var i, flag
                    for (i in response.data) {
                        if (name === response.data[i].userName && pwd === response.data[i].pwd &&
                            name != '' && pwd != '')
                            flag = 'allright'
                    }

                    if (flag === 'allright') {
                        self.outtext = 'sucess'
                    }
                })
            }
        },
        sendCode: function() {
            this.codeButton = "ui disabled button"
            this.cnt--
            this.buttonValue = this.cnt + "(s)重新发送"
            console.log(this.cnt)
            if (this.cnt === 0){
                this.codeButton = "ui primary button"
                this.cnt = 50
                this.buttonValue = "发送"
                return
            }
            setTimeout(this.sendCode, 1000);


            // for (var i = 0; i <= 50;i++) {
            //     setTimeout(() => {
            //         this.buttonValue = (50-i) + "(s)重新发送"
            //     }, i*1000);
            // }
            // setTimeout(() => {
            //     this.buttonValue = "发送"
            //     this.sendCode = "ui primary button"
            // }, 5100);
            
        }
    },
     watch: {
         username: function () {
             this.outtext = this.username.length
             if (this.username.length > 3) {
                this.usernameIcon = "green check icon"
                $('#username').popup('destroy')
             }else {
                this.usernameIcon = "red times icon"
                $('#username').popup()
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
        }
    }

}
</script>


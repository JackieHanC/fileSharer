<template>
  <div class="ui card">
      <div class="content">  
        <div class="ui form">
            <div class="ui field">
                <div class="ui labeled input">
                    <input class="ui input" type="text" placeholder="用户名" v-model="username"/>
                </div>
            </div>
            <div class="ui field">
                <div class="ui labeled input">
                    <input class="ui input" type="password" placeholder="密码" v-model="password"/>
                </div>
            </div>
            <div class="ui field">
                <button class="fluid ui primary button" @click="sub" >登录</button>
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
        username: "",
        password: '',
        outtext: '',
      }
  },
  methods: {
      sub: function () {
          var name = this.username
          var pwd = this.password
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
      }
  }
}
</script>


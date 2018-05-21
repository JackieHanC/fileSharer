import Vue from 'vue'
import Router from 'vue-router'

// 导入对应的vuex文件
import store from './../store/store'

// 导入相应的子组件
import Hello from './../components/Hello'
import login from './../components/login'
import home from './../components/home'
import axios from 'axios'

Vue.use(Router)
Vue.prototype.$ajax = axios
var router = new Router({
    mode: 'history',
    routes: [
        { name: 'hello', path: '/hello', component: Hello },
        { name: 'login', path: '/login', component: login },
        { name: 'login', path: '/', component: home }
    ]
})

export default router
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/store'

import axios from 'axios'
import semantic from 'semantic-ui-css/semantic.min.css'
import 'semantic-ui/dist/semantic.js'
// import VTooltip from 'v-tooltip'
import {getCookie, setCookie} from './static/cookie.js'
import $ from 'jquery'
Vue.config.debug = true
Vue.config.productionTip = false
Vue.prototype.$ajax = axios
Vue.prototype.$getCookie = getCookie
Vue.prototype.$setCookie = setCookie
// Vue.use(VTooltip)


new Vue({
  el: '#app',
  router: router,
  store: store,
  template: '<App/>',
  components: { App }
})

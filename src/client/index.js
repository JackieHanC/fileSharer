import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/store'

import axios from 'axios'
import semantic from 'semantic-ui-css/semantic.min.css'

Vue.config.debug = true
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  el: '#app',
  router: router,
  store: store,
  template: '<App/>',
  components: { App }
})

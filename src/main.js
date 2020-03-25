/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Notifications from 'vue-notification'
import { rtdbPlugin } from 'vuefire'

Vue.use(Notifications)
Vue.use(rtdbPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

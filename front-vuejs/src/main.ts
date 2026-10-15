import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Bootstrap-Vue
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Global styles
import './assets/main.css'

// Input masks
import VueTheMask from 'vue-the-mask'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueTheMask)

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')

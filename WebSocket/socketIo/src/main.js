// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import component from '@/components'
import plugins from '@/plugins'
import Mint from '@/components/mint-ui'
import '../scss/index.scss'

Vue.use(component)
Vue.use(plugins)
Vue.use(Mint)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
window.onload = function () {
  let $rcDefaultLoading = document.getElementById('rcDefaultLoading')
  $rcDefaultLoading && ($rcDefaultLoading.style.display = 'none')
}

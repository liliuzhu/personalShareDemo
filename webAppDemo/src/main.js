// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
'use strict'
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import plugins from './plugins'
import LoadingConfig from '@/config/loading.config'
import component from '@/components'
import Mint from '@/components/mint-ui'

import '../scss/index.scss'

Vue.config.productionTip = process.env.NODE_ENV === 'development'
Vue.use(plugins)
Vue.use(component)
Vue.use(Mint)

LoadingConfig(router)

/* eslint-disable no-new */
// 简单验证一下是否为app或者开发模式
// if ((process.env.NODE_ENV === 'production' && new RegExp('renrenche').test(navigator.userAgent)) || process.env.NODE_ENV === 'development') {
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
// }

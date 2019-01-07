import Vue from 'vue'
import Router from 'vue-router'
import hichat from '@/views/hichat'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'hichat',
      component: hichat
    }
  ]
})

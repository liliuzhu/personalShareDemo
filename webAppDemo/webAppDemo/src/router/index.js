import Vue from 'vue'
import Router from 'vue-router'
import carOwnerService from '@/view/carOwnerService/router'
const home = () => import('@/view/home')

Vue.use(Router)

let routes = []
routes.push(...carOwnerService)
// 根路由
let rootRouter = {
  path: '/',
  name: '/',
  component: home
}
// 重定向路由
let redirectRoute = {
  path: '*',
  redirect: '/'
}
let mode = 'history'
export default new Router({
  mode,
  routes: [rootRouter, ...routes, redirectRoute]
})

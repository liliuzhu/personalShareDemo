import NProgress from 'nprogress'
import {NoAfterRouteIsLoading} from '@/config/global.config'
// import Vue from 'vue'

NProgress.configure({showSpinner: false}) // 取消loading 转圈

/**
 * @export
 * @param {any} router 路由
 * @param {any} store vuex store
 */
export default function LoadingConfig(router) {
  router.beforeEach(async (to, from, next) => {
    let {path} = to
    // let { name, matched, fullPath, path } = to
    if (to.hash) {
      return
    }

    // if (matched.some(record => record.meta.requiresAuth) && !matched) {
    //   // 用户登录处理 判断当前登录状态 如果未登录 直接去登录页面
    //   let isLoggedIn = !Vue.cookie.get('uid') || !Vue.cookie.get('token')
    //   if (isLoggedIn) {
    //     next({
    //       path: '/login',
    //       query: { redirect: fullPath }
    //     })
    //     return
    //   }
    // }
    NProgress.start()

    // loading 处理
    // if (!store.state.loading.isLastLoading[name]) {
    //   store.commit('UPDATE_LOADING', { isLoading: true })
    // }
    if (/^http/.test(path)) {
      let url = path.split('http')[1]
      window.location.href = `http${url}`
    } else {
      next()
    }
  })

  router.afterEach((to) => {
    let {name} = to
    if (NoAfterRouteIsLoading.indexOf(name) === -1) {
      setTimeout(() => {
        // store.commit('UPDATE_LOADING', { isLoading: false })
        NProgress.done()
      }, 10)
    }
  })
}

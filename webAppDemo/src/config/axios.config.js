import Vue from 'vue'
import axios from 'axios'
import {isUndefined} from '@/util'

/**
 * 请求配置
 * @see https://github.com/mzabriskie/axios
 */
const service = axios.create({
  timeout: 20000,
  withCredentials: true
})
// loading 组
let ARR_LOADING = []
let IS_LOADING = false
let LOADING_INSTANCE = Vue.prototype.$Indicator
service.interceptors.request.use(async config => {
  let reg = /ticket=(.+?\.shanyishanmei\.com)/
  let result = window.location.href.match(reg)
  if (result !== null) {
    let ticket = result[1]
    config.headers['X-RRC-TICKET'] = ticket
  }
  if (config.isLoading) {
    ARR_LOADING.push(config.url)
    if (!IS_LOADING) {
      IS_LOADING = true
      LOADING_INSTANCE.open({
        text: '加载中...',
        spinnerType: 'snake'
      })
    }
  }
  // cas 接入时使用
  config.headers.common['X-Requested-With'] = 'XMLHttpRequest'
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    let {data: {status, err_msg, data}, config} = response // eslint-disable-line
    if (config.isLoading) {
      let index = ARR_LOADING.indexOf(config.url)
      ARR_LOADING.splice(index, 1)
      if (ARR_LOADING.length === 0) {
        LOADING_INSTANCE.close()
        IS_LOADING = false
      }
    }
    // 如果不是status 返回值
    if (isUndefined(status)) {
      return response.data
    }
    if (status !== 0) {
      // 是否自动提示消息
      if (config.isAutoMsg) {
        Vue.$MessageBox.alert(err_msg)
      }
      return Promise.reject({status, data, err_msg}) // eslint-disable-line
    } else {
      return response.data
    }
  },
  error => {
    ARR_LOADING = []
    LOADING_INSTANCE.close()
    IS_LOADING = false
    let response = error.response
    if (response === undefined) {
      Vue.$MessageBox.alert('网络异常, 请刷新重试').then(action => {
        window.reload()
      })
      return Promise.reject(error)
    }
    let {data: {err_msg}} = response // eslint-disable-line
    if (err_msg !== undefined) { // eslint-disable-line
      Vue.$MessageBox.alert(err_msg).then(action => {
        window.reload()
      })
    }
    Vue.$MessageBox.alert('网络异常, 请刷新重试').then(action => {
      window.reload()
    })
    return Promise.reject(error)
  }
)

export default service

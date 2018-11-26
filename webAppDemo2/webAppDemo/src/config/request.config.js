import Vue from 'vue'
import { __DEVELOPMENT__ } from './global.config'

// 默认 APP 参数，仅沙盒环境用
const DEV_APP_INFO = {
  deviceId: 'f625eb41ccfa3c0db9ed70c4c083b101',
  deviceType: 'ios',
  // 会被忽略
  loginToken: 'baeb3a9d446cf4d407ac2b896b67ed0e',
  // 测试手机号
  loginPhone: '18612345678',
  city: 'bj',
  version: '5.0',
  uuid: '0EB1B982-C86D-48C3-8DAF-D07634970969',
  ip: '172.18.1.110'
}

const DEFAULT_PARAMS = {
  channel: '8077'
}

/**
 * 沙盒环境的参数
 * @param {*} appInfo
 */
const createDevParams = appInfo => ({
  data: {
    busInfo: DEV_APP_INFO,
    appInfo: {
      ...DEFAULT_PARAMS,
      ...appInfo
    }
  }
})

/**
 * 线上环境的参数
 * @param {*} appInfo
 */
const createProdParams = appInfo => ({
  ...DEFAULT_PARAMS,
  ...appInfo
})

/**
 * 是否是app调用
 */

const isApp = /renrenche/gi.test(window.navigator.userAgent)
// const isWeixin = device.isWeixin()

export class ParamsHander {
  constructor(config) {
    this.init()
    let method = config.method
    return this[method](config)
  }

  init() {
    let methods = ['get', 'post', 'put', 'delete']
    methods.forEach((val) => {
      this.registMethods(val)
    })
  }

  registMethods(val) {
    this[val] = function (config) {
      return new Promise((resolve, reject) => {
        if (__DEVELOPMENT__) {
          config.params = createDevParams(config.params)
          return resolve()
        }
        if (isApp) {
          const params = createProdParams(config.params)
          Vue.$rrcBridge.send('encrypt', params, function (e, message) {
            if (e) {
              return reject(e)
            }

            config.params = {data: message}
            return resolve()
          })
        }
        return resolve()
      })
    }
  }
}

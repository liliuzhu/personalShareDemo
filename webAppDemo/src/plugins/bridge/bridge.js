import {device} from '@/util'
import { eventBus } from '@/eventBus'

const ua = navigator.userAgent
// const CUSTOM_PROTOCOL_SCHEME = 'rrche'
// const QUEUE_HAS_MESSAGE = '__MESSAGE_MODEL__/'

const DEFAULT_OPTIONS = {
  appPrefix: 'renrenche'
}

const EVENT_ERROR = 'error'
const isApp = new RegExp(DEFAULT_OPTIONS.appPrefix).test(ua)
const isJsonString = (str) => { // 是否是JSON的字符串
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e)
      return false
    }
  }
}

const requestAppApi = (json) => { // 调取app的接口api
  let data = json.data
  let action = json.action
  if (!data) {
    data = {}
  }
  Object.assign(data, {ts: +new Date()})
  if (!isApp && process.env.NODE_ENV === 'production') {
    console.log('错误：打开方式不再app中')
    return -1
  }
  let par = { data, action }
  // ios Android 要的参数不一样
  let params = device.isIOS() ? par : JSON.stringify(par)
  if (window.RenrencheJSBridge) {
    try {
      let result = window.RenrencheJSBridge.nativeBridge(params)
      return result
    } catch (error) {
      window.throwError('json parse error in dispatch native bridge')
      return -1
    }
  } else {
    return json.data
  }
}
const handleDecryptData = (json) => { // 发起解密并处理解密后的数据
  let {action} = json
  let response = requestAppApi(json)
  if (isJsonString(response)) {
    let res = JSON.parse(response)[action]
    if (isJsonString(res)) {
      return JSON.parse(res)
    } else {
      return res
    }
  }
  return null
}
/**
 * 可供监听的事件
 * error 发生错误时调用，params: error
 */
export const EVENT_LIST = [EVENT_ERROR]
/**
 * RRC JS Bridge
 */
export default class Bridge {
  constructor(options = {}) {
    this.options = {...DEFAULT_OPTIONS, ...options}
    this.isApp = new RegExp(this.options.appPrefix, 'ig').test(ua)
    this.uniqueId = 1
    this.responseCallbacks = {}
    this.messagingIframe = null

    this._setup()

    // 观察者
    const observer = {}
    this.on = function (type, handler) {
      if (!EVENT_LIST.includes(type)) {
        return
      }

      const handlers = observer[type]

      if (handlers) {
        handlers.push(handler)
      } else {
        observer[type] = [handler]
      }
      return handler
    }
    this.emit = function (type, ...args) {
      const handlers = observer[type] || []
      for (const handler of handlers) {
        handler(...args)
      }
    }
    this.remove = function (type, handler) {
      if (!observer[type]) {
        return
      }
      if (!handler || typeof handler !== 'function') {
        observer[type] = []
        return
      }
      observer[type] = observer[type].filter(val => val !== handler)
    }
  }

  /**
   * 创建需要挂载到 window 上的 bridge 对象
   * @returns bridge
   * @memberof Bridge
   */
  _createBridgeObj() {
    return {
      send: this.send,
      jsBridge: this._dispatchMessageFromNative.bind(this)
    }
  }

  /**
   * 初始化环境
   */
  _setup() {
    const bridgeObj = this._createBridgeObj()
    // register
    window.WebViewJavascriptBridge = bridgeObj

    // create iframe
    const messagingIframe = document.createElement('iframe')
    messagingIframe.style.display = 'none'
    document.documentElement.appendChild(messagingIframe)
    this.messagingIframe = messagingIframe

    // dispatch ready event
    const readyEvent = document.createEvent('Events')
    readyEvent.initEvent('WebViewJavascriptBridgeReady')
    readyEvent.bridge = bridgeObj
    document.dispatchEvent(readyEvent)
  }

  /**
   * 提供给 APP 调用
   * @param {*} messageJSON 参数
   */
  _dispatchMessageFromNative(messageJSON) {
    if (isJsonString(messageJSON)) {
      eventBus.$emit('pay-status', JSON.parse(messageJSON))
    }
    const {responseCallbacks} = this
    setTimeout(() => {
      let message = ''
      let error = null

      try {
        message = JSON.parse(messageJSON)
      } catch (e) {
        error = e
        this.emit(EVENT_ERROR, {
          type: 'json parse error in dispatch',
          error
        })
      }

      if (message.responseId) {
        const responseCallback = responseCallbacks[message.responseId]
        if (!responseCallback) {
          return
        }
        responseCallback(error, message.responseData)
        delete responseCallbacks[message.responseId]
      }
    }, 0)
  }

  /**
   * 向 APP 发起消息
   * @param {any} action 动作名
   * @param {any} data 参数
   * @param {any} responseCallback 回调
   * @return {string} iframe.src
   * @memberof Bridge
   */
  // send(action, data, responseCallback) {
  //   if (!this.isApp) {
  //     return console.log('错误：打开方式不再app中')
  //   }
  //
  //   let {uniqueId} = this
  //   const {
  //     responseCallbacks,
  //     messagingIframe
  //   } = this
  //   const message = {action, data}
  //
  //   if (responseCallback) {
  //     const callbackId = `cb_${uniqueId++}_${new Date().getTime()}`
  //     responseCallbacks[callbackId] = responseCallback
  //     message.callbackId = callbackId
  //   }
  //
  //   const messageQueueString = JSON.stringify(message)
  //   messagingIframe.src = `${CUSTOM_PROTOCOL_SCHEME}://${QUEUE_HAS_MESSAGE}${encodeURIComponent(messageQueueString)}`
  //
  //   return messagingIframe.src
  // }
  /**
   * 与原生交互
   * @param {string} action 动作 encrypt 加密 decrypt解密
   * @param {object} data 数据
   * @param {*} service 后台接口
   */
  handleRequestAppApi(action, data, service) { // 处理请求APP的api
    if (action === 'encrypt') {
      let response = requestAppApi({action, data: {encrypt: data}}) // 调取app的api
      if (isJsonString(response)) {
        const resE = JSON.parse(response)[action]
        return resE
      }
      return null
    } else if (action === 'decrypt') {
      return handleDecryptData({ // 解密返回数据
        action: 'decrypt',
        data: { decrypt: data }
      })
    } else {
      return requestAppApi({action, data})
    }

    // switch (action) {
    //   case 'encrypt' : // 如果是加密发起和服务器的请求, 并解密返回的数据
    //     let response = requestAppApi({action, data}) // 调取app的api
    //     const resE = encodeURI(JSON.parse(response)[action])
    //     window.alert(JSON.stringify(resE))
    //     if (service) {
    //       let rs = await service({paramData: resE}) // eslint-disable-line
    //       if (!rs || rs.status !== 0) {
    //         return rs
    //       }
    //       return handleDecryptData({ // 解密返回数据
    //         action: 'decrypt',
    //         data: {decrypt: rs.data}
    //       })
    //     }
    //     handleDecryptData({ // 解密返回数据
    //       action: 'payOrder',
    //       data: {
    //         order_id: 1,
    //         creator_id: 1212,
    //         business_order_id: 122,
    //         pos_data: {
    //           amount: 10000,
    //           service_charge: 10000
    //         }
    //       }
    //     })
    //     break
    //   case 'decrypt' : // 如果是发起支付
    //     return handleDecryptData({ // 解密返回数据
    //       action: 'decrypt',
    //       data: {decrypt: data}
    //     })
    //   // case 'payOrder' : // 如果是发起支付
    //   // case 'payOrder' : // 如果是发起支付
    //   // case 'payOrder' : // 如果是加密发起和服务器的请求, 并解密返回的数据
    //   default :
    //     let response = requestAppApi({action, data}) // 调取app的api
    //     let res = JSON.parse(response)[action]
    //     if (isJsonString(res)) {
    //       return JSON.parse(res)
    //     } else {
    //       return res
    //     }
    // }
  }
}

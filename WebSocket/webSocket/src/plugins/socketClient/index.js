let wsUrl = `ws://${window.location.hostname || '127.0.0.1'}:3000`
class Client {
  constructor(url, bus) {
    this._wsUrl = url
    this._bus = bus
    this._socket = null
  }
  init(events) {
    if ('WebSocket' in window) {
      this._socket = new WebSocket(this._wsUrl)
      this._socket.onopen = (e) => {
        this._bus.$emit('connect')
      }
      this._socket.onclose = (e) => {
        console.log('连接中断', e)
      }
      this._socket.onerror = (e) => {
        console.log('连接错误', e)
      }
      this._socket.onmessage = (msg) => {
        const message = JSON.parse(msg.data)
        console.log(message.action)
        this._bus.$emit(message.action, message.data)
      }
    } else {
      alert('您的浏览器不支持 WebSocket!')
    }
  }
  // postMsg(action, msg, color) {
  //   this._socket.send(action, msg, color)
  // }
  sendMsgToServer(arg) {
    this._socket.send(JSON.stringify(arg))
  }
}

export default function socketClient(Vue) {
  Vue.prototype.$socketClient = new Client(wsUrl, Vue.prototype.$bus)
}

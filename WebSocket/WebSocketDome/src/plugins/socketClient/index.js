import io from 'socket.io-client'

let wsUrl = 'http://172.18.1.166:3000'
const CLIENT = { // eslint-disable-line
  socket: null,
  init(username) {
    // 连接websocket后端服务器
    this.socket = io.connect(wsUrl, {'force new connection': true})
    // this.socket.on('open', _ => {
    //   console.log('open')
    // })
    this.socket.on('connect', _ => {
      console.log('connect')
      this.socket.emit('login', username)
    })
    this.socket.on('newMsg', (user, msg, color) => {
      this._displayNewMsg(user, msg, color)
    })
    // 在前端接收到这个事件后我们显示一条信息通知用户。
    this.socket.on('nickExisted', _ => {
      // document.getElementById('info').textContent = '称被占用' // 显示昵称被占用的提示
    })
    // 通知前端登陆成功，前端接收到这个成功消息后将灰色遮罩层移除显示聊天界面。
    this.socket.on('loginSuccess', _ => {
      console.log('loginSuccess')
      // document.title = 'hichat | ' + document.getElementById('nicknameInput').value
      // document.getElementById('loginWrapper').style.display = 'none';//隐藏遮罩层显聊天界面
      // document.getElementById('messageInput').focus();//让消息输入框获得焦点
    })
    this.socket.on('system', (nickName, userCount, type) => {
      var msg = nickName + (type === 'login' ? ' 加入' : '离开')
      // 指定系统消息显示为红色
      this._displayNewMsg('system ', msg, 'red')
      // document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
    })
  },
  postMsg(msg, color) {
    this.socket.emit('postMsg', msg, color)
  }
}

class Client {
  constructor(url, bus) {
    this._wsUrl = url
    this._bus = bus
    this._socket = null
  }
  init(events) {
    this._socket = io.connect(this._wsUrl, {'force new connection': true})
    for (let i = 0, len = events.length; i < len; i++) {
      this._socket.on(events[i], (...arg) => {
        console.log(1, events[i])
        this._bus.$emit(events[i], ...arg)
      })
    }
  }
  postMsg(action, msg, color) {
    this._socket.emit(action, msg, color)
  }
  sendMsgToServer(...arg) {
    this._socket.emit(...arg)
  }
}

export default function socketClient(Vue) {
  Vue.prototype.$socketClient = new Client(wsUrl, Vue.prototype.$bus)
}

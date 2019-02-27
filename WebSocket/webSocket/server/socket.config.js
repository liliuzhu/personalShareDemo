// websocket.js
const ws = require('nodejs-websocket')
let users = [] //保存所有在线用户的昵称

const createServer = (port) => {
  let server = ws.createServer(connection => {
    connection.on('text', function(result) {
      console.log(`来自客户端的信息：${result}`)
      messageHandle(connection, result)
    })
    connection.on('connect', function(code) {
      console.log('开启连接', code)
    })
    connection.on('close', function(code) {
      console.log('关闭连接', code)
      //将断开连接的用户从users中删除
      let userIndex = users.indexOf(connection.nickName)
      if (userIndex > -1) {
        users.splice(userIndex, 1);
      }
      const params = {action: 'system', data: {userCount: users.length, nickName: connection.nickName, type: 'logout'}}
      connection.nickName && broadcast.excludeSelf(connection, params)
    })
    connection.on('error', function(code) {
      // 某些情况如果客户端多次触发连接关闭，会导致connection.close()出现异常，这里try/catch一下
      // try {
      //   connection.close()
      // } catch (error) {
      //   console.log('close异常', error)
      // }
      console.log('连接异常', code)
    })
  }).listen(port, () => {
    console.log('打开浏览器并访问 http://localhost:' +port)
  })
  server.on('connection', conn => {
    console.log(`连接数量:${conn.server.connections.length}`)
  })
  return server
}
const messageHandle = (conn, msg) => {
  const {action, data} = JSON.parse(msg)
  if (action === 'login') {
    if (users.indexOf(data.nickName) > -1) {
      const params = {action: 'nickExisted'}
      broadcast.self(conn, params)
    } else {
      conn.nickName = data.nickName
      users.push(data.nickName)
      const params = {action: 'system', data: {userCount: users.length, nickName: data.nickName, type: action}}
      broadcast.self(conn, {action: 'loginSuccess'})
      broadcast.all(conn, params)
    }
  } else if(action === 'postMsg' || action === 'newImg') {
    data.user = conn.nickName
    const params = {action, data}
    broadcast.excludeSelf(conn, params)
  }
  // broadcast(server, conn, msg)
}
const broadcast = {
  all: (conn, msg) => { // 所有人
    const message = JSON.stringify(msg)
    conn.server.connections.forEach(function (connection) {
      console.log(message)
      connection.sendText(message)
    })
  },
  self: (conn, msg) => { // 自己
    const message = JSON.stringify(msg)
    conn.sendText(message)
  },
  excludeSelf: (conn, msg) => { // 排除自己
    const message = JSON.stringify(msg)
    conn.server.connections.forEach(function (connection) {
      if (conn !== connection) {
        connection.sendText(message)
      }
    })
  }

}

module.exports = createServer

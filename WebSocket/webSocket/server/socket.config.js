// websocket.js
const ws = require('nodejs-websocket')
let users = [] //保存所有在线用户的昵称

const createServer = (port) => {
  let server = ws.createServer(connection => {
    connection.on('text', function(result) {
      console.log('收到消息', result)
      console.log(server.connections.length)
      messageHandle(server,connection, result)
    })
    connection.on('connect', function(code) {
      console.log('开启连接', code)
    })
    connection.on('close', function(code) {
      console.log('关闭连接', code)
    })
    connection.on('error', function(code) {
      // 某些情况如果客户端多次触发连接关闭，会导致connection.close()出现异常，这里try/catch一下
      try {
        connection.close()
      } catch (error) {
        console.log('close异常', error)
      }
      console.log('异常关闭', code)
    })
  }).listen(port, () => {
    console.log('打开浏览器并访问 http://localhost:' +port)
  })
  return server
}
const messageHandle = (server, conn, msg) => {
  const obj = JSON.parse(msg)
  if (obj.action === 'login') {
    if (users.indexOf(obj.data.nickname) > -1) {
      const params = {}
      broadcast.self(server, conn, params)
    } else {

    }
  } else {

  }
  // broadcast(server, conn, msg)
}
const broadcast = {
  all: (server, conn, msg) => {
    server.connections.forEach(function (connection) {
      connection.sendText(msg)
    })
  },
  self: (server, conn, msg) => {
    conn.sendText(msg)
  },
  excludeSele: (server, conn, msg) => {
    server.connections.forEach(function (connection) {
      if (conn !== connection) {
        connection.sendText(msg)
      }
    })
  }

}

module.exports = createServer

//var http = require('http'),
////创建一个服务器
//    server = http.createServer(function(req, res) {
//        res.writeHead(200, {
//            'Content-Type': 'text/html'
//        });
//        res.write('<h1>hello world!</h1>');
//        res.end();
//    });
////监听8089端口
//server.listen(8089);
//console.log('server started');



//var express = require('express'), //引入express模块
//    app = express(),
//    server = require('http').createServer(app);
//app.use('/', express.static(__dirname + '/www')); //指定静态HTML文件的位置
//server.listen(8089);
//console.log('server started');


//服务器及页面部分
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users=[];//保存所有在线用户的昵称
app.use('/', express.static(__dirname + '/www'));
server.listen(8089);
console.log('server started');
//socket部分
io.on('connection', function(socket) {
    //昵称设置
    //socket.on('login', function(nickname) {
    //    if (users.indexOf(nickname) > -1) {
    //        socket.emit('nickExisted');
    //    } else {
    //        socket.userIndex = users.length;
    //        socket.nickname = nickname;
    //        users.push(nickname);
    //        socket.emit('loginSuccess');
    //        io.sockets.emit('system', nickname); //向所有连接到服务器的客户端发送当前登陆用户的昵称
    //    };
    //});
//
//    在线统计
//
//    这里实现显示在线用户数及在聊天主界面中以系统身份显示用户连接离开等信息。
//
//上面server.js中除了loginSuccess事件，后面还有一句代码，通过io.sockets.emit
//    向所有用户发送了一个system事件，传递了刚登入用户的昵称，所有人接收到这个事件后，会在聊天窗口显示一条系统消息’某某加入了聊天室’。同时考虑到在前端我们无法得知用户是进入还是离开，所以在这个system事件里我们多传递一个数据来表明用户是进入还是离开。
//
//将server.js中login事件更改如下：
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
    //断开连接的事件
    socket.on('disconnect', function() {
        //将断开连接的用户从users中删除
        users.splice(socket.userIndex, 1);
        //通知除自己以外的所有人
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });
    //接收新消息
    socket.on('postMsg', function(msg,color) {
        //将消息发送到除自己外的所有用户
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //接收用户发来的图片
    socket.on('img', function(imgData) {
        //通过一个newImg事件分发到除自己外的每个用户
        socket.broadcast.emit('newImg', socket.nickname, imgData);
    });
});
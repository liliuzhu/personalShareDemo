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
const port = 8001
let path = require('path');
let express = require('express'), //引入express模块
   app = express(),
   server = require('http').createServer(app);
app.use(express.static(path.join(__dirname, 'static'))); //指定静态HTML文件的位置
app.get('/polling',function(req,res){
    res.end(new Date().toLocaleString());
});
app.get('/longPolling',function(req,res){
    setTimeout(_ => {
        res.end(new Date().toLocaleString());
    }, 5000)
});
let longConnectionTimer = null
app.get('/longConnection',function(req,res){
    let count = 0
    clearInterval(longConnectionTimer)
    res.writeHead(200, {
        'Content-Type': "text/event-stream",
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })
    longConnectionTimer = setInterval(_ => {
        console.log('longConnection-' + count++)
        const data = { timeStamp: Date.now() };
        res.write(`data: ${new Date().toLocaleString()}\n\n`);
    }, 2000)
});
app.get('/longConnection2',function(req,res){
    let count = 0
    clearInterval(longConnectionTimer)
    longConnectionTimer = setInterval(_ => {
        console.log('longConnection2-' + count++)
        let date = new Date().toLocaleString()
        res.write(`
           <script type="text/javascript">
             parent.document.getElementById('longConnection').innerHTML = "${date}";//改变父窗口dom元素
           </script>
         `)
    }, 2000)
});
app.get('/stopLongConnection',function(req,res){
    clearInterval(longConnectionTimer)
    res.end('stop');
})
server.listen(port);
server.setTimeout(0);   //设置不超时，所以服务端不会主动关闭连接
console.log('server started', 'http://127.0.0.1:' + port);
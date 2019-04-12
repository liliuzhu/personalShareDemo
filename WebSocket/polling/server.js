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
        if(res.socket._handle){
            console.log('longConnection-' + count++)
            const data = { timeStamp: Date.now() };
            res.write(`data: ${new Date().toLocaleString()}\n\n`);
        } else {
            console.log('longConnection-stop')
            clearInterval(longConnectionTimer)
            longConnectionTimer = null
            res.end('stop');
        }
    }, 1000)
});
app.get('/longConnection2',function(req,res){
    let count = 0
    clearInterval(longConnectionTimer)
    longConnectionTimer = setInterval(_ => {
        if (res.socket._handle) {
            console.log('longConnection2-' + count++)
            let date = new Date().toLocaleString()
            res.write(`
           <script type="text/javascript">
             parent.document.getElementById('longConnection').innerHTML = "${date}";//改变父窗口dom元素
           </script>
         `)
        } else {
            console.log('longConnection2-stop')
            clearInterval(longConnectionTimer)
            longConnectionTimer = null
        }
    }, 2000)
});
server.listen(port);
server.setTimeout(0);   //设置不超时，所以服务端不会主动关闭连接
console.log('server started', 'http://127.0.0.1:' + port);

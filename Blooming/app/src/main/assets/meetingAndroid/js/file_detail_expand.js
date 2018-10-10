/**
 * Created by Administrator on 2016/12/14.
 */
/*
 * jQuery电子画板
 */
var canvas,context,color;//画板参数
var background;//背景参数
var default_width,default_height;//画板默认大小
var base_width,base_height,$Ele;
var settings;//画板参数
var contact = [];//触点数组
var mouseEvent={x:0,y:0,color:"#000000"};
var offset;//偏移量
var background_img=new Image();//背景图片
background_img.src="";
var canvas_img=new Image();//canvas背景图片
canvas_img.src="";
var background_color="transparent";//背景颜色
var imageData;// 保存当前图像
var mouseDown=false;
var type="pencil";
var rubberSize=0;//橡皮尺寸
var rubberEle=null;//橡皮元素对象
var screenLock=true;//屏幕锁定
var drawPaths={};//将要绘制路径
var maxScale= 3.0;
var minScale= 0.5;
function removeEvent(){
    canvas.removeEventListener("touchstart",start,false);
    canvas.removeEventListener("touchmove",move,false);
    canvas.removeEventListener("touchend",end,false);

    canvas.removeEventListener("mousedown", mousedown, false);
    rubberEle&&rubberEle.removeEventListener("mousedown", mousedown, false);
    canvas.parentNode.removeEventListener("mousemove", mousemove, false);
    canvas.parentNode.removeEventListener("mouseleave", rubberToggle, false);
    canvas.parentNode.removeEventListener("mouseenter", rubberToggle, false);
    window.removeEventListener("mouseup", mouseup, false);
}
function addEvent() {
    canvas.addEventListener("touchstart", start, false);
    canvas.addEventListener("touchmove", move, false);
    canvas.addEventListener("touchend", end, false);

    canvas.addEventListener("mousedown", mousedown, false);
    rubberEle&&rubberEle.addEventListener("mousedown", mousedown, false);
    canvas.parentNode.addEventListener("mousemove", mousemove, false);
    canvas.parentNode.addEventListener("mouseleave", rubberToggle, false);
    canvas.parentNode.addEventListener("mouseenter", rubberToggle, false);
    window.addEventListener("mouseup", mouseup, false);
}
function rubberToggle(){
    if(type=="rubber"&&rubberEle){
        rubberEle.style.display=rubberEle.style.display=="block"?"none":"block";
    }
}
function start(event) {//起点
    is_synchronize&&removeSetAttr();//是否同步
    if(screenLock){
        stopDefaultEvent(event);
        stopBubble(event);
        if(event.touches.length==1){
            if(type=="pencil"){
                drawPaths.color=color;
                drawPaths.lineWidth=settings.lineWidth||8;
                $.each(event.touches, function (event, canvas) {
                    var i = canvas.identifier;//代表触摸点身份的独特标识符，同一个触摸点的身份标识符在不同的事件中保持不变 ,触电id
                    contact[i] = {
                        x: this.pageX - offset.left,//起点位置
                        y: this.pageY - offset.top
                    };
                    drawPaths.paths=[{x: contact[i].x.toFixed(2), y: contact[i].y.toFixed(2)}];
                });
            }else if(type=="rubber"&&rubberEle){
                rubberEle.style.display="block";
                $.each(event.touches, function (event, canvas) {
                    var i = canvas.identifier;//代表触摸点身份的独特标识符，同一个触摸点的身份标识符在不同的事件中保持不变 ,触电id
                    var x=this.pageX - offset.left;
                    var y=this.pageY - offset.top;
                    var top=y-rubberSize/2;
                    var left=x-rubberSize/2;
                    top=top>(canvas.target.height-rubberSize)?(canvas.target.height-rubberSize):top<0?0:top;
                    left=left>(canvas.target.width-rubberSize)?(canvas.target.width-rubberSize):left<0?0:left;
                    rubberEle.style.top=top+"px";
                    rubberEle.style.left=left+"px";
                    context.clearRect(left,top,rubberSize,rubberSize);
                    drawPaths.paths=[{x: left.toFixed(2), y: top.toFixed(2)}];
                });
            }
        }
    }
    else if(initTouchetPosition){
        if(event.touches.length==1){
            if(is_synchronize){
                if(top.is_spokesman){
                    var obj={x:event.touches[0].pageX-offset.left,y:event.touches[0].pageY-offset.top};
                    initTouchetPosition("start",obj);
                }
            }else{
                var obj={x:event.touches[0].pageX-offset.left,y:event.touches[0].pageY-offset.top};
                initTouchetPosition("start",obj);
            }
        }else{
            startPosition=null;
        }
    }
}
function move(event) {
    if(screenLock){
        stopDefaultEvent(event);
        stopBubble(event);
        if(event.touches.length==1){
            if(type=="pencil"){
                $.each(event.touches, function (event, canvas) {
                    var i = canvas.identifier;
                    var moveX = this.pageX - offset.left - contact[i].x;//水平移动距离
                    var moveY = this.pageY - offset.top - contact[i].y;//垂直移动距离
                    var now = draw(i, moveX, moveY);
                    contact[i].x = now.x;//move位置
                    contact[i].y = now.y;
                    drawPaths.paths.push({x: contact[i].x.toFixed(2), y: contact[i].y.toFixed(2)});
                });
            }
            else if(type=="rubber"&&rubberEle){
                rubberEle.style.display="block";
                $.each(event.touches, function (event, canvas) {
                    var i = canvas.identifier;
                    var x=this.pageX - offset.left;
                    var y=this.pageY - offset.top;
                    var top=y-rubberSize/2;
                    var left=x-rubberSize/2;
                    top=top>(canvas.target.height-rubberSize)?(canvas.target.height-rubberSize):top<0?0:top;
                    left=left>(canvas.target.width-rubberSize)?(canvas.target.width-rubberSize):left<0?0:left;
                    rubberEle.style.top=top+"px";
                    rubberEle.style.left=left+"px";
                    context.clearRect(left,top,rubberSize,rubberSize);
                    drawPaths.paths.push({x: left.toFixed(2), y: top.toFixed(2)});
                });
            }
        }
    }
}
function end(event){
    if(screenLock){
        stopDefaultEvent(event);
        stopBubble(event);
        if(type=="pencil"){
            //$.each(event.touches, function () {
            //    var i = canvas.identifier;
            //    if(i==0){
            //        context.closePath();//停止路径
            //    }
            //});
            sendUpdateCanvasData("pencil");
        }
        else if(type=="rubber"&&rubberEle){
            //$.each(event.touches, function () {
            //    var i = canvas.identifier;
            //    if(i==0){
            //
            //    }
            //});
            sendUpdateCanvasData("rubber");
        }
    }
    else if(initTouchetPosition){
        if(event.touches.length==0){
            if(is_synchronize){
                if(top.is_spokesman){
                    var obj={x:event.changedTouches[0].pageX-offset.left,y:event.changedTouches[0].pageY-offset.top};
                    initTouchetPosition("end",obj);
                }
            }else{
                var obj={x:event.changedTouches[0].pageX-offset.left,y:event.changedTouches[0].pageY-offset.top};
                initTouchetPosition("end",obj);
            }
        }else{
            endPosition=null;
        }
    }
}
function draw(id, x, y) {//绘制当前位置
    context.strokeStyle = color;
    context.lineWidth = settings.lineWidth;//轨迹宽度
    context.lineCap = settings.lineCap;//轨迹结束处的形状
    context.beginPath();//开始路径
    context.moveTo(contact[id].x, contact[id].y);//起点
    context.lineTo(contact[id].x + x, contact[id].y + y);
    context.stroke();//描边
    //context.closePath();//停止路径
    var obj={
        x: contact[id].x + x,
        y: contact[id].y + y
    };
    return obj;
}
////鼠标按下
function mousedown(e){//
    mouseDown=true;
    e=e||window.event;
    if(screenLock){
        e.preventDefault();
        if(type=="pencil") {
            mouseEvent ={
                x: e.offsetX,//起点位置
                y: e.offsetY,
                color: color
            };
        }
        else if(type=="rubber"&&rubberEle){
            var x=e.pageX - offset.left;
            var y=e.pageY - offset.top;
            var top=y-rubberSize/2;
            var left=x-rubberSize/2;
            top=top>(canvas.height-rubberSize)?(canvas.height-rubberSize):top<0?0:top;
            left=left>(canvas.width-rubberSize)?(canvas.width-rubberSize):left<0?0:left;
            rubberEle.style.top=top+"px";
            rubberEle.style.left=left+"px";
            mouseDown&&context.clearRect(left,top,rubberSize,rubberSize);
        }
    }
}
//鼠标移动
function mousemove(e){
    e=e||window.event;
    if(screenLock){
        e.preventDefault();
        if(type=="pencil") {
            var moveX = e.offsetX - mouseEvent.x;//水平移动距离
            var moveY = e.offsetY - mouseEvent.y;//垂直移动距离
            var now =(mouseDown&&mousedraw(mouseEvent,moveX, moveY));
            mouseEvent.x = now.x;//move位置
            mouseEvent.y = now.y;
        }
        else if(type=="rubber"&&rubberEle){
            var x=e.pageX - offset.left;
            var y=e.pageY - offset.top;
            var top=y-rubberSize/2;
            var left=x-rubberSize/2;
            top=top>(canvas.height-rubberSize)?(canvas.height-rubberSize):top<0?0:top;
            left=left>(canvas.width-rubberSize)?(canvas.width-rubberSize):left<0?0:left;
            rubberEle.style.top=top+"px";
            rubberEle.style.left=left+"px";
            mouseDown&&context.clearRect(left,top,rubberSize,rubberSize);
            //mouseDown&&alert(mouseDown);
        }
    }
}
//鼠标弹起
function mouseup(e){
    mouseDown=false;
    e=e||window.event;
    if(screenLock){
        e.preventDefault();
        //if(type=="pencil") {
        //    context.closePath();//停止路径
        //}
    }
}
//鼠标绘制
function mousedraw(mouseEvent,x,y){//绘制当前位置
    context.strokeStyle = mouseEvent.color;
    context.lineWidth = settings.lineWidth;//轨迹宽度
    context.lineCap = settings.lineCap;//轨迹结束处的形状
    context.beginPath();//开始路径
    context.moveTo(mouseEvent.x, mouseEvent.y);//起点
    context.lineTo(mouseEvent.x + x, mouseEvent.y + y);
    context.stroke();//描边
    //context.closePath();//停止路径
    var obj={
        x: mouseEvent.x + x,
        y: mouseEvent.y + y
    };
    return obj;
}
function changeBackgroundCanvasImg(isChangeFile){//更换背景画板的背景
    if(settings.backgroundImg&&background_img.src!=settings.backgroundImg){
        background_img.src=settings.backgroundImg;
        $("#canvas_parent").stop();
        if (background_img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            context.clearRect(0,0,canvas.width,canvas.height);
            background.src=background_img.src;
            if(isChangeFile){
                $("#canvas_parent").removeAttr("style");
                base_width=default_width=$Ele.getEleSize("width");
                base_height=default_height=$Ele.getEleSize("height");
                removeEvent();
                addEvent();
                //alert(default_width+"--1---"+default_height);
            }else{
                background.parentNode.style.height=default_height+"px";
                background.parentNode.style.width=default_width+"px";
                base_width=default_width;
                base_height=default_height;
                //alert(default_width+"---2---"+default_height);
            }
            changeScale(settings.callBack);
            settings.callBack="";
            return; // 直接返回，不用再处理onload事件
        }
        background_img.onload=function(){
            context.clearRect(0,0,canvas.width,canvas.height);
            background.src=background_img.src;
            if(isChangeFile){
                $("#canvas_parent").removeAttr("style");
                base_width=default_width=$Ele.getEleSize("width");
                base_height=default_height=$Ele.getEleSize("height");
                removeEvent();
                addEvent();
                //alert(default_width+"--1---"+default_height);
            }else{
                background.parentNode.style.height=default_height+"px";
                background.parentNode.style.width=default_width+"px";
                base_width=default_width;
                base_height=default_height;
                //alert(default_width+"---2---"+default_height);
            }
            changeScale(settings.callBack);
            settings.callBack="";
        };
        return false;
    }else{
        if(settings.callBack){
            settings.callBack();
            settings.callBack="";
        }
    }
    return true;
}
function changeCanvasImg(){//更换画板的数据
    if(settings.canvasImg){
        canvas_img.src=settings.canvasImg;
        if (canvas_img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(canvas_img,0,0,canvas.width,canvas.height);
            if(settings.callBack){
                settings.callBack();
                settings.callBack="";
            }
            return; // 直接返回，不用再处理onload事件
        }
        canvas_img.onload=function(){
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(canvas_img,0,0,canvas.width,canvas.height);
            if(settings.callBack){
                settings.callBack();
                settings.callBack="";
            }
        };
    }else if(settings.callBack){
        settings.callBack();
        settings.callBack="";
    }
}
function changeScale(callBack){//更改画板放大缩小
    //$(canvas).width(background.width).parent().width(background.width);
    canvas.width = canvas.offsetWidth;
    //$(canvas).height(background.height).parent().height(background.height);
    canvas.height = canvas.offsetHeight;
    callBack&&callBack();
}
//绘制目标路径
function updataPaths(data){
    var pathsObj=JSON.parse(data.drawPaths);
    context.lineCap = settings.lineCap;//轨迹结束处的形状
    context.lineWidth = pathsObj.lineWidth;//轨迹宽度
    context.strokeStyle = pathsObj.color;//描边颜色
    for(var i=0;i<pathsObj.paths.length;i++){
        context.beginPath();//开始路径
        if(i!=pathsObj.paths.length-1){
            context.moveTo(pathsObj.paths[i].x,pathsObj.paths[i].y);//起点
            context.lineTo(pathsObj.paths[i+1].x,pathsObj.paths[i+1].y);
            context.stroke();//描边
        }
    }
    if(settings.callBack){
        settings.callBack();
        settings.callBack="";
    }
}
//擦除目标路径
function clearPaths(data){
    var pathsObj=JSON.parse(data.drawPaths);
    for(var i=0;i<pathsObj.paths.length;i++){
        context.clearRect(parseFloat(pathsObj.paths[i].x),parseFloat(pathsObj.paths[i].y),data.rubberSize,data.rubberSize);
    }
    if(settings.callBack){
        settings.callBack();
        settings.callBack=""
    }
}
//插件主题
(function($) {
    $.fn.CanvasDrawr = function(options) {
        //默认参数
        var defaults = {
            background:"background",//背景canvas的ID
            type:"pencil",//方式
            rubberEle:"rubber_box",//橡皮ID
            color:"black",//画笔颜色
            doing:"init",//要做什么
            lineWidth:"8",//画笔粗细
            lineCap:"round",//画笔
            backgroundColor:"transparent",//背景颜色
            screenLock:true,//锁定屏幕
            backgroundImg:"",//背景图片src
            canvasImg:'',//画板图片
            pathsData:"",//一个完整的路径
            callBack:""
        };
        settings = $.extend(defaults,settings, options || {});
        canvas = $(this).get(0);
        context = canvas.getContext("2d");
        settings.background&&(background=$("#"+settings.background).get(0));
        context.globalAlpha=1;
        //imageData = maskContext.getImageData(0,0,mask.width,mask.height);//获取图片信息
        screenLock=settings.screenLock;
        screenLock?$("#canvas_box").css("overflow","hidden"):$("#canvas_box").css("overflow","auto");
        type=settings.type;
        color=settings.color;
        offset = $(canvas).offset();//偏移量
        //imageData = canvas.toDataURL(' image/png',1.0);//获取图片信息base64
        if(document.getElementById(settings.rubberEle)){//橡皮功能设置
            rubberEle=document.getElementById(settings.rubberEle);
            rubberSize=$(rubberEle).width();
            document.getElementById(settings.rubberEle)&&(rubberEle.style.display="none");
        }
        if(settings.doing=="init"){
            settings.backgroundColor&&(background_color=settings.backgroundColor);
            settings.backgroundImg&&(background_img.src=settings.backgroundImg);
            if (background_img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
                background.src=background_img.src;
                base_width=default_width=$Ele.getEleSize("width");
                base_height=default_height=$Ele.getEleSize("height");
                //alert(default_width+"---3---"+default_height);
                changeScale(settings.callBack);
                settings.callBack="";
                removeEvent();
                addEvent();
                return ;
            }
            background_img.onload=function(){
                background.src=background_img.src;
                base_width=default_width=$Ele.getEleSize("width");
                base_height=default_height=$Ele.getEleSize("height");
                //alert(default_width+"---3---"+default_height);
                changeScale(settings.callBack);
                settings.callBack="";
                removeEvent();
                addEvent();
                //setTimeout(function(){
                //
                //},30);
            };
        }
        else if(settings.doing=="changeBackgroundImg"){//更换背景图片
            changeBackgroundCanvasImg(false);
        }
        else if(settings.doing=="changeFile"){//更换文件
            changeBackgroundCanvasImg(true);
        }
        else if(settings.doing=="putImageData"){//绘制复制的图片
            //backContext.clearRect(0,0,background.width,background.height);//清除背景
            //alert(canvas.height);
            context.putImageData(imageData,0,0,0,0,canvas.width,canvas.height);
            if(settings.callBack){
                settings.callBack();
                settings.callBack="";
            }
        }
        else if(settings.doing=="changeCanvasData"){//更换canvas数据
            changeCanvasImg();
        }
        else if(settings.doing=="drawPaths"){//更新画板路径数据数据
            updataPaths(settings.pathsData);
            settings.pathsData="";
        }
        else if(settings.doing=="clearPaths"){//擦除路径数据数据
            clearPaths(settings.pathsData);
            settings.pathsData="";
        }
        else if(settings.doing=="synchronize"){//被同步所有数据
            changeBackgroundCanvasImg()&&changeCanvasImg();
        }
        else if(settings.doing=="changeBackgroundColor"){//更换背景颜色
            if(settings.backgroundColor&&background_color!=settings.backgroundColor){
                settings.backgroundColor&&(background_color=settings.backgroundColor);
                if(background){
                    backContext.clearRect(0,0,background.width,background.height);//清除背景
                    backContext.fillStyle=background_color;
                    //context.fillRect(0,0,0);==context.rect(10,10,100,100);//设置矩形形状+ context.fill();//绘制实心
                    backContext.beginPath();//表示开发创建路径
                    backContext.rect(0,0,background.width,background.height);//设置矩形形状
                    backContext.closePath();//表示开发创建路径
                    backContext.fill();//绘制实心
                }
            }
        }
        //settings.doing=="init"&&(removeEvent(),addEvent(),alert("init3"));
};
    //清除目标canvas
    $.fn.clearCanvas=function(callBack){
        var target_canvas = $(this).get(0);
        var target_context = canvas.getContext("2d");
        target_context.clearRect(0,0,target_canvas.width,target_canvas.height);
        target_canvas=null;
        target_context=null;
        callBack&&callBack();
    };
    //获取目标canvas图片base64数据
    $.fn.getCanvasURL=function(){
        return $(this).get(0).toDataURL(' image/png',1.0);
    };
    //复制目标画布上指定矩形的像素数据
    $.fn.getImageData=function(){
        var target_canvas = $(this).get(0);
        return target_canvas.getContext("2d").getImageData(0,0,target_canvas.width,target_canvas.height);
    };
    //获取元素的原始高度
    $.fn.getEleSize=function(type){
        var EleThis=$(this).get(0);
        if(getComputedStyle(EleThis)){
            if(type=="height"){
                return Math.round(parseFloat(getComputedStyle(EleThis).height));
            }else if(type=="width"){
                return Math.round(parseFloat(getComputedStyle(EleThis).width));
            }

        }else{
            if(type=="height"){
                return Math.round(parseFloat(EleThis.currentStyle.height));
            }else if(type=="width"){
                return Math.round(parseFloat(EleThis.currentStyle.width));
            }
        }
        return 0;
    };
})(jQuery);
//画板控件设置
function canvasControl(the,event){//画板控件显示与消失
    $(the).parent("li").toggleClass("set_attr").siblings("li").removeClass("set_attr");
    event&&stopBubble(event);
}




//自定义多触点事件
function setGesture(el){
    var obj={}; //定义一个对象
    var istouch=false;
    var start=[];
    var touchNum=0;
    el.addEventListener("touchstart",function(e){
        ++touchNum;
        if(e.touches.length>=2&&touchNum>=2){  //判断是否有两个点在屏幕上
            event.preventDefault?event.preventDefault():event.returnValue = false;
            istouch=true;
            start=e.touches;  //得到第一组两个点
            obj.gesturestart&&obj.gesturestart.call(el); //执行gesturestart方法
        }
    },false);
    el.addEventListener("touchmove",function(e){
        if(e.touches.length>=2&&istouch){
            event.preventDefault?event.preventDefault():event.returnValue = false;
            var now=e.touches;  //得到第二组两个点
            var scale=getDistance(now[0],now[1])/getDistance(start[0],start[1]); //得到缩放比例，getDistance是勾股定理的一个方法
            var rotation=getAngle(now[0],now[1])-getAngle(start[0],start[1]);  //得到旋转角度，getAngle是得到夹角的一个方法
            e.scale=scale.toFixed(2);
            e.rotation=rotation.toFixed(2);
            obj.gesturemove&&obj.gesturemove.call(el,e);  //执行gesturemove方法
        }
    },false);
    document.addEventListener("touchend",function(e){
        if(istouch){
            obj.gestureend&&obj.gestureend.call(el);  //执行gestureend方法
        }
        touchNum=0;
        istouch=false;
    },false);
    return obj;
}
function getDistance(p1, p2) {
    var x = p2.pageX - p1.pageX,
        y = p2.pageY - p1.pageY;
    return Math.sqrt((x * x) + (y * y));
}
function getAngle(p1, p2) {
    var x = p1.pageX - p2.pageX,
        y = p1.pageY- p2.pageY;
    return Math.atan2(y, x) * 180 / Math.PI;
}
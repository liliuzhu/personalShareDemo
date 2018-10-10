/**
 * Created by Administrator on 2016/12/14.
 */
/*
 * jQuery电子画板
 */
var canvas,context,color;//画板参数
var background;//背景参数
var default_width,default_height;//画板默认大小
var base_width,base_height,$Parent;
var settings;//画板参数
var contact = [];//触点数组
var mouseEvent={x:0,y:0,color:"#000000"};
//var offset;//偏移量
var background_img=new Image();//背景图片
background_img.src="";
var canvas_img=new Image();//canvas背景图片
canvas_img.src="";
var background_color="transparent";//背景颜色
//var imageData;// 保存当前图像
var mouseDown=false;
var type="pencil";
var rubberSize=0;//橡皮尺寸
var rubberEle=null;//橡皮元素对象
var screenLock=true;//屏幕锁定
var drawPaths=null;//将要绘制路径
var maxScale= 3.0;
var minScale= 0.5;
function removeEvent(){
    canvas.removeEventListener("touchstart",start,false);
    canvas.removeEventListener("touchmove",move,false);
    canvas.removeEventListener("touchend",end,false);

    //canvas.removeEventListener("mousedown", mousedown, false);
    //rubberEle&&rubberEle.removeEventListener("mousedown", mousedown, false);
    //canvas.parentNode.removeEventListener("mousemove", mousemove, false);
    //canvas.parentNode.removeEventListener("mouseleave", rubberToggle, false);
    //canvas.parentNode.removeEventListener("mouseenter", rubberToggle, false);
    //window.removeEventListener("mouseup", mouseup, false);
}
function addEvent() {
    canvas.addEventListener("touchstart", start, false);
    canvas.addEventListener("touchmove", move, false);
    canvas.addEventListener("touchend", end, false);

    //canvas.addEventListener("mousedown", mousedown, false);
    //rubberEle&&rubberEle.addEventListener("mousedown", mousedown, false);
    //canvas.parentNode.addEventListener("mousemove", mousemove, false);
    //canvas.parentNode.addEventListener("mouseleave", rubberToggle, false);
    //canvas.parentNode.addEventListener("mouseenter", rubberToggle, false);
    //window.addEventListener("mouseup", mouseup, false);
}
function rubberToggle(){
    if(type=="rubber"&&rubberEle){
        rubberEle.style.display=rubberEle.style.display=="block"?"none":"block";
    }
}
function start(event) {//起点
    removeSetAttr();
    var offset=$(event.target).offset();
    if(screenLock){
        stopDefaultEvent(event);
        stopBubble(event);
        if(top.is_spokesman){
            if(event.touches.length==1){
                if(type=="pencil"){
                    drawPaths={color:color,lineWidth:settings.lineWidth||8};
                    $.each(event.touches, function (index, touche) {
                        var i = touche.identifier;//代表触摸点身份的独特标识符，同一个触摸点的身份标识符在不同的事件中保持不变 ,触电id
                        contact[i] = {
                            x: this.pageX - offset.left,//起点位置
                            y: this.pageY - offset.top
                        };
                        drawPaths.paths=[{x: contact[i].x.toFixed(2), y: contact[i].y.toFixed(2)}];
                    });
                }else if(type=="rubber"&&rubberEle){
                    drawPaths={};
                    rubberEle.style.display="block";
                    $.each(event.touches, function (index, touche) {
                        var i = touche.identifier;//代表触摸点身份的独特标识符，同一个触摸点的身份标识符在不同的事件中保持不变 ,触电id
                        var x=this.pageX - offset.left;
                        var y=this.pageY - offset.top;
                        var top=y-rubberSize/2;
                        var left=x-rubberSize/2;
                        top=top>(touche.target.height-rubberSize)?(touche.target.height-rubberSize):top<0?0:top;
                        left=left>(touche.target.width-rubberSize)?(touche.target.width-rubberSize):left<0?0:left;
                        rubberEle.style.top=top+"px";
                        rubberEle.style.left=left+"px";
                        context.clearRect(left,top,rubberSize,rubberSize);
                        drawPaths.paths=[{x: left.toFixed(2), y: top.toFixed(2)}];
                    });
                }
            }
        }
    }
    else{
        if(event.touches.length==1){
            if(!is_synchronize||(is_synchronize&&top.is_spokesman)){
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
        if(top.is_spokesman){
            var offset=$(event.target).offset();
            if(event.touches.length==1){
                if(type=="pencil"){
                    $.each(event.touches, function (index, touche) {
                        var i = touche.identifier;
                        var moveX = this.pageX - offset.left - contact[i].x;//水平移动距离
                        var moveY = this.pageY - offset.top - contact[i].y;//垂直移动距离
                        contact[i] = draw(contact[i], moveX, moveY);
                        drawPaths.paths.push({x: contact[i].x.toFixed(2), y: contact[i].y.toFixed(2)});
                    });
                }
                else if(type=="rubber"&&rubberEle){
                    rubberEle.style.display="block";
                    $.each(event.touches, function (index, touche) {
                        var x=this.pageX - offset.left;
                        var y=this.pageY - offset.top;
                        var top=y-rubberSize/2;
                        var left=x-rubberSize/2;
                        top=top>(touche.target.height-rubberSize)?(touche.target.height-rubberSize):top<0?0:top;
                        left=left>(touche.target.width-rubberSize)?(touche.target.width-rubberSize):left<0?0:left;
                        rubberEle.style.top=top+"px";
                        rubberEle.style.left=left+"px";
                        context.clearRect(left,top,rubberSize,rubberSize);
                        drawPaths.paths.push({x: left.toFixed(2), y: top.toFixed(2)});
                    });
                }
            }
        }
    }
}
function end(event){
    var offset=$(event.target).offset();
    if(screenLock){
        stopDefaultEvent(event);
        stopBubble(event);
        if(top.is_spokesman){
            if(type=="pencil"){
                if(drawPaths.paths.length>1){
                    sendUpdateCanvasData("pencil",drawPaths);
                }
            }
            else if(type=="rubber"&&rubberEle){
                sendUpdateCanvasData("rubber",drawPaths);
            }
        }
        drawPaths=null;
    }
    else{
        if(event.changedTouches.length==1){
            if(!is_synchronize||(is_synchronize&&top.is_spokesman)){
                var obj={x:event.changedTouches[0].pageX-offset.left,y:event.changedTouches[0].pageY-offset.top};
                initTouchetPosition("end",obj);
            }
        }else{
            endPosition=null;
        }
    }
}
function draw(obj, x, y) {//绘制当前位置
    context.strokeStyle = color;
    context.lineWidth = settings.lineWidth;//轨迹宽度
    context.lineCap = settings.lineCap;//轨迹结束处的形状
    context.beginPath();//开始路径
    context.moveTo(obj.x, obj.y);//起点
    context.lineTo(obj.x + x, obj.y + y);
    context.stroke();//描边
    //context.closePath();//停止路径
    return {
        x: obj.x + x,
        y: obj.y + y
    };
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
function changeBackgroundCanvasImg(isChangeFile,callBack){//更换背景画板的背景
    if(settings.backgroundImg&&background.src!=settings.backgroundImg){
        $("#canvas_parent").stop();//停止未结束动画
        context.clearRect(0,0,canvas.width,canvas.height);
        base_height=default_height;
        background_img.src=settings.backgroundImg;
        background_img.onload=null;
        if (background_img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            background.src=background_img.src;
            //top.openCustomTap("complete");
            base_width=default_width=Math.round(default_height*background_img.naturalWidth/background_img.naturalHeight);
            $Parent.css({height:default_height,width:default_width,"margin-top":0});
            //picture_loaded=true;
            changeScale(callBack);
            return;
        }
        background_img.onload=function(){
            background.src=background_img.src;
            //top.openCustomTap("onload");
            //picture_loaded=true;
            //changeScale(callBack);
            //if(isChangeFile){
            //    removeEvent();
            //    addEvent();
            //    //alert(default_width+"--1---"+default_height);
            //}else{
            //    //background.parentNode.style.marginTop="0px";
            //    //background.parentNode.style.height=default_height+"px";
            //    //background.parentNode.style.width=default_width+"px";
            //    //base_width=default_width;
            //    //base_height=default_height;
            //    //alert(default_width+"---2---"+default_height);
            //}
        };
        background.src=background_img.src.replace(".png","s.png");
        base_width=default_width=Math.round(default_height*background.naturalWidth/background.naturalHeight);
        $Parent.css({height:default_height,width:default_width,"margin-top":0});
        changeScale(callBack);
    }else{
        callBack&&callBack();
    }
    return true;
}
function changeCanvasData(src,callBack){//更换画板数据changeBackgroundImg
    if(src) {
        context.clearRect(0,0,canvas.width,canvas.height);
        canvas_img.src=src;
        canvas_img.onload=null;
        if (canvas_img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            context.drawImage(canvas_img,0,0,canvas.width,canvas.height);
            callBack&&callBack();
            return;
        }
        canvas_img.onload=function(){
            context.drawImage(canvas_img,0,0,canvas.width,canvas.height);
            callBack&&callBack();
        };
    }else{
        callBack&&callBack();
    }
}
//function changeCanvasImg(callBack){//更换画板的数据
//
//}
//function changeCanvasImg(callBack){//更换画板的数据
//    if(settings.canvasImg) {
//        context.clearRect(0,0,canvas.width,canvas.height);
//        canvas_img.src=settings.canvasImg;
//        if (canvas_img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
//            context.drawImage(canvas_img,0,0,canvas.width,canvas.height);
//            callBack&&callBack();
//            return;
//        }
//        canvas_img.onload=function(){
//            canvas_img.onload=function(){};
//            context.drawImage(canvas_img,0,0,canvas.width,canvas.height);
//            callBack&&callBack();
//        };
//    }else{
//        callBack&&callBack();
//    }
//}
function changeScale(callBack){//更改画板放大缩小
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    callBack&&callBack();
}
//绘制目标路径
function updataPaths(data,callBack){
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
    callBack&&callBack();
}
//擦除目标路径
function clearPaths(data,callBack){
    var pathsObj=JSON.parse(data.drawPaths);
    for(var i=0;i<pathsObj.paths.length;i++){
        context.clearRect(parseFloat(pathsObj.paths[i].x),parseFloat(pathsObj.paths[i].y),data.rubberSize,data.rubberSize);
    }
    callBack&&callBack();
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
            //canvasImg:'',//画板图片
            pathsData:"",//一个完整的路径
            callBack:""
        };
        settings = $.extend(defaults,settings, options || {});
        canvas = $(this).get(0);
        context = canvas.getContext("2d");
        context.globalAlpha=1;
        settings.background&&(background=$("#"+settings.background).get(0));
        //imageData = maskContext.getImageData(0,0,mask.width,mask.height);//获取图片信息
        screenLock=settings.screenLock;
        screenLock?$("#canvas_box").css("overflow","hidden"):$("#canvas_box").css("overflow","auto");
        type=settings.type;
        color=settings.color;
        //offset = $(canvas).offset();//偏移量
        //imageData = canvas.toDataURL(' image/png',1.0);//获取图片信息base64
        if(document.getElementById(settings.rubberEle)){//橡皮功能设置
            rubberEle=document.getElementById(settings.rubberEle);
            rubberSize=$(rubberEle).width();
            document.getElementById(settings.rubberEle)&&(rubberEle.style.display="none");
        }
        if(settings.doing=="init"){
            removeEvent();
            addEvent();
            context.clearRect(0,0,canvas.width,canvas.height);
            base_height=default_height;
            settings.backgroundColor&&(background_color=settings.backgroundColor);
            settings.backgroundImg&&(background_img.src=settings.backgroundImg);
            background_img.onload=null;
            if (background_img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
                background.src=background_img.src;
                base_width=default_width=Math.round(default_height*background_img.naturalWidth/background_img.naturalHeight);
                isShowPicList(document.getElementById("togglePicListIcon"),default_height>default_width?true:false);
                $Parent.css({height:default_height,width:default_width,"margin-top":0});
                //picture_loaded=true;
                changeScale(settings.callBack);
                settings.callBack="";
                return;
            }
            background_img.onload=function(){
                background.src=background_img.src;
                //base_width=default_width=$Parent.getEleSize("width");
                //base_height=default_height=$Parent.getEleSize("height");
                //$Parent.height(default_height).width(default_width);
                //background.style.width="100%";
                //picture_loaded=true;
                //changeScale(settings.callBack);
                //settings.callBack="";
            };
            background.src=background_img.src.replace(".png","s.png");
            //picture_loaded=false;
            base_width=default_width=Math.round(default_height*background.naturalWidth/background.naturalHeight);
            isShowPicList(document.getElementById("togglePicListIcon"),default_height>default_width?true:false);
            $Parent.css({height:default_height,width:default_width,"margin-top":0});
            changeScale(settings.callBack);
            settings.callBack="";
        }
        else if(settings.doing=="changeBackgroundImg"){//更换背景图片
            changeBackgroundCanvasImg(false,settings.callBack);
            settings.callBack="";
        }
        else if(settings.doing=="changeFile"){//更换文件
            changeBackgroundCanvasImg(true,settings.callBack);
            settings.callBack="";
        }
        else if(settings.doing=="drawPaths"){//更新画板路径数据数据
            updataPaths(settings.pathsData,settings.callBack);
            settings.callBack=settings.pathsData="";
        }
        else if(settings.doing=="clearPaths"){//擦除路径数据数据
            clearPaths(settings.pathsData,settings.callBack);
            settings.callBack=settings.pathsData="";
        }
        //else if(settings.doing=="synchronize"){//被同步所有数据
        //    changeBackgroundCanvasImg()&&changeCanvasImg();
        //}
        //else if(settings.doing=="changeBackgroundColor"){//更换背景颜色
        //    if(settings.backgroundColor&&background_color!=settings.backgroundColor){
        //        settings.backgroundColor&&(background_color=settings.backgroundColor);
        //        if(background){
        //            backContext.clearRect(0,0,background.width,background.height);//清除背景
        //            backContext.fillStyle=background_color;
        //            //context.fillRect(0,0,0);==context.rect(10,10,100,100);//设置矩形形状+ context.fill();//绘制实心
        //            backContext.beginPath();//表示开发创建路径
        //            backContext.rect(0,0,background.width,background.height);//设置矩形形状
        //            backContext.closePath();//表示开发创建路径
        //            backContext.fill();//绘制实心
        //        }
        //    }
        //}
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

//画板控件设置
function canvasControl(the,event){//画板子控件显示与消失
    $(the).parent("li").toggleClass("set_attr").siblings("li").removeClass("set_attr");
    event&&stopBubble(event);
}
/*******************同步参会与文件浏览共用方法***************************/
//初始化事件
function initEvent(){
    var boxGesture=setGesture(document.querySelector("#canvas_parent"));  //得到一个对象
    boxGesture.gesturestart=function(){//双指开始
        if((is_synchronize&&top.is_spokesman)||!is_synchronize){
            is_canChangeStatus=false;

        }
    };
    boxGesture.gesturemove=function(e){  //双指移动
        if((is_synchronize&&top.is_spokesman)||!is_synchronize){
            $(this).css({
                height:base_height*e.scale,
                width:base_width*e.scale,
                "margin-top":base_height*e.scale<canvas_boxHeight?(canvas_boxHeight-base_height*e.scale)/2:0
            });
        }
    };
    boxGesture.gestureend=function(){  //双指结束
        if((is_synchronize&&top.is_spokesman)||!is_synchronize){
            if(background.width>default_width*maxScale){
                $(this).animate({"width":default_width*maxScale,"height":default_height*maxScale},300,initBaseScale)
            }else if(background.width<default_width*minScale){
                $(this).animate({"width":default_width*minScale,"height":default_height*minScale,"margin-top":(canvas_boxHeight-default_height*minScale)/2},300,initBaseScale)
            }else{
                initBaseScale();
            }
        }
    };
    $("#canvas_parent").on("click",canvasDoubleClick);
    $("#file_img_list").on("click","li",function(e){
        if(is_synchronize){//是否同步，同步的话只能由主讲人控制
            if(!$(this).hasClass("this")&&top.is_spokesman&&is_canChangeStatus){
                is_canChangeStatus=false;
                curPage= $(this).attr("value");
                changeBackgroundImg(getLabelImageListOnly);
                sendChangeBackgroundImg();
            }
        }else{//不同步的话，可以随意的查看
            if(!$(this).hasClass("this")){
                curPage= $(this).attr("value");
                changeBackgroundImg();
            }
        }
    });
    //滚动停止事件
    $("#canvas_box").on("scrollstop",function(){
        is_synchronize&&top.is_spokesman&&sendMoveViewport();
    });
}
//双击判断
function canvasDoubleClick(){
    if((is_synchronize&&top.is_spokesman)||!is_synchronize){
        if( new Date().getTime() - clickTime < 500 ){
//                    console.log(default_width,default_height);
            is_canChangeStatus=false;
            //alert(background.height);
            //alert(default_height);
            if($Parent.height()==default_height){//原尺寸
                $("#canvas_parent").animate({width:default_width*2,height:default_height*2,"margin-top":0},300,initBaseScale)
            }else{
                $("#canvas_parent").animate({width:default_width,height:default_height,"margin-top":0},300,initBaseScale)
            }
        }else{
            clickTime = new Date().getTime();
        }
    }
}
//初始化画板基础规模以及恢复数据并发送信息
function initBaseScale(){
    is_canChangeStatus=true;
    base_width=$Parent.getEleSize("width");
    base_height=$Parent.getEleSize("height");
    //$("#background").attr("style")||$("#background").css("width","100%");
    changeScale(function(){
        is_synchronize&&top.is_spokesman&&(sendBoardScale(),recoverBase64());//发送图片规模,并绘制数据
    });
}
//打包图片路径
function getPicPath(i,icon){
    return getLocalData("picLoadPath")+'/file/'+fileId+'/'+(icon?i+"s":i)+'.png';
}
//获取文件名称
function getDocTitle(id,status){
    var aoData=[];
    aoData.push( { "name": "meetingDoc.id", "value": id } );
    var xurl="/actions/MeetingDoc.action?getMeetingDocById";
    sendAjaxRequest(xurl,aoData,
        function (data) {
            if (data.status == true) {
                $("#doc_title").html(data.body.doc_title);
            } else {
                if(status){
                    showInfoWinWarn("文件名称获取失败" + obj.msg);
                }else{
                    getDocTitle(id,true);
                }
            }
        }, function () {
            if(status){
                showInfoWinWarn("文件名称获取失败" + obj.msg);
            }else{
                getDocTitle(id,true);
            }
        }
    );
}

//初始化(加载)图片列表
function initFilePicList(start){
    var i=start?parseInt(start):1;
    if(i<=imageCount){
        $("#icon_progress").html(Math.round(i*100/imageCount));
        $("#file_img_list").append('<li value="'+i+'" '+(i==curPage?'class="this"':'')+'><span>' + i + '</span><div><img onload="initFilePicList('+(i+1)+');" src="'+getPicPath(i,"s")+'"></div></li>');
    }else{
        is_loaded=true;
        initHuaban(function () {
            is_synchronize?getSynchronizeData():(is_canChangeStatus = true);
            //changeFile(function () {});
        });
        if($("body").attr("class")=="file_detail"){
            closeLoadingToast(setGuide);
        }else{
            closeLoadingToast();
        }
        if(getUrlParam(document.URL,"docTitle")){
            $("#doc_title").html(decodeURIComponent(getUrlParam(document.URL,"docTitle")));
        }else{
            getDocTitle(fileId);
        }
    }
}
//加载全部图片列表
//function loadImglist(start){
//    for(var i= 1,ht="";i<=imageCount;i++){
//        //ht+='<li value="'+i+'" '+(i==curPage?'class="this"':'')+'><span>' + i + '</span><div>'+(Math.abs(curPage-i)<=loadPicNum?'<img onload="" src="'+getPicPath(i)+'">':'')+'</div></li>';
//        ht+='<li value="'+i+'" '+(i==curPage?'class="this"':'')+'><span>' + i + '</span><div><img src="'+getPicPath(1)+'"></div></li>';
//    }
//    $("#file_img_list").html(ht);
//}
function initHuaban(callBack) {//初始化画板
    $('#meeting_drawing_board').CanvasDrawr({
        doing:"init",
        background:"background",
        type:"pencil",
        rubberEle:"rubber_box",
        screenLock:false,
        backgroundImg:getPicPath(curPage),//$("#file_img_list .this img").attr("src"),
        callBack:callBack?callBack:""
    });
    trackingLocation();
}
////更换文件
//function changeFile(callBack){
//    alert("changeFile");
//    $('#meeting_drawing_board').CanvasDrawr({
//        doing:"changeFile",
//        backgroundImg:getPicPath(curPage),
//        callBack:callBack?callBack:""
//    });
//    trackingLocation();
//}
//更换背景图片
function changeBackgroundImg(callBack){
    var  prevPage=$("#file_img_list li.this").attr("value")>>>0;
    if(prevPage<curPage){
        $("#virtual_page").attr("src",background.src).addClass("nextPage").one(whichAnimationEvent(),function(){
            $(this).removeClass("nextPage");
        });
    }
    else if(prevPage>curPage){
        $("#virtual_page").attr("src",background.src);
    }
    $('#meeting_drawing_board').CanvasDrawr({
        doing:"changeBackgroundImg",
        backgroundImg:getPicPath(curPage),
        callBack:callBack?callBack:""
    });
    if(prevPage>curPage){
        $("#background").addClass("prevPage").one(whichAnimationEvent(),function(){
            $(this).removeClass("prevPage");
        });
    }
    //var  prevPage=$("#file_img_list li.this").attr("value")>>>0;
    //if(prevPage<curPage){
    //    $("#turn_page").addClass("nextPage1").one(whichAnimationEvent(),function(){
    //        $(this).removeClass("nextPage1");
    //    });
    //}else if(prevPage>curPage){
    //    $("#canvas_box").addClass("prevPage").one(whichAnimationEvent(),function(){
    //        $(this).removeClass("prevPage");
    //    });
    //}
    cacheBase64 = null;
    trackingLocation();
}
//当前图片位置定位追踪
function trackingLocation(){
    var $file_img_list=$("#file_img_list"),
        curPageLi=$file_img_list.find("li[value="+curPage+"]");
    curPageLi.addClass("this").siblings("li.this").removeClass("this");
    $file_img_list.stop().animate({scrollTop:curPageLi[0].offsetTop+curPageLi[0].offsetHeight/2-canvas_boxHeight/2-100},300,function(){});
}
//上一页或下一页
function prevNextPage(type){
    if(type=="prev"){
        if(curPage<=1){
            top.openCustomTap("当前页为首页，无上一页！", 2000);
        }
        else{
            if(top.is_spokesman&&is_synchronize){
                if(is_canChangeStatus){
                    is_canChangeStatus=false;
                    curPage--;
                    sendChangeBackgroundImg();
                    changeBackgroundImg(getLabelImageListOnly);
                }
            }else{
                curPage--;
                changeBackgroundImg();
            }
        }
    }else if(type=="next"){
        if(curPage>=imageCount){
            top.openCustomTap("当前页为尾页，无下一页！", 2000);
        }else{
            if(top.is_spokesman&&is_synchronize){
                if(is_canChangeStatus){
                    is_canChangeStatus=false;
                    curPage++;
                    sendChangeBackgroundImg();
                    changeBackgroundImg(getLabelImageListOnly);
                }
            }else{
                curPage++;
                changeBackgroundImg();
            }
        }
    }
}
//初始化开始与结束位置
function initTouchetPosition(type,obj){
    var viewW =$("#canvas_box").getEleSize("width"),//Math.round(parseFloat(getComputedStyle(canvas_box).width)),//可见宽度
        contentW =$("#canvas_parent").getEleSize("width"),//Math.round(parseFloat(getComputedStyle(canvas_box.getElementsByTagName("div")[0]).width)),//内容宽度
        scrollLeft =$("#canvas_box").scrollLeft();//滚动宽度
    if(viewW>=contentW){ //到达右侧底部时或者小于可见宽度时
        if(type=="start"){
            startPosition=obj
        }else{
            endPosition=obj;
            startPosition&&endPosition&&changePage();
        }
    }
    else if(viewW<contentW&&(viewW+scrollLeft)/contentW>=0.99){
        if(type=="start"){
            startPosition=obj;
            startPosition.position="right";
        }else{
            endPosition=obj;
            endPosition.position="right";
            startPosition&&endPosition&&startPosition.position==endPosition.position&&changePage();
        }
    }else if(viewW<contentW&&scrollLeft<=0){
        if(type=="start"){
            startPosition=obj;
            startPosition.position="left";
        }else{
            endPosition=obj;
            endPosition.position="left";
            startPosition&&endPosition&&startPosition.position==endPosition.position&&changePage();
        }
    }else{
        endPosition=startPosition=null;
    }
}
//更换页面
function changePage(){
    if(Math.abs(endPosition.x-startPosition.x)>Math.abs(endPosition.y-startPosition.y)&&Math.abs(endPosition.x-startPosition.x)>($(window).width()*0.15)){
        endPosition.x>startPosition.x?prevNextPage("prev"): prevNextPage("next");
    }
    endPosition=startPosition=null;
}
//折叠图片列表
function togglePicList(the){
    $(".footer_control").removeClass("show");
    $("#file_img_box").toggleClass("show");
    toggleImgStrokeOrFill(the);
    toggleImgStrokeOrFill(document.getElementById("toggleFileEditIcon"),false);
    $('#meeting_drawing_board').CanvasDrawr({
        doing:"set",
        screenLock:false
    });
}
//是否显示列表
function isShowPicList(the,status){
    if(status){
        $("#file_img_box").addClass("show");
        toggleImgStrokeOrFill(the,true);
    }else{
        $("#file_img_box").removeClass("show");
        toggleImgStrokeOrFill(the,false);
    }
    $(".footer_control").removeClass("show");
    toggleImgStrokeOrFill(document.getElementById("toggleFileEditIcon"),false);
    $('#meeting_drawing_board').CanvasDrawr({
        doing:"set",
        screenLock:false
    });
}
//头部右侧控件改变img图片的空心与实心
function toggleImgStrokeOrFill(the,status){
    if(the&&status==true){
        $(the).attr("src").indexOf("red")==-1&&$(the).attr("src",$(the).attr("src").replace(".png","_red.png"));
    }
    else if(the&&status==false){
        //console.log($(the).attr("src"));
        $(the).attr("src").indexOf("red")==-1||$(the).attr("src",$(the).attr("src").replace("_red",""));
    }
    else if(the){
        $(the).attr("src").indexOf("red")==-1? $(the).attr("src",$(the).attr("src").replace(".png","_red.png")):$(the).attr("src",$(the).attr("src").replace("_red",""));
    }
}
//取消子选项
function removeSetAttr(){
    $(".footer_control .set_attr").removeClass("set_attr");
}
/**
 * Created by Administrator on 2017/3/17.
 */
//全局变量
var is_spokesman=false;//是否为发言人
var web_socket=null;//websocket连接
var keepWatchOn_soket=null;//监视器
var webSocketInitData=null;//socket初始化数据即在线人数组
var webSoketAutoCut=true;//webSoket是否是自动关闭
var is_loggedin=getUrlParam(document.URL,"login_type")?false:true;//是否已登录
var not_meetingUser=false;//是否溢出人员列表及该人员不在会议人员名单中 overflow
var web_socket_timer=null;
var keepWatchOn_soket_timer=null;

if(!window.android&&!(window.webkit&&window.webkit.messageHandlers)){
    setLocalData("equipment_SN",getUrlParam(document.URL,"equipment_SN"));
}
if(!is_loggedin){
    removeLocalData("JSESSIONID");
}else{
    setLocalData('JSESSIONID',getUrlParam(document.URL,"JSESSIONID"));
    setLocalData('user_code',getUrlParam(document.URL,"user_code"));
}
setLocalData('meeting_server_IP',getUrlParam(document.URL,"meeting_server_IP"));
g_UrlBase="http://"+getLocalData('meeting_server_IP')+"/meeting";
//打开指定网页
function openWin(name,data){
    //if($("#"+name).get(0)&&($("#"+name).hasClass("current")||$("#"+name+":last-child").get(0))){
    if($("#"+name).get(0)&&($("#"+name).hasClass("current"))&&!$("#iframe_box .transition").get(0)){
        return false;
    }
    else{
        $(".current").removeClass("current").siblings("#"+name).remove();
        var newIframe='<iframe class="transition current"  id="'+name+'" src="./'+name+'.html'+(data?"?"+data:"")+'" frameborder="0" allowfullscreen="allowfullscreen" marginheight="0" marginwidth="0"></iframe>';
        $("#iframe_box").append(newIframe).find("#" + name).load(function () {
            if(name=="file_detail"){openCustomTap("file_detail_iframe");}
            $(this).one(whichTransitionEvent(),function(){
                //alert(name);
                    $(this).prev("iframe").contents().find("#fixedNav").removeClass("show");
                    if($(this).prev("iframe").attr("id")=="file_detail"||$(this).prev("iframe").attr("id")=="file_browser"){
                        $(this).prev("iframe").remove();
                    }
                    !not_meetingUser&&submitEquipmentStatus(name);
            });
            if(document.body.getElementsByClassName("aui-dialog")[0]){
                setTimeout(function(){
                    $("#"+name).removeClass("transition");
                },200);
            }else{
                $(this).removeClass("transition");
            }
            //$(this).delay(50).animate({left: 0}, 500, function () {
            //    $(this).addClass("current").prev("iframe").removeClass("current").contents().find("#fixedNav").removeClass("show");
            //    if(name=="file_detail"){
            //        $("#file_detail").get(0)&&$("#file_detail").get(0).contentWindow.windowReady();
            //    }else if(name=="file_browser"){
            //        $("#file_browser").get(0)&&$("#file_browser").get(0).contentWindow.windowReady();
            //    }
            //    if($(this).prev("iframe").attr("id")=="file_detail"||$(this).prev("iframe").attr("id")=="file_browser"){
            //        $(this).prev("iframe").remove();
            //    }
            //    !not_meetingUser&&submitEquipmentStatus(name);
            //});
        });
    }
}
//关闭指定网页
function closeWin(name){
    if(!document.getElementById(name)){return;}
    if(name!="meeting_list"&&!$("#iframe_box .transition,#iframe_box .transition").get(0)){
        setTimeout(function(){
            this.one(whichTransitionEvent(),function(){
                //alert(name);
                $(this).removeClass("current").prev("iframe").addClass("current");
                $(this).remove();
                if (name != "function_list" && !$("#meeting_list").hasClass("current")) {
                    !not_meetingUser && submitEquipmentStatus($("#iframe_box .current").attr("id"));
                }
            });

            if(document.body.getElementsByClassName("aui-dialog")[0]){
                setTimeout(function(){
                    $("#"+name).addClass("transition");
                },200);
            }else{
                this.addClass("transition");
            }
        }.call($("#"+name)),0);
        //$("#"+name).one(whichTransitionEvent(),function(){
        //    //alert(name);
        //    $(this).prev("iframe").addClass("current");
        //    if (name != "function_list" && !$("#meeting_list").hasClass("current")) {
        //        !not_meetingUser && submitEquipmentStatus($("#iframe_box .current").attr("id"));
        //    }
        //    $(this).remove();
        //});

        //$("#"+name).delay(50).addClass("transition");
        //$("#"+name).delay(50).animate({left:"100%"},500,function(){
        //    $(this).prev("iframe").addClass("current");
        //    if(name!="function_list"&&!$("#meeting_list").hasClass("current")){
        //        !not_meetingUser&&submitEquipmentStatus($("#iframe_box .current").attr("id"));
        //    }
        //    $(this).remove();
        //});
    }
}

//返回上一页，并关闭当前页与平板返回键共用
function isCloseCurrentWin(name){
    if(document.body.getElementsByClassName("aui-dialog")[0]){
        $(document.body.getElementsByClassName("aui-dialog-btn")[0]).trigger("click");//closeAuiDialog();
    }
    else if(name=="meeting_list"){
        is_loggedin?isLogout():top.loginFail();
    }else if(name=="function_list"){
        outMeeting();
    }else if(name=="file_detail"){
        if($("#file_detail").get(0)){
            $("#file_detail").get(0).contentWindow.outSynchroMeeting();
        }
    }else{
        closeWin(name);
    }
}
//获取上传的图片静态服务器地址
function getStaticServerIP(){
    sendAjaxRequest("/actions/SystemSetting.action?getStaticResourceIp",[],
        function (data) {
            if (data.status == true) {
                setLocalData('picLoadPath', data.body.staticResourceIp);
            }
            else {
                openAuiDialog("text", "提示", "静态服务器地址获取错误，重新登录!" + data.msg, function () {
                    logout();
                });
            }
        },
        function () {
            openAuiDialog("text", "提示", "静态服务器地址获取错误，重新登录!", function () {
                logout();
            });
        }
    );
}
//向数据库提交设备电量并发送给管理员
function submitEquipmentPower(num){
    var aoData={
        msgType:"sendElectryInfo",
        fromName:getLocalData("user_code"),
        meetingId:getLocalData("meeting_id"),
        electricity:String(num)
    };
    sendWebSocketMsg(aoData);
}
//向数据库提交设备当前页路径并发送给管理员
function submitEquipmentStatus(pageName){//待完善
    var aoData={
        msgType:"sendClientState",
        fromName:getLocalData("user_code"),
        meetingId:getLocalData("meeting_id"),
        clientState:getStatusName(pageName)
    };
    sendWebSocketMsg(aoData);
}
//经页面名字翻译为中文字符串
function getStatusName(name){
    switch (name){
        case "function_list":return "功能列表";break;
        case "file_detail":return "同步参会";break;
        case "file_browser":return "文件浏览";break;
        case "file_list":return "会议文件";break;
        case "my_file":return "我的文档";break;
        //case "meeting_list":return "会议列表";break;
        case "meeting_notice":return "会议公告";break;
        case "electronic_white_board":return "电子白板";break;
        case "my_table":return "我的桌牌";break;
        case "call_service":return "呼叫服务";break;
        case "sign_in":return "签到";break;
        case "chat":return "实时通讯";break;
        case "mark_list":return "评分";break;
        case "marking":return "评分中";break;
        case "mark_result":return "评分结果";break;
        case "vote_list":return "投票";break;
        case "voting":return "投票中";break;
        case "vote_result":return "投票结果";break;
        case "video_detail":return "视频播放";break;
        default :return "离开";break;
    }
}
// 创建websocket监视器
function createKeepWatchOnLogin(){
    try {
        //if ( isReconnectting ) return;
        var loginSocketUrl="ws://"+getLocalData('meeting_server_IP')+"/meeting/websocket/connectServer?device_number="+getEquipmentSN();//socket地址
        if ('WebSocket' in window) {
            keepWatchOn_soket = new WebSocket(loginSocketUrl);// 创建一个Socket实例
        }
        else if ('MozWebSocket' in window) {
            keepWatchOn_soket = new MozWebSocket(loginSocketUrl);// 创建一个Socket实例
        } else {
            openAuiDialog("text","提示","您的浏览器不支持WebSocket！");//alert("您的浏览器不支持WebSocket！");
            return;
        }
        keepWatchOn_soket.onmessage = function (event) {//接收到消息的回调方法
            keepWatchOnDataClass(JSON.parse(event.data));
            //isReconnectting=false;
        };
        keepWatchOn_soket.onopen = function (event) {// 打开Socket建立
            //top.openCustomTap("监视器连接成功！");
            //isReconnectting=false;
        };
        // 监听Socket的关闭
        keepWatchOn_soket.onclose = function (event) {
            //openAuiDialog("text","提示","监视器关闭！");
            keepWatchOn_soket=null;
            //isReconnectting=true;
            //createKeepWatchOnLogin();
        };
        //产生异常的回调
        keepWatchOn_soket.onerror = function (event) {
            openAuiDialog("text","提示","监视器错误！");
            keepWatchOn_soket=null;
            //isReconnectting=true;
            //createKeepWatchOnLogin();
        };
    } catch(e){
        openAuiDialog("text","提示","监视器WebSocket错误"+e.message);
    }
}
////发送监控数据
function sendKeepWatchOnSocket(data){
    try{
        //console.log(data);
        if(keepWatchOn_soket){
            if(keepWatchOn_soket.readyState == 1){
                keepWatchOn_soket.send(JSON.stringify(data));// 发送条消息
            }else if(keepWatchOn_soket.readyState == 0){// 延时发送
                setTimeout(function(){
                    keepWatchOn_soket.send(JSON.stringify(data));
                },200);
            }
            //isReconnectting=true;
        }else{
            createKeepWatchOnLogin();
        }
        //if (!keepWatchOn_soket || keepWatchOn_soket.readyState != 1) {
        //    createKeepWatchOnLogin();
        //}else{
        //    keepWatchOn_soket.send(JSON.stringify(data));// 发送条消息
        //}
    }catch(e){
        if(keepWatchOn_soket&&keepWatchOn_soket.readyState!=2&&keepWatchOn_soket.readyState!=3){
            createKeepWatchOnLogin(function(){
                sendKeepWatchOnSocket(data);
            });
        }
        openAuiDialog("text","提示","监控数据发送失败："+e.message);

    }
}
////关闭Socket
//function closeKeepWatchOnLogin(){
//    try{
//        keepWatchOn_soket.close();
//        keepWatchOn_soket=null;
//    }catch(e){
//        //openAuiDialog("text","提示","text","提示","监控WebSocket关闭失败："+e.message);
//    }
//}
//确认是否登录，并获取
function autologin(){
    if(!is_loggedin){
        $(".first").attr("id", "meeting_list").attr("src", "./meeting_list.html");
    }else{
        sendAjaxRequest("/actions/ProBaseUser.action?getCurrentUserInfo",[],
            function (data) {
                if (data.status == true) {
                    setLocalData('user_name', data.body.userName);
                    $(".first").attr("id", "meeting_list").attr("src", "./meeting_list.html");
                }
                else {
                    loginFail();//alert("获取当前登录人信息失败");
                }
            },
            function(){
                loginFail();
            }
        );
    }
}
//退出登录
function loginFail(){
    if(window.android){
        window.location.replace("./login.html");
    }else if(window.webkit&&window.webkit.messageHandlers){
        window.location.replace("./login.html");
        //window.webkit.messageHandlers.clearEquipmentCache.postMessage("clear");
    }
    else{
        window.location.replace("./login.html");
    }
}
//
function reconnectSocket(){//重新与Socket连接
    //if ( isReconnectting ) return ;
    //openCustomTap(navigator.onLine);
    //if(!navigator.onLine) return;
    if($("#iframe_box iframe").length<=1){
        sendKeepWatchOnSocket({"msgType":"isOnline"});
        keepWatchOn_soket_timer=setTimeout(createKeepWatchOnLogin,2000);
    }else{
        sendKeepWatchOnSocket({"msgType":"isOnline"});
        keepWatchOn_soket_timer=setTimeout(createKeepWatchOnLogin,2000);
        if(is_loggedin){//如果已登录，重连同步Socket
            sendWebSocketMsg({"msgType":"isOnline","fromName":getLocalData("user_code"),"meetingId":getLocalData("meeting_id")});
            web_socket_timer=setTimeout(creatWebSocket,2000);
        }
    }
}
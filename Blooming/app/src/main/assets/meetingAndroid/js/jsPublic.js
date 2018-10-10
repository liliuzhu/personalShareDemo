/**
 * Created by Administrator on 2016/12/8.
 */
    //服务器路径
var g_UrlBase="http://"+getLocalData('meeting_server_IP')+"/meeting";
var typewritingDelay=0;//输入法消失延迟时间
$(function(){
    $("body").height(window.innerHeight).width($("body").width());
    $("body section").on("click",function(){
        if($("#fixedNav").get(0)){
            //$("#fixedNav").attr("type","hide").animate({right:-185},300);
            $("#fixedNav").removeClass("show");
        }
    });
    $(".header_back").on("click",function(){
        top.isCloseCurrentWin($('body').attr('class'));
    });
});
//公共侧滑导航
function setFixedNav(index,event){
    if($("#fixedNav").get(0)){
        //$("#fixedNav").animate({right:-185},300,function(){$(this).remove()});
        if($("#fixedNav").hasClass("show")){
            $("#fixedNav").removeClass("show");
        }else{
            $("#fixedNav").addClass("show");
        }
        //if($("#fixedNav").attr("type")=="hide"){
        //    $("#fixedNav").attr("type","show").animate({right:0},300);
        //}else{
        //    $("#fixedNav").attr("type","hide").animate({right:-185},300);
        //}
    }else{
        var fixed='<nav class="fixedNav" type="show" id="fixedNav">'
            +'<ul class="list-unstyled no_margin">'
            +'<li class="function_list1"><a onclick="isOpenWin(\'file_detail\');" href="javascript:void(0);">同步参会</a></li>'
            +'<li class="function_list2"><a onclick="isOpenWin(\'file_list\');" href="javascript:void(0);">会议文件</a></li>'
            +(top.not_meetingUser?'':'<li class="function_list3"><a onclick="isOpenWin(\'my_file\');" href="javascript:void(0);">我的文档</a></li>')
            +'<li class="function_list4"><a onclick="top.outMeeting();" href="javascript:void(0);">会议列表</a></li>'
            +'<li class="function_list5"><a onclick="isOpenWin(\'meeting_notice\');" href="javascript:void(0);">会议公告</a></li>'
            +(top.not_meetingUser?'':'<li class="function_list6"><a onclick="isOpenWin(\'electronic_white_board\');" href="javascript:void(0);">电子白板</a></li>')
            +(top.not_meetingUser?'':'<li class="function_list7"><a onclick="isOpenWin(\'my_table\');" href="javascript:void(0);">我的桌牌</a></li>')
            +'<li class="function_list8"><a onclick="isOpenWin(\'call_service\');" href="javascript:void(0);">呼叫服务</a></li>'
            +(top.not_meetingUser?'':'<li class="function_list9"><a onclick="isOpenWin(\'sign_in\');" href="javascript:void(0);">我要签到</a></li>')
            +(top.not_meetingUser?'':'<li class="function_list10"><a onclick="isOpenWin(\'chat\');" href="javascript:void(0);">实时通讯</a></li>')
            +'<li class="function_list11"><a onclick="isOpenWin(\'mark_list\');" href="javascript:void(0);">评分</a></li>'
            +'<li class="function_list12"><a onclick="isOpenWin(\'vote_list\');" href="javascript:void(0);">投票</a></li>'
            //+'<li><a onclick="isOpenWin(\'video_detail\');" href="javascript:void(0);">视频</a></li>'
            +'<li><a onclick="isLogout();" href="javascript:void(0);">退出登录</a></li>'
            +'<li><a onclick="location.reload();" href="javascript:void(0);">刷新</a></li>'
            +'</ul>'
            +'</nav>';
        $("header").append(fixed).find("#fixedNav").each(function(){setTimeout(function(){$("#fixedNav").addClass("show")},0)});
        index&&$("#fixedNav li.function_list"+index).addClass("here");
    }
}
//是否已经签到
function isSignIn(name){
    if(name=="sign_in"){
        var aoData=[];
        aoData.push( { "name": "logonLog.meeting_id", "value": getLocalData("meeting_id")} );
        aoData.push( { "name": "logonLog.user_code", "value": getLocalData("user_code")} );
        var xurl="/actions/Meeting.action?hasLogonLog";
        sendAjaxRequest(xurl,aoData,
            function (data) {
                if (data.status == true) {
                    if (data.msg == "1") {
                        top.openAuiDialog("text", "提示", "您已签到！");
                    } else {
                        top.openWin(name);
                    }
                }
                else {
                    showInfoWinWarn("签到信息获取失败" + obj.msg);
                }
            },
            function () {
                showInfoWinError("签到信息获取失败");
            }
        );
    }else{
        top.openWin(name);
    }
}
//特殊情况的判断
function isOpenWin(name){
    if($('body').attr('class')!=name){//查看打开的是否为同一页面
        if($('body').attr('class')=="file_detail"){//退出同步参会并判断是否签到
            outSynchroMeeting(name);
        }
        else if(name=="file_detail"){
            checkMeetingState(function(){
                top.sendWebSocketMsg({"msgType": "hasMeetingHost"});//判断当前会议同步是否有主讲人
            });
        }else{
            isSignIn(name);//判断是否签到
        }
    }
}
function checkMeetingState(callBack){
    var aoData=[{ "name": "meeting.id", "value": getLocalData("meeting_id")}];
    var xurl="/actions/Meeting.action?checkMeetingState ";
    sendAjaxRequest(xurl, aoData,
        function (data) {
            if (data.status == true) {
                if (data.msg == "0") {
                    top.openAuiDialog("text", "提示", "该会议尚未启动！");
                } else if (data.msg == "2") {
                    top.openAuiDialog("text", "提示", "该会议已结束！");
                } else if (data.msg == "1") {
                    callBack&&callBack();
                }
            } else {
                showInfoWinError("获取会议状态失败" + data.msg);
            }
        },
        function () {
            showInfoWinError("获取会议状态失败");
        }
    );
}
//是否退出同步参会
function outSynchroMeeting(name){
    if(is_synchronize){
        if(top.is_spokesman){
            if(name=="my_file"){
                is_canChangeStatus&&top.openWin(name);
            }else{
                //top.openAuiDialog("callback","提示","会议进行中，确认退出同步参会吗？",function(){},function(){
                    if(is_canChangeStatus){
                        if(name){
                            isSignIn(name);
                        }else{
                            top.closeWin($('body').attr('class'));
                        }
                    }
                //});
            }
        }else{
            if(name=="my_file"){
                top.openWin(name);
            }else{
                //top.openAuiDialog("callback","提示","会议进行中，确认退出同步参会吗？",function(){},function(){
                    if(name){
                        isSignIn(name);
                    }else{
                        top.closeWin($('body').attr('class'));
                    }
                //});
            }
        }
    }else{
        if(name){
            isSignIn(name);
        }else{
            top.closeWin($('body').attr('class'));
        }
    }
}
//判断文件类型来判断图标
function geiFileIcon(type){
    switch (type){
        case "txt":return "icon-txt@2x.png";break;
        case "word":return "icon-word@2x.png";break;
        case "video":return "video-5@2x.png";break;
        case "excel":return "excel-5@2x.png";break;
        case "pic":return "icon-jpg@2x.png";break;
        case "pdf":return "icon-pdf@2x.png";break;
        case "folder":return "illus-folder@2x.png";break;
        case "ppt":return "icon-ppt@2x.png";break;
        case "zip":return "icon-jpg@2x.png";break;
        default:return "icon-jpg@2x.png";break;
    }
}
//获取当前的同步缓存数据
function getCurrentSynchronizedate(successBack,errorBack){
    var aoData=[];
    aoData.push( { "name": "meetingId", "value":getLocalData("meeting_id")} );
    var xurl="/actions/Meeting.action?getCurFileId";
    sendAjaxRequest(xurl, aoData,successBack,errorBack);
}
//平板返回键监控事件
function ipadBackKey(){
    if($("#iframe_box").get(0)){
        isCloseCurrentWin($("#iframe_box .current").attr("id"));
    }else{
        closeApp();
    }
}
//确认退出当前app调用安卓方法
function closeApp(){
    if(document.body.getElementsByClassName("aui-dialog")[0]){
        $(document.body.getElementsByClassName("aui-dialog-btn")[0]).trigger("click");//closeAuiDialog();
    }else{
        openAuiDialog("callback","提示退出","确定要退出无纸化会议？",function(){},function(){
            exitApp();
        });
    }
}
//退出app调用安卓方法
function exitApp(){
    if(window.android){
        window.android.closeApp();
    }
}
//退出登录清除缓存
function clearEquipmentCache(){
    if(window.android){

    }else if(window.webkit&&window.webkit.messageHandlers){
        window.webkit.messageHandlers.clearEquipmentCache.postMessage("clear");
    }
}
//呼叫IOS电量与设备id
function callIOSInfo(){
    if(window.webkit&&window.webkit.messageHandlers){
        window.webkit.messageHandlers.callEquipmentSN.postMessage("SN");
        window.webkit.messageHandlers.callEquipmentPower.postMessage("power");
        return true;
    }
    return false;
}
//读取设备id
function getEquipmentSN(){
    if(window.android){
        return window.android.getEquipmentSN();
    }
    else{
        return getLocalData("equipment_SN");
    }
}
//读取设备电量
function getEquipmentPower(){
    if(window.android){
        return window.android.getEquipmentPower();
    }else if(window.webkit&&window.webkit.messageHandlers){
        return getLocalData("equipment_power");
    }else{
        return "can't get power";
    }
}
//接收保存设备Id
function saveEquipmentSN(data){
    setLocalData("equipment_SN",data);
    createKeepWatchOnLogin&&createKeepWatchOnLogin();
}
//接收保存设备电量
function saveEquipmentPower(data){
    //top.openCustomTap(data);
    if(getLocalData("equipment_power")!=data){
        setLocalData("equipment_power",data);
        if($("#iframe_box iframe").length>1){
            if(!not_meetingUser&&is_loggedin){
                submitEquipmentPower(data);
            }
        }
    }
}
//是否退出登录
function isLogout(){
    top.openAuiDialog("callback","提示","确认退出登录吗？",function(){},logout);
}
// 退出系统
function logout(){
    clearEquipmentCache();
    sendAjaxRequest("/actions/ProBaseUser.action?logout",[],top.loginFail,top.loginFail,false,2000);
}
//只发出退出登录信息，不回调
function directLogout(callBack){
    sendAjaxRequest("/actions/ProBaseUser.action?logout",[],function(){callBack&&callBack()},function(){callBack&&callBack()},false,2000);
}
//active restart事件
function restart(){
    reconnectSocket();
    if($("#iframe_box iframe").length>1){
        if(is_loggedin){//如果已登录，重连同步Socket
            if($("#iframe_box .current").attr("id")=="file_detail"){
                $("#file_detail").get(0).contentWindow.restartGetLabelImageListOnly();
            }
        }
    }
}
//查询设备类型
function lookEquipmentType(){
    var userAgent=navigator.userAgent;
    if(userAgent.match(/iPhone/gi)&&userAgent.match(/Mobile/gi)&&userAgent.match(/Mac/gi)){
        alert("iphone");
    }else if(userAgent.match(/iPad/gi)&&userAgent.match(/Mobile/gi)&&userAgent.match(/Mac/gi)){
        alert("iPad");
    }else if(userAgent.match(/Android/gi)&&userAgent.match(/Mobile/gi)){
        alert("Android手机");
    }else if(userAgent.match(/Android/gi)&&userAgent.match(/pad/gi)){
        alert("Android平板");
    }else{
        alert("PC");
    }
}
//设置本地存储localStorage
function setLocalData(key,val,noCover){
    if(!noCover){
        localStorage.setItem(key, val);
    }else{
        localStorage.getItem(key)?alert('有重复！'):localStorage.setItem(key, val);
    }
}
//获取本地存储
function getLocalData(key){
    var val=localStorage.getItem(key);
    return val?val:"";
}
//清空本地所有存储
function clearLocalData(){
    localStorage.clear();
}
//移除本地存储
function removeLocalData(key){
    localStorage.removeItem(key);
}

/**
 * 发送AJAX请求
 * @param xurl
 * @param param
 * @param fnCallback
 */
function sendAjaxRequest(xurl,param,fnCallback,errorCallback,notShowError,to){
    if ( to == undefined ) to = 50000;
    doSendAjaxRequest( xurl,param,fnCallback,errorCallback,notShowError,to );
}
function doSendAjaxRequest(xurl,param,fnCallback,errorCallback,notShowError,to){
    if ( !notShowError ) notShowError = false;
    if ( xurl.indexOf('http://') == -1 ) xurl = g_UrlBase+xurl;
    var sid=getLocalData('JSESSIONID');
    if ( sid && sid != '' ) {
        var n=xurl.indexOf("?");
        xurl=xurl.slice(0,n)+(";jsessionid="+sid)+xurl.slice(n,xurl.length);
    }
    $.ajax( {
        "url":  xurl,
        "data": param,
        "timeout" : to,
        "contentType" : "application/x-www-form-urlencoded;charset=utf-8",
        "dataType": "json",
        "cache": false,
        "type": "POST",
        "success": function (json) {
            try{
                if ( json.msg == 'NOT_LOGIN' ) {
                    //alert(JSON.stringify(json));
                    //alert("NOT_LOGIN");
                    //alert(xurl);
                    loginFail?loginFail():top.loginFail();
                    return ;
                }
                fnCallback( json );
            }catch(e){
                if(errorCallback){
                    errorCallback();
                }else{
                    top.showInfoWinError("操作失败："+e.message);
                }
            }
        },
        "error": function (xhr, error, thrown) {
            try{
                if ( !notShowError ){
                    if(errorCallback){
                        errorCallback();
                    }
                    else{
                        top.showInfoWinError("操作异常："+xurl);
                    }
                }
            }catch(e){
                if ( !notShowError ){
                    if(errorCallback){
                        errorCallback();
                    }
                    else{
                        top.showInfoWinError("操作异常："+xurl);
                    }
                }
            }
        }
    } );
}
/**
 * 转换时间字符串格式 (YYYY-MM-DD hh:mm:ss)
 */
function getTimeStr(t,isDateStr){
    if ( !isDateStr ) isDateStr = false;
    if ( !t ) return "";
    if ( t > -2 && t < 10 ) return "";
    try{
        var d=new Date(2013,1,1);
        d.setTime( t );
        var str = d.getFullYear()+"-"+getTwoNumberStr(d.getMonth()+1)+"-"+getTwoNumberStr(d.getDate());
        if ( !isDateStr ) str +=" "+getTwoNumberStr(d.getHours())+":"+getTwoNumberStr(d.getMinutes())
            +":"+getTwoNumberStr(d.getSeconds());
        return str;
    }catch(e){
        return "";
    }
}
/** 对于个位数的数字，在前面补零  */
function getTwoNumberStr(n){
    return ( parseInt(n) < 10 ) ? ("0"+parseInt(n)):n;
}
/** 将日期字符串(YYYY-MM-DD hh:mm:ss)转换为时间戳 */
function toTimestamp(str){
    if ( str == '' ) return 0;
    try{
        var d=new Date(2013,1,1);
        d.setFullYear( Number(str.substring(0,4)) );
        d.setMonth( Number(str.substring(5,7)) - 1 ); // 0 - 11
        d.setDate( Number(str.substring(8,10)) );
        if ( str.length > 15 ) {
            d.setHours( Number(str.substring(11,13)) );
            d.setMinutes( Number(str.substring(14,16)) );
        } else {
            d.setHours(0);
            d.setMinutes(0);
        }
        d.setSeconds(0,0);
        return d.getTime();
    }catch(e){
        return 0;
    }
}
/**
 * 获取URL参数值
 */
function getUrlParam(xurl,name){
    var para="";
    if(xurl.lastIndexOf("?")>0){
        para=xurl.substring(xurl.lastIndexOf("?")+1,xurl.length);
        var arr=para.split("&");
        para="";
        for(var i=0;i<arr.length;i++){
            if(arr[i].split("=")[0]==name) return arr[i].split("=")[1];
        }
        return "";
    }else{
        return "";
    }
}

/**
 * 弹出消息提示框
 * @param msg
 */
function showInfoWin(msg,imgType){
    if ( imgType == 'ok' ){
        top.openAuiDialog("text","<span style='color:#449d44;'>成功</span>",msg,function(){});
    } else if ( imgType == 'warn' ){
        top.openAuiDialog("text","<span style='color:#f0ad4e;'>警告</span>",msg,function(){});
    } else if ( imgType == 'error' ){
        top.openAuiDialog("text","<span style='color:#FF4134;'>错误</span>",msg,function(){});
    }
}
function showInfoWinOK(msg){
    showInfoWin(msg,"ok");
}
function showInfoWinWarn(msg){
    showInfoWin(msg,"warn");
}

function showInfoWinError(msg){
    showInfoWin(msg,"error");
}
//阻止冒泡
function stopBubble(event){
    event.stopPropagation?event.stopPropagation():event.cancelBubble=true;
}
//阻止默认操作
function stopDefaultEvent(event){
    event.preventDefault?event.preventDefault():event.returnValue = false;
}
//事件支持类型判断
function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd',
        'MsTransition':'msTransitionEnd'
    };
    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}
function whichAnimationEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var animations = {
        'animation':'animationend',
        'OAnimation':'oAnimationEnd',
        'MozAnimation':'animationend',
        'WebkitAnimation':'webkitAnimationEnd',
        'MsAnimation':'msAnimationEnd'
    };
    for(t in animations){
        if( el.style[t] !== undefined ){
            return animations[t];
        }
    }
}

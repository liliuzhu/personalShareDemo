/**
 * aui-popup.js
 * @author 流浪男
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function( window, undefined ) {
    "use strict";
    var auiDialog = function() {
    };
    var isShow = false;
    auiDialog.prototype = {
        params: {
            title:'提示',
            msg:'提示信息为空',
            buttons: ['取消','确定'],
            input:false
        },
        create: function(params,callback) {
            var self = this;
            //if(document.querySelector(".aui-dialog")){ //setTimeout(function(){self.create(params,callback)},500); return; }
            var buttonsHtml = '';
            var headerHtml = params.title ? '<div class="aui-dialog-header">' + params.title + '</div>' : '<div class="aui-dialog-header">' + this.params.title + '</div>';
            if(params.input){
                var msgHtml = '<div class="aui-dialog-body"><input type="'+params.type+'" placeholder="'+(params.msg ? params.msg: '')+'"></div>';
            }else{
                var msgHtml = params.msg ? '<div class="aui-dialog-body">' + params.msg + '</div>' : '<div class="aui-dialog-body">' + this.params.msg + '</div>';
            }
            var buttons = params.buttons ? params.buttons : this.params.buttons;
            if (buttons && buttons.length > 0) {
                for (var i = 0; i < buttons.length; i++) {
                    buttonsHtml += '<div class="aui-dialog-btn" tapmode button-index="'+i+'">'+buttons[i]+'</div>';
                }
            }
            var footerHtml = '<div class="aui-dialog-footer">'+buttonsHtml+'</div>';
            document.body.insertAdjacentHTML('beforeend', '<div class="aui-dialog">'+headerHtml+msgHtml+footerHtml+'</div>');
            var dialogs=document.querySelectorAll(".aui-dialog");
            var dialogButtons = dialogs[dialogs.length-1].querySelectorAll(".aui-dialog-btn");
            if(dialogButtons && dialogButtons.length > 0){
                for(var ii = 0; ii < dialogButtons.length; ii++){
                    dialogButtons[ii].onclick = function(){
                        if(callback){
                            if(params.input){
                                callback({
                                    buttonIndex: parseInt(this.getAttribute("button-index"))+1,
                                    text: document.querySelector(".aui-dialog-body input").value
                                });
                            }else{
                                callback({
                                    buttonIndex: parseInt(this.getAttribute("button-index"))+1
                                });
                            }
                        }
                        self.close();
                        return;
                    }
                }
            }
            this.open();
        },
        open: function(){
            if(!document.querySelector(".aui-dialog"))return;
            document.querySelector(".aui-dialog").style.marginTop =  "-"+Math.round(document.querySelector(".aui-dialog").offsetHeight/2)+"px";
            if(!document.querySelector(".aui-mask")){
                var maskHtml = '<div class="aui-mask"></div>';
                document.body.insertAdjacentHTML('beforeend', maskHtml);
            }
            setTimeout(function(){
                document.querySelector(".aui-mask").classList.add("aui-mask-in");
                document.querySelector(".aui-dialog").classList.add("aui-dialog-in");
            }, 10);
            document.querySelector(".aui-mask").addEventListener("touchmove", function(e){
                e.preventDefault();
            });
            document.querySelector(".aui-dialog").addEventListener("touchmove", function(e){
                e.preventDefault();
            });
            return;
        },
        close: function(){
            var self = this;
            document.querySelector(".aui-mask").classList.remove("aui-mask-in");
            document.querySelector(".aui-dialog").classList.add("aui-dialog-out");
            //alert(1);
            document.querySelector(".aui-dialog").classList.remove("aui-dialog-in");
            if(document.querySelector(".aui-dialog.aui-dialog-out")){
                    document.querySelector(".aui-dialog.aui-dialog-out").addEventListener(whichTransitionEvent(), function(e){
                        self.remove();
                    });
                document.querySelector(".aui-mask").classList.add("aui-mask-out");
            }else{
                document.querySelector(".aui-mask").classList.add("aui-mask-out");
                setTimeout(function () {
                    if (document.querySelector(".aui-dialog"))document.querySelector(".aui-dialog").parentNode.removeChild(document.querySelector(".aui-dialog"));
                    document.querySelector(".aui-mask").classList.remove("aui-mask-out");
                    self.open();
                    return true;
                }, 200)
            }
            //if (document.querySelector(".aui-dialog:not(.aui-dialog-out)")) {
            //    document.querySelector(".aui-mask").classList.add("aui-mask-out");
            //    setTimeout(function(){
            //        if(document.querySelector(".aui-dialog"))document.querySelector(".aui-dialog").parentNode.removeChild(document.querySelector(".aui-dialog"));
            //        document.querySelector(".aui-mask").classList.remove("aui-mask-out");
            //        self.open();
            //        return true;
            //    },200)
            //}else{
            //    document.querySelector(".aui-mask").classList.add("aui-mask-out");
            //    document.querySelector(".aui-dialog.aui-dialog-out").addEventListener(whichTransitionEvent(), function(e){
            //        self.remove();
            //    });
            //}
        },
        remove: function(){
            if(document.querySelector(".aui-dialog.aui-dialog-out"))document.querySelector(".aui-dialog").parentNode.removeChild(document.querySelector(".aui-dialog.aui-dialog-out"));
            if(document.querySelector(".aui-mask")){
                document.querySelector(".aui-mask").classList.remove("aui-mask-out");
            }
            this.open();
            return true;
        },
        alert: function(params,callback){
            return this.create(params,callback);
        },
        prompt:function(params,callback){
            params.input = true;
            return this.create(params,callback);
        }
    };
	window.auiDialog = auiDialog;
})(window);

//AUI--dialog
var aDialog = new auiDialog({});
function openAuiDialog(type,dialogTitle,dialogMsg,callback1,callback2,btn1,btn2){
    switch (type) {
        case "text":
            aDialog.alert({
                title:dialogTitle,
                msg:dialogMsg,
                buttons:[btn1||'确定']
            },function(ret){
                callback1&&callback1(ret);
            });break;
        case "callback":
            aDialog.alert({
                title:dialogTitle,
                msg:dialogMsg,
                buttons:[btn1||'取消',btn2||'确定']
            },function(ret){
                if(ret){
                    ret.buttonIndex==1?callback1():callback2();
//                  aDialog.alert({ title:"提示", msg:"您点击了第"+ret.buttonIndex+"个按钮", buttons:['确定'] });
                }
            });break;
        case "input":
            aDialog.prompt({
                title:dialogTitle,
                type:"text",
                msg:dialogMsg,
                buttons:[btn1||'取消',btn2||'确定']
            },function(ret){
                ret.buttonIndex==1?"":callback2(ret);
//              if(ret.buttonIndex == 2){ aDialog.alert({ title:"提示", msg: "您输入的内容是："+ret.text, buttons:['确定'] }); }
            });break;
        default:break;
    }
}
function closeAuiDialog(){
    aDialog.close();
}
/**
 * Created by Administrator on 2017/3/3.
 */
(function( window, undefined ) {
    "use strict";
    var customKeyboard = function() {
    };
    var isShow = false;
    customKeyboard.prototype = {
        params: {
            chosen:'被评分人',
            option:'评分项',
            currentScore:'当前分数',
            maxScore:'10',
            desc:'描述'
        },
        create: function(callback) {
            var self = this;
            if(document.querySelector(".custom_keyboard")){
                //setTimeout(function(){self.create(callback)},500);
                return;
            }
            var keyboardHtml = '<div class="custom_keyboard not_user_select">'
                +'<p>最大分数为：'+self.params.maxScore+'</p>'
                +'<input class="display" max="'+self.params.maxScore+'" min="0" type="number" value="'+self.params.currentScore+'" disabled>'
                +'<table>'
                +'<tbody>'
                +'<tr>'
                +'<td><input class="num_key" type="button" value="1"></td>'
                +'<td><input class="num_key" type="button" value="2"></td>'
                +'<td><input class="num_key" type="button" value="3"></td>'
                +'<td rowspan="2"><input onclick="document.querySelector(\'.custom_keyboard .display\').setAttribute(\'value\',\'0\');" type="button" value="清空"></td>'
                +'</tr>'
                +'<tr>'
                +'<td><input class="num_key" type="button" value="4"></td>'
                +'<td><input class="num_key" type="button" value="5"></td>'
                +'<td><input class="num_key" type="button" value="6"></td>'
                +'</tr>'
                +'<tr>'
                +'<td><input class="num_key" type="button" value="7"></td>'
                +'<td><input class="num_key" type="button" value="8"></td>'
                +'<td><input class="num_key" type="button" value="9"></td>'
                +'<td><input id="deleteNum" type="button" value="删除"></td>'
                +'</tr>'
                +'<tr>'
                +'<td><input class="num_key" type="button" value="0"></td>'
                +'<td><input id="mark_cancel" type="button" value="取消"></td>'
                +'<td colspan="2"><input id="mark_ok" type="button" value="确定"></td>'
                +'</tr>'
                +'</tbody>'
                +'</table>'
                +'</div>';
            document.body.insertAdjacentHTML('beforeend', keyboardHtml);
            //显示input
            var display=document.querySelector(".custom_keyboard .display");
            //取消键
            var mark_cancel = document.querySelector("#mark_cancel");
            if(mark_cancel){
                mark_cancel.onclick = function(){
                    self.close();
                    return;
                }
            }
            //确定键
            var mark_ok = document.querySelector("#mark_ok");
            if(mark_ok){
                mark_ok.onclick = function(){
                    if(callback){
                        callback({
                            score: display.value
                        });
                    }
                    self.close();
                    return;
                }
            }
            //数字键
            var numkeys = document.querySelectorAll(".custom_keyboard .num_key");
            if(numkeys && numkeys.length > 0){
                for(var ii = 0; ii < numkeys.length; ii++){
                    numkeys[ii].onclick = function(){
                        var newNum=display.getAttribute("value")==0?this.getAttribute("value"):display.getAttribute("value")+this.getAttribute("value");
                        newNum<=parseInt(self.params.maxScore)&&display.setAttribute("value",newNum);
                    }
                }
            }
            //删除键
            var deleteNum=document.querySelector("#deleteNum");
            if(deleteNum){
                deleteNum.onclick = function(){
                    display.setAttribute("value",display.getAttribute("value").slice(0,-1).length>0?display.getAttribute("value").slice(0,-1):0);
                }
            }
            self.open();
        },
        open: function(){
            if(!document.querySelector(".custom_keyboard"))return;
            document.querySelector(".custom_keyboard").style.marginTop =  "-"+Math.round(document.querySelector(".custom_keyboard").offsetHeight/2)+"px";
            document.querySelector(".custom_keyboard").style.marginLeft =  "-"+Math.round(document.querySelector(".custom_keyboard").offsetWidth/2)+"px";
            if(!document.querySelector(".aui-mask")){
                var maskHtml = '<div class="aui-mask"></div>';
                document.body.insertAdjacentHTML('beforeend', maskHtml);
            }
            // document.querySelector(".aui-dialog").style.display = "block";
            setTimeout(function(){
                document.querySelector(".aui-mask").classList.add("aui-mask-in");
                setTimeout(function(){
                    document.querySelector(".custom_keyboard").classList.add("custom_keyboard_in");
                }, 100);
            }, 100);
            document.querySelector(".aui-mask").addEventListener("touchmove", function(e){
                e.preventDefault();
            });
            document.querySelector(".custom_keyboard").addEventListener("touchmove", function(e){
                e.preventDefault();
            });
            return;
        },
        close: function(){
            var self = this;
            document.querySelector(".aui-mask").classList.remove("aui-mask-in");
            document.querySelector(".custom_keyboard").classList.remove("custom_keyboard_in");
            document.querySelector(".custom_keyboard").classList.add("custom_keyboard_out");
            if (document.querySelector(".custom_keyboard")) {
                setTimeout(function(){
                    if(document.querySelector(".custom_keyboard"))document.querySelector(".custom_keyboard").parentNode.removeChild(document.querySelector(".custom_keyboard"));
                    self.open();
                    return true;
                },200)
            }else{
                document.querySelector(".aui-mask").classList.add("aui-mask-out");
                document.querySelector(".custom_keyboard").addEventListener("webkitTransitionEnd", function(){
                    self.remove();
                });
                document.querySelector(".custom_keyboard").addEventListener("transitionend", function(){
                    self.remove();
                })
            }
        },
        remove: function(){
            if(document.querySelector(".custom_keyboard"))document.querySelector(".custom_keyboard").parentNode.removeChild(document.querySelector(".custom_keyboard"));
            if(document.querySelector(".aui-mask")){
                document.querySelector(".aui-mask").classList.remove("aui-mask-out");
            }
            return true;
        },
        start:function(params,callback){
            var self = this;
            this.params= params;
            return self.create(callback);
        }
    };
    window.customKeyboard = customKeyboard;
})(window);

//AUI--dialog
var keyboard = new customKeyboard({});
function openCustomKeyboard(chosen,option,currentScore,maxScore,desc,callback){
    keyboard.start({
        chosen:chosen||'',
        option:option||'',
        currentScore:currentScore||0,
        maxScore:maxScore||0,
        desc:desc||''
    },function(ret){
        if(ret){
            callback&&callback(ret);
        }
    });
}
//setTimeout(function(){
//    openCustomKeyboard("某某人","某某项",10,"6-8分为正常体重",function(ret){
//        alert(JSON.stringify(ret));
//    })
//},1000);
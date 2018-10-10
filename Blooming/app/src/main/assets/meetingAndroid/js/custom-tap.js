/**
 * Created by Administrator on 2017/1/9.
 */
/**
 * @author 李留住
 */
(function( window, undefined ) {
    "use strict";
    var customTap = function() {
    };
    //var isShow = false;
    customTap.prototype = {
        params: {
            content:"无内容",
            duration:1000
        },
        time:null,
        create: function(params,callback) {
            var self = this;
            //var tapHtml="";
            if(document.querySelector(".custom_tap")){
                clearTimeout(self.time);
                self.time=null;
                self.close();
                setTimeout(function(){self.create(params,callback)},50);
                return;
            }
            //if(document.querySelector(".custom_tap")){
            //    document.querySelector(".custom_tap").innerHTML=params.content||self.params.content;
            //    return;
            //}
            else{
                var tapHtml = '<div class="custom_tap">'+(params.content||self.params.content)+'</div>';
                document.body.insertAdjacentHTML('beforeend', tapHtml);
                self.open(params,callback);
            }
        },
        open: function(params,callback){
            if(!document.querySelector(".custom_tap"))return;
            var self = this;
            document.querySelector(".custom_tap").style.marginTop =  "-"+Math.round(document.querySelector(".custom_tap").offsetHeight/2)+"px";
            document.querySelector(".custom_tap").style.marginLeft =  "-"+Math.round(document.querySelector(".custom_tap").offsetWidth/2)+"px";
            document.querySelector(".custom_tap").classList.add("custom_tap_in");
            document.querySelector(".custom_tap").addEventListener("touchmove", function(e){
                e.preventDefault();
            });
            self.time=setTimeout(function(){
                self.close(params,callback);
            }, (params.duration||self.params.duration));
            //clearTimeout(time);
            return;
        },
        close: function(params,callback){
            if(!params&&!callback){
                if(document.querySelector(".custom_tap"))document.querySelector(".custom_tap").parentNode.removeChild(document.querySelector(".custom_tap"));
                return true;
            }
            var self = this;
            if (document.querySelector(".custom_tap_in")) {
                document.querySelector(".custom_tap").classList.remove("custom_tap_in");
                document.querySelector(".custom_tap").classList.add("custom_tap_out");
                setTimeout(function(){
                    if(document.querySelector(".custom_tap"))document.querySelector(".custom_tap").parentNode.removeChild(document.querySelector(".custom_tap"));
                    if(callback){callback();}
                    self.open(params,callback);
                    return true;
                },250)
            }else if (document.querySelector(".custom_tap_out")){
                document.querySelector(".custom_tap").addEventListener(whichTransitionEvent(), function(){
                    self.remove(callback);
                });
            }
        },
        remove: function(callback){
            if(document.querySelector(".custom_tap"))document.querySelector(".custom_tap").parentNode.removeChild(document.querySelector(".custom_tap"));
            if(callback){callback();}
            return true;
        },
        popAlert: function(params,callback){
            var self = this;
            return self.create(params,callback);
        }
    };
    window.customTap = customTap;
})(window);

//AUI--dialog
var popTap = new customTap({});
function openCustomTap(content,duration,callback){
    popTap.popAlert({
        content:content,
        duration:duration
    },function(){
        callback&&callback();
    });
}


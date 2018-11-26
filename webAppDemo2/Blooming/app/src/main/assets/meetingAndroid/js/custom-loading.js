/**
 * aui-popup.js
 * @author
 * @todo more things to abstract, e.g. Loading css etc.
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function( window, undefined ) {
    "use strict";
    var customLoading = function() {};
    customLoading.prototype = {
        params: {
            content:"加载中..."
        },
        create: function(params,callBack) {
            var self = this;
            if(document.querySelector(".loading_toast"))document.querySelector(".loading_toast").parentNode.removeChild(document.querySelector(".loading_toast"));
            if(document.querySelector(".aui-mask")){
                document.querySelector(".aui-mask").classList.remove("aui-mask-in");
                document.querySelector(".aui-mask").classList.remove("aui-mask-out");
            }
            var toastHtml= '<div onclick="top.isCloseCurrentWin($(\'body\').attr(\'class\'));" class="loading_toast"><i class="loading_icon"></i><p class="loading_content">'+(params?params:self.params.content)+'</p></div>';
            document.body.insertAdjacentHTML('beforeend', toastHtml);
            self.open(callBack);
        },
        open: function(callBack){
            if(!document.querySelector(".loading_toast"))return;
            document.querySelector(".loading_toast").style.marginTop =  "-"+Math.round(document.querySelector(".loading_toast").offsetHeight/2)+"px";
            if(!document.querySelector(".aui-mask")){
                var maskHtml = '<div class="aui-mask"></div>';
                document.body.insertAdjacentHTML('beforeend', maskHtml);
            }
            document.querySelector(".aui-mask").classList.add("aui-mask-in");
            document.querySelector(".loading_toast").classList.remove("loading_toast_out");
            document.querySelector(".loading_toast").classList.add("loading_toast_in");
            document.querySelector(".aui-mask").addEventListener("touchmove", function(e){
                e.preventDefault();
            });
            document.querySelector(".loading_toast").addEventListener("touchmove", function(e){
                e.preventDefault();
            });
            callBack&&callBack();
            return;
        },
        close: function(callback){
            //var self = this;
            document.querySelector(".aui-mask").classList.remove("aui-mask-in");
            document.querySelector(".aui-mask").classList.add("aui-mask-out");
            document.querySelector(".loading_toast").classList.remove("loading_toast_in");
            document.querySelector(".loading_toast").classList.add("loading_toast_out");
            //if (document.querySelector(".loading_toast.loading_toast_out")) {
            //    //console.log(4);
            //    document.querySelector(".loading_toast.loading_toast_out").addEventListener(whichTransitionEvent(), function(){
            //        alert(1);
            //        self.remove(callback);
            //    });
            //}
            // else{
                //console.log(2);
            setTimeout(function () {
                if (document.querySelector(".loading_toast.loading_toast_out"))document.querySelector(".loading_toast").parentNode.removeChild(document.querySelector(".loading_toast.loading_toast_out"));
                if (document.querySelector(".aui-mask.aui-mask-out"))document.querySelector(".aui-mask.aui-mask-out").classList.remove("aui-mask-out");
                callback && callback();
                return true;
            }, 250);
            //}
        },
        remove: function(callback){
            if(document.querySelector(".loading_toast.loading_toast_out"))document.querySelector(".loading_toast").parentNode.removeChild(document.querySelector(".loading_toast.loading_toast_out"));
            if(document.querySelector(".aui-mask")){
                document.querySelector(".aui-mask").classList.remove("aui-mask-out");
            }
            callback&&callback();
            //this.open();
            return true;
        },
        start:function(params,callBack){
            var self = this;
            return self.create(params,callBack);
        }
    };
	window.customLoading = customLoading;
})(window);

//Loading....
var loading = new customLoading({});
function openLoadingToast(content,callBack){
    //loading.start(content,callBack);
    loading.start('已加载 <span id="icon_progress">0</span>%',callBack);
}
function closeLoadingToast(callback){
    document.querySelector(".loading_toast.loading_toast_in")&&loading.close(callback);
}
//setTimeout(function(){openLoadingToast()},100);
//setTimeout(function(){closeLoadingToast()},1500);
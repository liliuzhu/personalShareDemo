package com.helpyouworkeasy.blooming;

import android.os.Looper;
import android.os.Message;
import android.webkit.WebView;

import org.json.JSONObject;

/**
 * Created by liliuzhu on 2018/10/30.
 */

public class handlerResponnse {
        final static String JS_HANDLE_MESSAGE_FROM_JAVA = "javascript:window.WebViewJavascriptBridge._dispatchMessageFromNative('%s');";
    public static void dispatchMessage(WebView webView, JSONObject m) {
        String messageJson = m.toString();
        //escape special characters for json string
        messageJson = messageJson.replaceAll("(\\\\)([^utrn])", "\\\\\\\\$1$2");
        messageJson = messageJson.replaceAll("(?<=[^\\\\])(\")", "\\\\\"");
        String javascriptCommand = String.format(JS_HANDLE_MESSAGE_FROM_JAVA, messageJson);
        System.out.println(javascriptCommand);
        if (Thread.currentThread() == Looper.getMainLooper().getThread()) {
            webView.loadUrl(javascriptCommand);
        }
    }
}

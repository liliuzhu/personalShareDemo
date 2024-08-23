package com.helpyouworkeasy.blooming;
import android.webkit.WebView;

import org.json.JSONObject;

/**
 * Created by liliuzhu on 2018/10/30.
 */

public class handlerResponnse {
    final static String JS_HANDLE_MESSAGE_FROM_JAVA = "javascript:window.%1$s('%2$s');";
    public static void dispatchMessage(WebView webView, JSONObject m, String callback) {
        String messageJson = m.toString();
        //escape special characters for json string
        messageJson = messageJson.replaceAll("(\\\\)([^utrn])", "\\\\\\\\$1$2");
        messageJson = messageJson.replaceAll("(?<=[^\\\\])(\")", "\\\\\"");
        String javascriptCommand = String.format(JS_HANDLE_MESSAGE_FROM_JAVA, callback, messageJson);
        customUtil.println(javascriptCommand);
        customUtil.evaluateJavascript(webView, javascriptCommand);
    }
}

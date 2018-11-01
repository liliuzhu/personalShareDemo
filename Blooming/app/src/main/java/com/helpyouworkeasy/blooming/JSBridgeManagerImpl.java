package com.helpyouworkeasy.blooming;

import android.content.Context;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.webkit.WebView;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URLDecoder;
import java.util.concurrent.ConcurrentHashMap;

/**
 * JSBridge 核心处理类
 * Created by liliuzhu on 2018/10/30.
 */

//public class JSBridgeManagerImpl implements JSBridgeProcesser {
public class JSBridgeManagerImpl {
    private static final String TAG = JSBridgeManagerImpl.class.getCanonicalName();
    final static String RRC_OVERRIDE_SCHEMA = "rrche://__MESSAGE_MODEL__/";
//    @Override
    public void processJSCallFunction(WebView webView, String url){
        Log.e(TAG, "handlerJSCallData:" + url);
        // 截获参数
        String params = URLDecoder.decode(url.replace(RRC_OVERRIDE_SCHEMA,""));
        customUtil.showToast(MainActivity.mactivity, params);
        if (!TextUtils.isEmpty(params)){
            try{
                JSONObject jsonObject = new JSONObject(params);

                String action  = jsonObject.optString("action");
                JSONObject data  = jsonObject.optJSONObject("data");
                String callbackId  = jsonObject.optString("callbackId");
                //构造回调消息
                JSONObject responseData = new JSONObject(data.toString());
                responseData.put("code",0);
                JSONObject response = new JSONObject();
                response.put("responseData",responseData);
                response.put("responseId",callbackId);
                  System.out.println(response);
                handlerResponnse.dispatchMessage(webView, response);
            } catch (JSONException e){
                e.printStackTrace();
            }
        }
    }
    public boolean handleUrlLoading(WebView webView, String url) {
        boolean isScheme = url.startsWith(RRC_OVERRIDE_SCHEMA);
        if (isScheme) {
            processJSCallFunction(webView, url);
        }
        return isScheme;
    }
}
package com.helpyouworkeasy.blooming;

import android.text.TextUtils;
import android.util.Log;
import android.webkit.WebView;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URLDecoder;

/**
 * plumJsbridge 核心处理类
 * Created by liliuzhu on 2024/8/30.
 */

//public class JSBridgeManagerImpl implements JSBridgeProcesser {
public class plumJsbridgeManager {
    private static final String TAG = plumJsbridgeManager.class.getCanonicalName();
//    @Override
    public void processJSCallFunction(WebView webView, String message){
        customUtil.log("plumJsbridg 入参url为:" + message);
        // 截获参数
        String params = message;
        if (!TextUtils.isEmpty(params)){
            try{
                JSONObject jsonObject = new JSONObject(params);

                String method  = jsonObject.optString("method");
                JSONObject data  = jsonObject.optJSONObject("payload");
                String callback  = jsonObject.optString("callback");
                //构造回调消息
                if (method.equals("headerInfo")) {
                    data = new JSONObject("{\"origin_app_device_id\": \"f7506664fb26b12b\", \"origin_app_device_id_type\": \"oaid\", \"phone_brand\": \"Redmi\", \"phone_model\": \"M2012K11C\", \"phone_ram\": \"7698751488\", \"phone_rom\": \"241895976960\", \"phone_system\": \"11\", \"version\": \"5.2.8\", \"x_aplum_androidid\": \"29f7a1feb4c2cd97\", \"x_aplum_app_channel\": \"channelPlum\", \"x_aplum_imei\": \"RAND_171532217481317\", \"x_aplum_oaid\": \"f7506664fb26b12b\", \"x_aplum_ssid\": \"\", \"x_aplum_token\": \"e205ca3b-03bd-4c89-a378-b74edf1eb535\", \"x_aplum_user_identity\": \"c38ad8fc3194df5894eb828fdf1a29ac30f73ab6651d3e0a6caf86f8632e4a271572973583\", \"x_aplum_userid\": \"1572973583\", \"x_useragent\": \"androidapp\", \"user_identity\": \"c38ad8fc3194df5894eb828fdf1a29ac30f73ab6651d3e0a6caf86f8632e4a271572973583\", \"userIdentity\": \"c38ad8fc3194df5894eb828fdf1a29ac30f73ab6651d3e0a6caf86f8632e4a271572973583\"}");
                    customUtil.log("headerInfo 返参url为:" +data.toString() );
                }
                JSONObject response = data;
                customUtil.println(response);
                handlerResponnse.dispatchMessage(webView, response, callback);
            } catch (JSONException e){
                e.printStackTrace();
            }
        }
    }
    public void handleUrlLoading(WebView webView, String message) {
        processJSCallFunction(webView, message);
    }
}
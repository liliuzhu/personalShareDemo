package com.helpyouworkeasy.blooming;

import android.content.BroadcastReceiver;
import android.content.IntentFilter;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.app.Activity;
import android.telephony.TelephonyManager;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Method;

import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings.LayoutAlgorithm;
import android.webkit.WebStorage;
import android.webkit.WebView;
import android.webkit.WebViewClient;


import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.graphics.Bitmap;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
//import android.widget.LinearLayout;
//import android.widget.RadioGroup;
//import android.widget.Toast;
//import android.widget.Button;
//import android.widget.FrameLayout;
import android.widget.*;


import java.io.File;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.WebSettings.RenderPriority;


import android.annotation.TargetApi;
import android.content.pm.ActivityInfo;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Handler;
import android.view.ViewGroup;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends Activity{
    private WebView webView;

//    private View mCustomView;
//    private int mOriginalSystemUiVisibility;
//    private int mOriginalOrientation;
//    private WebChromeClient.CustomViewCallback mCustomViewCallback;
//    protected FrameLayout mFullscreenContainer;

    /** 视频全屏参数 */
    protected static final FrameLayout.LayoutParams COVER_SCREEN_PARAMS = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
    private View customView;
    private FrameLayout fullscreenContainer;
    private WebChromeClient.CustomViewCallback customViewCallback;
    private String newPower;//最新电量
    private final String reSetHTTP = "http://172.18.2.37:8081";
    protected static  MainActivity mactivity;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mactivity = this;
//
//        TelephonyManager tm = (TelephonyManager) getSystemService(TELEPHONY_SERVICE);
        // 窗口进度条
        requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);
        setContentView(R.layout.activity_main);
        setProgressBarIndeterminate(true);
        webView = (WebView) findViewById(R.id.webView);
        initWebView();
    }
    @Override
    protected void onStart(){  //生命周期
        super.onStart();
//        toastMessage("onStart");
    }
    @Override
    protected void onRestart(){ //生命周期
        super.onRestart();
//        webView.loadUrl("javascript: restart();");//调用html中的js
//        toastMessage("onRestart");
    }
    @Override
    protected void onResume(){ //生命周期
        super.onResume();
//        toastMessage("onResume");
        register();
    }
    @Override
    protected void onPause(){ //生命周期
        super.onPause();
//        toastMessage("onPause");
        unregister();
    }
    @Override
    protected void onStop() { //生命周期
        super.onStop();
//        webView.reload();
//        toastMessage("onStop");
    }

    protected void onDestroy(){
        super.onDestroy();
        toastMessage("onDestroy：关闭APP");

        /***
         * 防止WebView加载内存泄漏
         */
        webView.removeAllViews();
        webView.destroy();
        System.exit(0);
    }

    private void register() {//注册广播
        registerReceiver(batteryChangedReceiver,  new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    }
    private void unregister() {//注销广播
        unregisterReceiver(batteryChangedReceiver);
    }// 接受广播
    private BroadcastReceiver batteryChangedReceiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {
            if (Intent.ACTION_BATTERY_CHANGED.equals(intent.getAction())) {
                int level = intent.getIntExtra("level", 0);
                int scale = intent.getIntExtra("scale", 100);
                String power=newPower= (level * 100 / scale)+"%";
//                webView.loadUrl("javascript:saveEquipmentPower('"+power+"')");//调用html中的js
//                toastMessage("当前电量："+power);
//                Log.d("Deom", "电池电量：:" + power);
//                mBatteryView.setPower(power);
            }
        }
    };


    class JSInterface{   // 代理对象
        @JavascriptInterface //注意这里的注解。出于安全的考虑，4.2 之后强制要求，不然无法从 Javascript 中发起调用
        public void AndroidToastMessage(String message) {
            toastMessage(message);
        }
        @JavascriptInterface
        public void AndroidCloseApp() {
            closeApp();
        }
        @JavascriptInterface
        public String getAndroidEquipmentPower(){
            return  getEquipmentPower();
        }
        @JavascriptInterface
        public String getAndroidEquipmentSN() {
            return getEquipmentSN();
        }
    }
    public void button1Click(View view) { // 按钮点击事件
        toastMessage("native button1被点击");
        String params = "{'action': 'button1', 'data': {'message': '我是nativeButton-1返回的消息'}}";
        String jsonObject = "";
        try{
            jsonObject = (new JSONObject(params)).toString();
            webView.loadUrl("javascript:window.WebViewJavascriptBridge._nativeDispatchToJS(" + jsonObject + ")"); //调用html中的js
        } catch (JSONException e){
            toastMessage(e.toString());
            e.printStackTrace();
        }
    }
    public void reset(View view){ // 复位
        webView.loadUrl(reSetHTTP);
    }
    public void button2Click(View view) { // 按钮点击事件
        toastMessage("native button2被点击");
        String params = "{'action': 'button2', 'data': {'message': '我是nativeButton-2返回的消息'}}";
        String jsonObject = "";
        try{
            jsonObject = (new JSONObject(params)).toString();
            // Android版本变量
            final int version = Build.VERSION.SDK_INT;
            // 因为该方法在 Android 4.4 版本才可使用，所以使用时需进行版本判断
            if (version < 19) {
                webView.loadUrl("javascript:window.WebViewJavascriptBridge._nativeDispatchToJS(" + jsonObject + ")");
            } else {
                webView.evaluateJavascript("javascript:window.WebViewJavascriptBridge._nativeDispatchToJS(" + jsonObject + ")", new ValueCallback<String>() {
                            @Override
                            public void onReceiveValue(String value) {
                                //此处为 js 返回的结果
                                toastMessage("js返回的内容：" + value);
                            }
                        }
                ); //调用html中的js
            }
        } catch (JSONException e){
            toastMessage(e.toString());
            e.printStackTrace();
        }
    }
//    @JavascriptInterface  //js调用比写声明/sdk17版本以上加上注解
    public void toastMessage(String message) { //安卓原生弹框
        customUtil.showToast(getApplicationContext(), message);
//        Toast.makeText(getApplicationContext(), message, Toast.LENGTH_SHORT).show();
    }
    //获取设备电量
    public String getEquipmentPower(){
        return  newPower;
    }
    //退出app
    public void closeApp() {
//		 退出程序
        finish();
    }
    //获取设备号
    public String getEquipmentSN() {
        return android.os.Build.SERIAL;
    }
    // 打开进度条
    protected void openProgressBar(int x) {
        // TODO Auto-generated method stub
        setProgressBarIndeterminateVisibility(true);
        setProgress(x);
    }
    // 关闭进度条
    protected void closeProgressBar() {
        // TODO Auto-generated method stub
        setProgressBarIndeterminateVisibility(false);
    }
    // 改写物理按键 返回键的逻辑
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        // TODO Auto-generated method stub
        if (keyCode == KeyEvent.KEYCODE_BACK) {
//            if (customView != null) {
//                hideCustomView();
//            }else{
//                webView.loadUrl("javascript:ipadBackKey()");//调用html中的js
//            }
			if (webView.canGoBack()) {
				// 返回上一页面
				webView.goBack();
				return true;
			} else {
				// 退出程序
				closeApp();
			}
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @TargetApi(Build.VERSION_CODES.HONEYCOMB)
    private void initWebView() {

        WebSettings settings = webView.getSettings();
        settings.setRenderPriority(RenderPriority.HIGH);
        settings.setUserAgentString(settings.getUserAgentString() + " renrenche/5.4.0"); //添加UA,  “app/XXX”：是与h5商量好的标识，h5确认UA为app/XXX就认为该请求的终端为App

        // 启用支持javascript
        settings.setJavaScriptEnabled(true);// 让webview对象支持解析javascript语句
//        settings.setPluginsEnabled(true);  //支持插件
        settings.setLoadsImagesAutomatically(true);  //支持自动加载图片
        // 开启DOM缓存。  //  打开H5的Dom Storage(localStorage,sessionStorage)
        settings.setDomStorageEnabled(true);  //支持H5本地存储
        settings.setDatabaseEnabled(true);     // 应用可以有数据库
        String dbPath = this .getApplicationContext().getDir( "database" , Context.MODE_PRIVATE).getPath();
        settings.setDatabasePath(dbPath);
        settings.setAllowFileAccess(true);
        settings.setAppCacheEnabled(true); // 应用可以有缓存
        settings.setAppCacheMaxSize(1024*1024*512);//设置缓冲大小，我设的是512M
        String appCachePath = this.getApplicationContext().getDir("cache" , Context.MODE_PRIVATE).getPath();
        settings.setAppCachePath(appCachePath);
        settings.setAllowFileAccess(true); // 允许访问文件
//        settings.setAllowFileAccessFromFileURLs(true);
        settings.setBuiltInZoomControls(false);//设置支持两指缩放手势
        settings.setDisplayZoomControls(false);//隐藏缩放按钮
//	  是否支持缩放，默认不支持(看起来更native)
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON); //屏幕常亮
        // web加载页面优先使用缓存加载
//        settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
//        settings.setCacheMode(WebSettings.LOAD_DEFAULT);  // 建议缓存策略为，判断是否有网络，有的话，使用LOAD_DEFAULT,无网络时，使用LOAD_CACHE_ELSE_NETWORK
        //缓存模式如下：
        //LOAD_CACHE_ONLY: 不使用网络，只读取本地缓存数据
        //LOAD_DEFAULT: （默认）根据cache-control决定是否从网络上取数据。
        //LOAD_NO_CACHE: 不使用缓存，只从网络获取数据.
        //LOAD_CACHE_ELSE_NETWORK，只要本地有，无论是否过期，或者no-cache，都使用缓存中的数据。
        settings.setPluginState(WebSettings.PluginState.ON);// 没有的话会黑屏 支持插件

        //扩大比例的缩放
        settings.setUseWideViewPort(true);
        //自适应屏幕
        settings.setUseWideViewPort(true);//将图片调整到适合webview的大小
        settings.setLayoutAlgorithm(LayoutAlgorithm.SINGLE_COLUMN);//支持内容重新布局
        settings.setLoadWithOverviewMode(true);

        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.HONEYCOMB) {
            // Hide the zoom controls for HONEYCOMB+
            settings.setDisplayZoomControls(false);
        }

        // Enable remote debugging via chrome://inspect
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        initWebViewClient();
    }
    private void initWebViewClient(){
        // 覆盖webView默认通过系统或者第三方浏览器打开网页的行为
        // 如果为false调用系统或者第三方浏览器打开网页的行为
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // TODO Auto-generated method stub
                // webView加载web资源
                if(url == null) return false;
                try {
                    if(new JSBridgeManagerImpl().handleUrlLoading(view, url)){
                        return true;
                    }
                    if (url.startsWith("http:") || url.startsWith("https:")) {
                        view.loadUrl(url);
                        return true;
                    } else {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    }
                } catch (Exception e) { //防止crash (如果手机上没有安装处理某个scheme开头的url的APP, 会导致crash)
                    return false;
                }
            }

//            @Override
//            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
////                Log.i("MainActivity", "加载的资源=" + url);
//                WebResourceResponse response = null;
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB){
//                    response = super.shouldInterceptRequest(view,url);
//                    if (url.contains("jquery-1.11.3.min.js")){
//                        try {
//                            response = new WebResourceResponse("text/javascript","UTF-8",getAssets().open("meetingAndroid/js/jquery-1.11.3.min.js"));
////                            Log.i("MainActivity", "修改的资源=" + response);
//                        } catch (IOException e) {e.printStackTrace();}
//                    }
//                    if (url.contains("bootstrap.min.3.3.5.css")){
//                        try {
//                            response = new WebResourceResponse("text/css","UTF-8",getAssets().open("meetingAndroid/css/bootstrap.min.3.3.5.css"));
////                            Log.i("MainActivity", "修改的资源=" + response);
//                        } catch (IOException e) {e.printStackTrace();}
//                    }
//                }
//                return  response;
//            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                toastMessage("onError");
//                webView.loadUrl("file:///android_asset/meetingAndroid/login.html");
            }
        });
        initWebChromeClient();
    }
    private void initWebChromeClient(){
        // TODO Auto-generated method stub
        // 当打开页面时 显示进度条 页面打开完全时 隐藏进度条
        webView.setWebChromeClient(new WebChromeClient() { // 让webview对象支持解析alert()等特殊的javascript语句
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                // TODO Auto-generated method stub
                setTitle("本页面已加载" + newProgress + "%");
                if (newProgress == 100) {
                    closeProgressBar();
                } else {
                    openProgressBar(newProgress);
                }
                super.onProgressChanged(view, newProgress);
            }
            //扩充缓存的容量
            @Override
            public void onReachedMaxAppCacheSize(long spaceNeeded, long totalUsedQuota , WebStorage.QuotaUpdater  quotaUpdater) {
                //Log.e(APP_CACHE, ”onReachedMaxAppCacheSize reached, increasing space: ” + spaceNeeded);
                quotaUpdater.updateQuota(spaceNeeded * 2);
            }
            /*** 视频播放相关的方法 **/

//            @Override
//            public View getVideoLoadingProgressView() {
//                FrameLayout frameLayout = new FrameLayout(MainActivity.this);
//                frameLayout.setLayoutParams(new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
//                return frameLayout;
//            }

//            @Override
//            public void onShowCustomView(View view, CustomViewCallback callback) {
//                showCustomView(view, callback);
//            }

//            @Override
//            public void onHideCustomView() {
//                hideCustomView();
//            }

        });

        //实现js页面调用android的方法,及android的方法里面再调用js页面的js函数,实现互调的过程.
        //js调用安卓的接口
//        webView.addJavascriptInterface(this, "android");
        webView.addJavascriptInterface(new JSInterface(), "JSInterface");
        // webView加载web资源
        webView.loadUrl(reSetHTTP);
//		startReadUrl("file:///android_asset/meetingAndroid/login.html");
    }


//    /** 视频播放全屏 **/
//    private void showCustomView(View view, WebChromeClient.CustomViewCallback callback) {
//        // if a view already exists then immediately terminate the new one
//        if (customView != null) {
//            callback.onCustomViewHidden();
//            return;
//        }
//
//        MainActivity.this.getWindow().getDecorView();
//
//        FrameLayout decor = (FrameLayout) getWindow().getDecorView();
//        fullscreenContainer = new FullscreenHolder(MainActivity.this);
//        fullscreenContainer.addView(view, COVER_SCREEN_PARAMS);
//        decor.addView(fullscreenContainer, COVER_SCREEN_PARAMS);
//        customView = view;
//        setStatusBarVisibility(false);
//        customViewCallback = callback;
//    }
//
//    /** 隐藏视频全屏 */
//    private void hideCustomView() {
//        if (customView == null) {
//            return;
//        }
//
//        setStatusBarVisibility(true);
//        FrameLayout decor = (FrameLayout) getWindow().getDecorView();
//        decor.removeView(fullscreenContainer);
//        fullscreenContainer = null;
//        customView = null;
//        customViewCallback.onCustomViewHidden();
//        webView.setVisibility(View.VISIBLE);
//    }
//
//    /** 全屏容器界面 */
//    static class FullscreenHolder extends FrameLayout {
//
//        public FullscreenHolder(Context ctx) {
//            super(ctx);
//            setBackgroundColor(ctx.getResources().getColor(android.R.color.black));
//        }
//
//        @Override
//        public boolean onTouchEvent(MotionEvent evt) {
//            return true;
//        }
//    }
//
//    private void setStatusBarVisibility(boolean visible) {
//        int flag = visible ? 0 : WindowManager.LayoutParams.FLAG_FULLSCREEN;
//        getWindow().setFlags(flag, WindowManager.LayoutParams.FLAG_FULLSCREEN);
//    }
}

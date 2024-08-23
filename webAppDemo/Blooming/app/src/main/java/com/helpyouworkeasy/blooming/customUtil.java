package com.helpyouworkeasy.blooming;

import android.os.Build;
import android.os.Looper;
import android.util.Log;
import android.webkit.ValueCallback;
import android.webkit.WebView;
import android.widget.Toast;


/**
 * Created by liliuzhu on 2018/10/11.
 */

public class customUtil { // 自定义工具类
    private static Toast toast;
    private static final String TAG = customUtil.class.getCanonicalName();

    //安卓原生弹框
    public static void showToast(String message) {
//        if (toast == null) {
//            toast = Toast.makeText(context, message, Toast.LENGTH_SHORT);
//        } else {
//            toast.setText(message);
//        }
//        toast.show();

        if (toast != null) {
            toast.cancel();//注销之前显示的那条信息   
            toast = null;//这里要注意上一步相当于隐藏了信息，mtoast并没有为空，我们强制是他为空
        }
        if (toast == null) {
            toast = Toast.makeText(MainActivity.mactivity, message, Toast.LENGTH_LONG);
            toast.show();
        }
    }

    public static void log(String message) {
        Log.i(TAG, "1234567890 "+ message);
//        System.out.println("1234567890"+ message);
    }

    public static void println(Object obj) {
        System.out.println("1234567890 "+ obj);
    }


    public static void evaluateJavascript(WebView webView, String evaluateJavascriptString) {
        if (Thread.currentThread() == Looper.getMainLooper().getThread()) {
            final int version = Build.VERSION.SDK_INT;
            // 因为该方法在 Android 4.4 版本才可使用，所以使用时需进行版本判断
            if (version < 19) {
                webView.loadUrl(evaluateJavascriptString);
            } else {
                webView.evaluateJavascript(evaluateJavascriptString, new ValueCallback<String>() {
                            @Override
                            public void onReceiveValue(String value) {
                                //此处为 js 返回的结果
                                if(!value.equals("null")){
                                    customUtil.log("有返参 "+ evaluateJavascriptString);
                                    showToast("js返回的内容：" + value);
                                }
                            }
                        }
                ); //调用html中的js
            }
        }

    }
}

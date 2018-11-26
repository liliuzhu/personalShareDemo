package com.helpyouworkeasy.blooming;

import android.content.Context;
import android.widget.Toast;
/**
 * Created by liliuzhu on 2018/10/11.
 */

public class customUtil { // 自定义工具类
    private static Toast toast;
    public static void showToast(Context context, String message) {
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
            toast = Toast.makeText(context, message, Toast.LENGTH_SHORT);
            toast.show();
        }
    }
}

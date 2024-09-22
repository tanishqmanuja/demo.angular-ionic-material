package ng.ionic.material;

import android.os.Bundle;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        int clr = getResources().getColor(R.color.colorSplashBackground);

        WebView webview = this.getBridge().getWebView();
        webview.setBackgroundColor(clr);

        getWindow().setStatusBarColor(clr);
        getWindow().setNavigationBarColor(clr);
    }
}

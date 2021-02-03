import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ImageLoaderConfigService } from 'ionic-image-loader';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private imageLoaderConfig:ImageLoaderConfigService
  ) {
    
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.imageLoaderConfig.enableDebugMode();
      this.imageLoaderConfig.setMaximumCacheAge(100000000);
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}

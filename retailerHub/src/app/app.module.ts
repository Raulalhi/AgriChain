import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DataService } from "./services/data.service";
import { HttpClientModule } from "@angular/common/http";
import { ProductrecallpagePageModule } from "./pages/productrecallpage/productrecallpage.module";
import { ProductrecallpagePage } from "./pages/productrecallpage/productrecallpage.page";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    ProductrecallpagePageModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DataService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

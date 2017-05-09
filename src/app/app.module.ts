import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { LoginPage, HomePage, OrderAssignedPage, DeliveryPage, ScanPage, MapPage } from "../pages/pages";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from "@ionic-native/barcode-scanner";

import { AgmCoreModule } from "@agm/core";
import { Geolocation } from "@ionic-native/geolocation";

import { AngularFireModule } from "angularfire2";


export const firebaseConfig = {
    apiKey: "AIzaSyDka8ZQF6bzjPhVJMZFAf7d0BBztxP_spg",
    authDomain: "app-repartos-tft.firebaseapp.com",
    databaseURL: "https://app-repartos-tft.firebaseio.com",
    projectId: "app-repartos-tft",
    storageBucket: "app-repartos-tft.appspot.com",
    messagingSenderId: "1059307361256"
};

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    OrderAssignedPage,
    DeliveryPage,
    ScanPage,
    MapPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyCRZ1a2eZSr-se_9Qclwapy0_6qx1BJ-Pw'
    }),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    OrderAssignedPage,
    DeliveryPage,
    ScanPage,
    MapPage
  ],
  providers: [
    Geolocation,
    BarcodeScanner,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

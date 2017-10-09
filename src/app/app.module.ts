import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { LoginPage, HomePage, OrderAssignedPage, DeliveryPage, ScanPage, MapPage, DrawpadPage } from "../pages/pages";

import { AuthData } from '../providers/auth-data';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from "@ionic-native/barcode-scanner";

import { AgmCoreModule } from "@agm/core";
import { Geolocation } from "@ionic-native/geolocation";
import { BackgroundGeolocation } from "@ionic-native/background-geolocation";

import { AngularFireModule, AuthProviders, AuthMethods } from "angularfire2";

import { SignaturePadModule } from "angular2-signaturepad";
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';

import { GoogleMaps } from "@ionic-native/google-maps";

export const firebaseConfig = {
    apiKey: "AIzaSyDka8ZQF6bzjPhVJMZFAf7d0BBztxP_spg",
    authDomain: "app-repartos-tft.firebaseapp.com",
    databaseURL: "https://app-repartos-tft.firebaseio.com",
    projectId: "app-repartos-tft",
    storageBucket: "app-repartos-tft.appspot.com",
    messagingSenderId: "1059307361256"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    OrderAssignedPage,
    DeliveryPage,
    ScanPage,
    MapPage,
    DrawpadPage
  ],
  imports: [
    BrowserModule,
    SignaturePadModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyCRZ1a2eZSr-se_9Qclwapy0_6qx1BJ-Pw'
    }),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    OrderAssignedPage,
    DeliveryPage,
    ScanPage,
    MapPage,
    DrawpadPage
  ],
  providers: [
    Geolocation,
    LocationTrackerProvider,
    BackgroundGeolocation,
    GoogleMaps,
    BarcodeScanner,
    StatusBar,
    SplashScreen,
    AuthData,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import {AppVersion} from "@ionic-native/app-version";
import {AppRate} from "@ionic-native/app-rate";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {Clipboard} from "@ionic-native/clipboard";
import {GooglePlus} from "@ionic-native/google-plus";
import {AdMobFree} from "@ionic-native/admob-free";

import firebase from "firebase";
import {myList} from "../services/list";
var config = {
 
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppVersion,
    AppRate,
    AndroidPermissions,
    Clipboard,
    GooglePlus,
    AdMobFree,
    myList,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

import {Component, OnInit} from '@angular/core';
import {List, LoadingController, NavController, ToastController} from 'ionic-angular';
import firebase from 'firebase';
import {myList} from "../../services/list";
import {
  AdMobFree,
  AdMobFreeBannerConfig,
  AdMobFreeInterstitialConfig,
  AdMobFreeRewardVideoConfig
} from "@ionic-native/admob-free";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  sub :any;
  main : any;
  hashtags : any;
  hashtag : any;
  loading : any;
  flag = false;

  // REWARDS
  // M id : ca-app-pub-4781041300358039/4943879735
  //rewardId:string = 'ca-app-pub-4781041300358039/4943879735';
  // T id : ca-app-pub-3940256099942544/5224354917
  rewardId:string = 'ca-app-pub-3940256099942544/5224354917';

  // BANNERS
  // M id : ca-app-pub-4781041300358039/8018154694
  //bannerId:string = 'ca-app-pub-4781041300358039/8018154694';
  // T id : ca-app-pub-3940256099942544/6300978111
  bannerId:string = 'ca-app-pub-3940256099942544/6300978111';

  interId:string = 'ca-app-pub-3940256099942544/1033173712';

  testing:boolean = false;
  isAdReady:boolean = false;
  i : number = 0;
  j : number = 0;


  constructor(
    public admobFree: AdMobFree,public navCtrl: NavController,public mL:myList, public toastCtrl : ToastController,public loadingCtrl:LoadingController) {
    this.presentLoadingDefault();

    const interConfig: AdMobFreeInterstitialConfig = {
      // add your config here
      // for the sake of this example we will just use the test config
      id: this.interId,
      autoShow: false,
      isTesting : this.testing
    };
    this.admobFree.interstitial.config(interConfig);

    const videoConfig: AdMobFreeRewardVideoConfig = {
      // add your config here
      // for the sake of this example we will just use the test config
      id: this.rewardId,
      autoShow: false,
      isTesting :this.testing
    };
    this.admobFree.rewardVideo.config(videoConfig);

    this.prepare();
    this.prepareInter();
    this.showBannerAd();

    this.admobFree.on(this.admobFree.events.REWARD_VIDEO_REWARD).subscribe(() => {
      this.admobFree.interstitial.show();
      this.loading.dismiss();
      this.getHashtag();

    });

    this.admobFree.on(this.admobFree.events.REWARD_VIDEO_CLOSE).subscribe(() => {
      this.presentLoadingDefault();
      this.prepare();


    });

    this.admobFree.on(this.admobFree.events.REWARD_VIDEO_LOAD).subscribe(() => {
      const toast = this.toastCtrl.create({
        message: 'Video loaded.',
        position: 'bottom',
        duration: 1000
      });
      toast.present();
      this.loading.dismiss();
      this.prepareInter();
    });

    this.admobFree.on(this.admobFree.events.REWARD_VIDEO_LOAD_FAIL).subscribe(() => {
      const toast = this.toastCtrl.create({
        message: 'Please try again later.',
        showCloseButton: true,
        closeButtonText: 'Ok',
        duration: 2000
      });
      toast.present();
      this.loading.dismiss();
    });
  }

  prepare(){

    this.admobFree.rewardVideo.prepare().then(() => {

      setTimeout(() => {
        //console.log('Test');
        this.loading.dismiss();
      }, 5000);

    });
  }


  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();

  }

  ngOnInit(){
    this.getMain();

  }

  getMain(){
    firebase.database().ref('root/main').on('value', (snapshot) => {
      var returnArr = [];

      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();

        returnArr.push(item);
      });
      console.log(returnArr);

      this.main = returnArr;
    });


    firebase.database().ref('root/sub').on('value', (snapshot) => {
      var returnArr = [];

      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();

        returnArr.push(item);
      });
      console.log(returnArr);
      this.sub = returnArr;
    });





  }

  onClick(i : number, j: number){
    this.i = i;
    this.j = j;

    this.admobFree.rewardVideo.show();

  }

  getHashtag(){
    firebase.database().ref('root/hashtags/'+this.i+'/'+this.j).on('value', (snapshot) => {

      console.log(snapshot.val());
      this.hashtag = snapshot.val();

      const toast = this.toastCtrl.create({
        message: this.hashtag,
        duration: 3000,
        position : 'top'
      });
      toast.present();
    });
  }

  showBannerAd(){
    const bannerConfig: AdMobFreeBannerConfig = {
      // add your config here
      // for the sake of this example we will just use the test config
      id: this.bannerId,
      autoShow: true,
      isTesting : this.testing
    };
    this.admobFree.banner.config(bannerConfig);
    this.admobFree.banner.prepare().then(() => {
      this.admobFree.banner.show();
    })
  }

  prepareInter(){
    this.admobFree.interstitial.prepare();
  }






}

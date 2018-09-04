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
import {Clipboard} from "@ionic-native/clipboard";

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
  // M id : ca-app-pub-4781041300358039/1144485857
  //rewardId:string = 'ca-app-pub-4781041300358039/1144485857';
  // T id : ca-app-pub-3940256099942544/5224354917
  rewardId:string = 'ca-app-pub-4781041300358039/1144485857';

  // BANNERS
  // M id : ca-app-pub-4781041300358039/4728507642
  //bannerId:string = 'ca-app-pub-4781041300358039/4728507642';
  // T id : ca-app-pub-3940256099942544/6300978111
  bannerId:string = 'ca-app-pub-4781041300358039/4728507642';

  // M id: ca-app-pub-4781041300358039/6943607442
  // T id : ca-app-pub-3940256099942544/1033173712
  interId:string = 'ca-app-pub-4781041300358039/6943607442';

  testing:boolean = false;
  isRewardReady:boolean = false;
  isInterstitialReady:boolean = false;
  isRunningReward : boolean  = false;
  i : number = 0;
  j : number = 0;


  constructor(private clipboard: Clipboard,public admobFree: AdMobFree, public navCtrl: NavController,
              public mL:myList, public toastCtrl : ToastController,public loadingCtrl:LoadingController) {
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

    this.admobFree.rewardVideo.prepare();
    this.admobFree.interstitial.prepare();
    this.showBannerAd();

    this.admobFree.on(this.admobFree.events.INTERSTITIAL_LOAD).subscribe(() => this.isInterstitialReady = true);

    this.admobFree.on(this.admobFree.events.INTERSTITIAL_LOAD_FAIL).subscribe(() => this.isInterstitialReady = false);

    this.admobFree.on(this.admobFree.events.INTERSTITIAL_CLOSE).subscribe(() => {
      this.getHashtag();
      this.admobFree.interstitial.prepare();
    });

    this.admobFree.on(this.admobFree.events.REWARD_VIDEO_REWARD).subscribe(() => {
      this.admobFree.interstitial.show();
      this.getHashtag();
    });

    this.admobFree.on(this.admobFree.events.REWARD_VIDEO_CLOSE).subscribe(() => this.admobFree.rewardVideo.prepare());

    this.admobFree.on(this.admobFree.events.REWARD_VIDEO_LOAD).subscribe(() => {
      this.isRewardReady = true;
    });

    this.admobFree.on(this.admobFree.events.REWARD_VIDEO_LOAD_FAIL).subscribe(() => {
      const toast = this.toastCtrl.create({
        message: 'Please try again later.',
        showCloseButton: true,
        closeButtonText: 'Ok',
        duration: 2000,
        position : 'top'
      });
      toast.present();
      this.isRewardReady = false;
    });


  }

  onClick(i : number, j: number){
    this.i = i;
    this.j = j;
    if(this.isRewardReady){
      this.isRunningReward = true;
      this.admobFree.rewardVideo.show();
    }else{
      this.admobFree.rewardVideo.prepare();
      if(this.isInterstitialReady){
        this.isRunningReward = false;
        this.admobFree.interstitial.show();
      }else{
       /* const toast3 = this.toastCtrl.create({
          message: 'Please try again later.',
          showCloseButton: true,
          closeButtonText: 'Ok',
          duration: 2000
        });
        toast3.present();*/
        this.admobFree.interstitial.prepare();
      }
    }

  }

  getHashtag(){
    firebase.database().ref('root/hashtags/'+this.i+'/'+this.j).on('value', (snapshot) => {

      console.log(snapshot.val());
      this.hashtag = snapshot.val();

      this.clipboard.copy(this.hashtag).then(() =>{
        const toast2 = this.toastCtrl.create({
          message: 'We copied '+this.sub[this.i][this.j]+' hashtags on your clipboard.',
          showCloseButton : true,
          closeButtonText : 'Thanks',
          position : 'bottom'
        });
        toast2.present();
      });
    });
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
      this.loading.dismiss();
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

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();

  }

  ngOnInit(){
    this.getMain();
  }

}

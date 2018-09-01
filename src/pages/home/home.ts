import {Component, OnInit} from '@angular/core';
import {List, LoadingController, NavController, ToastController} from 'ionic-angular';
import firebase from 'firebase';
import {myList} from "../../services/list";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  sub :any;
  main : any;
  hashtags : any;
  loading : any;
  flag = false;

  constructor(public navCtrl: NavController,public mL:myList, public toastCtrl : ToastController,public loadingCtrl:LoadingController) {
    this.presentLoadingDefault();
    this.getMain(this.mL);

  }


  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();

  }



  onClick(i : number, j: number){
    const toast = this.toastCtrl.create({
      message: this.mL.hashtags[i][j],
      duration: 3000
    });
    toast.present();
  }

  getMain(mL:myList){
    firebase.database().ref('root/main').on('value', function(snapshot) {
      var returnArr = [];

      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();

        returnArr.push(item);
      });
      console.log(returnArr);

      mL.main=returnArr;
      return returnArr;
    });

    //console.log('helloo '+this.main);

    firebase.database().ref('root/sub').on('value', function(snapshot) {
      var returnArr = [];

      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();

        returnArr.push(item);
      });
      console.log(returnArr);
      mL.sub = returnArr;
      return returnArr;
    });


    firebase.database().ref('root/hashtags').on('value', function(snapshot) {
      var returnArr = [];

      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();

        returnArr.push(item);
      });
      console.log(returnArr);
      mL.hashtags = returnArr;
      return returnArr;
    });

    this.loading.dismiss();
    return;
  }

}

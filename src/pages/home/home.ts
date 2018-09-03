import {Component, OnInit} from '@angular/core';
import {List, LoadingController, NavController, ToastController} from 'ionic-angular';
import firebase from 'firebase';
import {myList} from "../../services/list";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  sub :any;
  main : any;
  hashtags : any;
  loading : any;
  flag = false;

  constructor(public navCtrl: NavController,public mL:myList, public toastCtrl : ToastController,public loadingCtrl:LoadingController) {
    this.presentLoadingDefault();

    setTimeout(() => {
      //console.log('Test');
      this.loading.dismiss();
    }, 5000);
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

    //console.log('helloo '+this.main);

    firebase.database().ref('root/sub').on('value', (snapshot) => {
      var returnArr = [];

      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();

        returnArr.push(item);
      });
      console.log(returnArr);
      this.sub = returnArr;
    });


    firebase.database().ref('root/hashtags').on('value', (snapshot) => {
      var returnArr = [];

      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();

        returnArr.push(item);
      });
      console.log(returnArr);
      this.hashtags = returnArr;
    });


  }

  onClick(i : number, j: number){
    const toast = this.toastCtrl.create({
      message: this.hashtags[i][j],
      duration: 3000
    });
    toast.present();
  }



}

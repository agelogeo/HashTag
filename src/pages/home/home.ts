import {Component, OnInit} from '@angular/core';
import {List, NavController, ToastController} from 'ionic-angular';
import firebase from 'firebase';
import {myList} from "../../services/list";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  sub :any;
  main : any;
  hashtags : any;

  flag = false;

  constructor(public navCtrl: NavController,public mL:myList, public toastCtrl : ToastController) {

    this.getMain(mL);
  }

  getMain(mL:myList){
    firebase.database().ref('root/main').on('value', function(snapshot) {
      var returnArr = [];

      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();

        returnArr.push(item);
      });
      console.log(returnArr);
      mL.main = returnArr;
      return returnArr;
    });

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
  }

  onClick(i : number, j: number){
    const toast = this.toastCtrl.create({
      message: this.hashtags[i][j],
      duration: 3000
    });
    toast.present();
  }

  onBtn(){
    this.flag=true;
    //console.log(this.mL.sub[0][0]);
    this.main = this.mL.main;
    this.sub = this.mL.sub;
    this.hashtags = this.mL.hashtags;

  }



}

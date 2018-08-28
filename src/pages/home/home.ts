import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  categories = [
    {
      id : 1,
      name: '🐶 Animals',
      hashtags : ['Animals General','Dogs','Cats','Horses','Insects','Fish']
    },
  ];

  constructor(public navCtrl: NavController) {

  }

}

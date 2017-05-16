import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { AngularFire } from "angularfire2";


@Component({
    templateUrl: 'drawpad.page.html'
})

export class DrawpadPage {

    constructor(private nav: NavController,
                private navParams: NavParams,
                private loadingController: LoadingController) {


    }

    ionViewDidLoad(){
        
    }

    save(){

    }


}

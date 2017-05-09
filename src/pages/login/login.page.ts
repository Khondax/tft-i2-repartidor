import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';

import { AngularFire } from "angularfire2";

import _ from 'lodash';

import { HomePage } from '../pages';

 @Component ({
     templateUrl: 'login.page.html',
 })

export class LoginPage {
     
    deliveryMen = [];
    private allMen: any;
     
    constructor(public nav: NavController,
                public loadingController: LoadingController,
                public toastController: ToastController,
                public angularFire: AngularFire,
                public alertController: AlertController,){
    }

    ionViewDidLoad(){
        let loader = this.loadingController.create({
            content: 'Cargando...',
            spinner: 'bubbles'
        });

        loader.present().then(() => {
            this.angularFire.database.list('/repartidores').subscribe(data => {
                this.allMen =
                    _.chain(data)
                    .orderBy('nombre')
                    .value();

                this.deliveryMen = this.allMen;

                loader.dismiss();
            });
        }); 
    
    }

    login($event, deliverer){
        this.nav.push(HomePage, deliverer);
    }



}
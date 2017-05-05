import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';

import { BarcodeScanner } from "@ionic-native/barcode-scanner";

import { AngularFire, FirebaseListObservable } from "angularfire2";

import moment from 'moment';

 @Component ({
     templateUrl: 'scan.page.html',
 })

 export class ScanPage {

    results: any;
    string: any;
    order: FirebaseListObservable<any>;


    constructor(public barcodeScanner: BarcodeScanner,
                public nav: NavController,
                public angularFire: AngularFire,
                public alertController: AlertController,
                public toastController: ToastController){ 
                    
        this.order = angularFire.database.list('/pedidos');
    }

    scan(){
        this.barcodeScanner.scan().then((barcodeData) => {
            this.results = barcodeData;
        }, (err) => {
            alert(`Error al escanear: ${err}`);
        });
    }

    reset(){
        this.results = null;
    }

    save(){
        
        this.string = this.results.text.split("#");

    }

 }
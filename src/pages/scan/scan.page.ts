import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController, NavParams, ModalController } from 'ionic-angular';

import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { AngularFire, FirebaseListObservable } from "angularfire2";
import moment from 'moment';

import { DrawpadPage } from "../pages";

 @Component ({
     templateUrl: 'scan.page.html',
 })

 export class ScanPage {

    order: any;
    results: any;
    orderData: FirebaseListObservable<any>;

    signatureImage: any;

    constructor(private barcodeScanner: BarcodeScanner,
                private nav: NavController,
                private navParams: NavParams,
                private angularFire: AngularFire,
                private alertController: AlertController,
                private toastController: ToastController,
                private modalController: ModalController){ 
                    
        this.order = navParams.get('data');
        this.signatureImage = navParams.get('signatureImage');
        this.orderData = angularFire.database.list('/pedidos');
    }

    scan(){
        this.barcodeScanner.scan().then((barcodeData) => {
            if (barcodeData.text == this.order.idPaquete){
                this.results = barcodeData;
            } else {
                let toast = this.toastController.create({
                    message: "El paquete escaneado no coincide con el que ha seleccionado para entregar",
                    duration: 4000,
                    position: 'middle'
                });

                toast.present();
            }
        }, (err) => {
            alert(`Error al escanear: ${err}`);
        });
    }

    reset(){
        this.results = null;
    }

    save(num){

        if (num == 0){
            this.orderData.update(this.order.$key, {estado: "En reparto"});

            let toast = this.toastController.create({
                message: "El paquete se ha añadido a la lista de entregas",
                duration: 2000,
                position: 'bottom'
            });

            toast.present();
            this.nav.pop();
        } else if (num == 1){

            setTimeout(() => {
                let modal = this.modalController.create(DrawpadPage, this.order);
                modal.present();
            }, 300);

        }


    }

    finishDeliver(){

        //TODO: terminar el update, sincronizar con el admin...
        this.orderData.update(this.order.$key, {});

        let toast = this.toastController.create({
            message: "Se supone que se ha entregado",
            duration: 2000,
            position: 'bottom'
        });

        toast.present();
    }

 }
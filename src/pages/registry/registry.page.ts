import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { AngularFire } from "angularfire2";
import { AuthData } from '../../providers/auth-data';

import _ from 'lodash';

 @Component ({
     templateUrl: 'registry.page.html',
     selector: 'registry.page.scss'
 })

 export class RegistryPage {

    orders = [];
    private allDates: any;
    queryText: string = "";

    deliverer: any;
    deliveryMan: any = {};

    constructor(public nav: NavController,
                public alertController: AlertController,
                public angularFire: AngularFire,
                private authData: AuthData,
                public loadingController: LoadingController){

    }

    ionViewDidLoad(){

        let loader = this.loadingController.create ({
            content: 'Obteniendo datos...',
            spinner: 'bubbles'
        });

        loader.present().then(() => {
            this.angularFire.database.list('/repartidores').subscribe(data => {
                this.deliveryMan = _.chain(data)
                                .filter(o => o.UID === this.authData.getCurrentUid())
                                .value();
                this.deliverer = this.deliveryMan[0];
            });

            this.angularFire.database.list('/pedidos').subscribe(data => {
                this.allDates = 
                    _.chain(data)
                     .filter(o => o.idRepartidor === this.deliverer.$key)
                     .orderBy('fechaEntrega', 'desc')
                     .groupBy(fecha => fecha.fechaEntrega.split('T').shift())
                     .toPairs()
                     .map(item => _.zipObject(['date', 'order'], item))
                     .value();

                this.orders = _.chain(this.allDates)
                               .orderBy('date', 'desc')
                               .value();

                loader.dismiss();

            });
        });

    }

    search(){
        let queryTextLower = this.queryText.toLowerCase();
        let filteredOrders = [];
        
        _.forEach(this.allDates, dat => {
            let orders = _.filter(dat.order, or => (<any>or).repartidor.toLowerCase()
            .includes(queryTextLower) || (<any>or).fechaEntrega.toLowerCase()
            .includes(queryTextLower) || (<any>or).remitente.toLowerCase()
            .includes(queryTextLower) || (<any>or).idPaquete.toString().includes(queryTextLower));
            if (orders.length) {
                filteredOrders.push({ date: dat.date, order: orders});
            }
        });

        this.orders = filteredOrders;
    }


 }
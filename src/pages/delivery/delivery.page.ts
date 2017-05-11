import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import _ from 'lodash';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { AuthData } from '../../providers/auth-data';
import moment from "moment";


@Component({
    templateUrl: 'delivery.page.html'
})

export class DeliveryPage {

    deliverer: any;
    deliveryMan: any;

    private ordersData: any;
    deliveryOrders = [];
    deliveryOrdersData: any;


    constructor(private nav: NavController,
                private navParams: NavParams,
                private loadingController: LoadingController,
                private angularFire: AngularFire,
                private authData: AuthData) {


    }

    ionViewDidLoad(){

        this.angularFire.database.list('/repartidores').subscribe(data => {
                this.deliveryMan = _.chain(data)
                                  .filter(o => o.UID === this.authData.getCurrentUid())
                                  .value();
                this.deliverer = this.deliveryMan[0];
                console.log(this.deliverer);
        });

        let loader = this.loadingController.create({
            content: 'Obteniendo datos...',
            spinner: 'bubbles'
        });

        loader.present().then(() => {
            this.angularFire.database.list('/pedidos').subscribe(data => {
                this.ordersData = _.chain(data)
                                  .filter(o => o.estado === "En reparto" && o.idRepartidor === this.deliverer.$key)
                                  .groupBy('codigoPostal')
                                  .toPairs()
                                  .map(item => _.zipObject(['codPos', 'pedido'], item))
                                  .value();

                this.deliveryOrdersData = _.chain(this.ordersData)
                                          .orderBy('direccion')
                                          .value();

                this.deliveryOrders = this.deliveryOrdersData;

                loader.dismiss();
            });
        });

    }

}

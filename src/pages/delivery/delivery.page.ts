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

    private orders: any;
    ordersData: any;

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

        this.ordersData = this.angularFire.database.list('/pedidos')

        loader.present().then(() => {
            this.angularFire.database.list('/pedidos').subscribe(data => {
                this.orders = _.chain(data)
                                  .filter(o => o.estado === "En reparto" && o.estado === "Siguiente en entrega" && o.idRepartidor === this.deliverer.$key)
                                  .groupBy('codigoPostal')
                                  .toPairs()
                                  .map(item => _.zipObject(['codPos', 'pedido'], item))
                                  .value();

                this.deliveryOrdersData = _.chain(this.orders)
                                          .orderBy('direccion')
                                          .value();

                this.deliveryOrders = this.deliveryOrdersData;

                loader.dismiss();
            });
        });

    }

    nextDelivery(order){
        if (order.estado === "En reparto"){
            this.ordersData.update(order.$key, {estado: "Siguiente en entrega"});
        } else if (order.estado === "Siguiente en entrega"){
            this.ordersData.update(order.$key, {estado: "En reparto"});
        }
    }

}

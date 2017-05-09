import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import _ from 'lodash';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import moment from "moment";
import { Geolocation } from "@ionic-native/geolocation";

import { ScanPage, MapPage } from "../pages";

@Component({
    templateUrl: 'orderAssigned.page.html'
})
export class OrderAssignedPage {
        
    deliverer: any;

    delivererData: any;
    private position: any;
    private lat: any;
    private long: any;

    private ordersData: any;
    assignedOrders = [];
    assignedOrdersData: any;


    constructor(private nav: NavController,
                private navParams: NavParams,
                private loadingController: LoadingController,
                private geolocation: Geolocation,
                private angularFire: AngularFire) {


    }

    ionViewDidLoad(){
        this.deliverer = this.navParams.data;

        this.delivererData = this.angularFire.database.list('/repartidores')

        this.position = this.geolocation.watchPosition({ maximumAge: 10000, enableHighAccuracy: true }).subscribe((data) => {
            this.lat = data.coords.latitude;
            this.long = data.coords.longitude;

            this.delivererData.update(this.deliverer.$key, {latitud: this.lat, longitud: this.long, horaCapturaGPS: moment().format()});

        });

        let loader = this.loadingController.create({
            content: 'Obteniendo datos...',
            spinner: 'bubbles'
        });

        loader.present().then(() => {
            this.angularFire.database.list('/pedidos').subscribe(data => {
                this.ordersData = _.chain(data)
                                  .filter(o => o.estado === "Asignado" && o.idRepartidor === this.deliverer.$key)
                                  .groupBy('codigoPostal')
                                  .toPairs()
                                  .map(item => _.zipObject(['codPos', 'pedido'], item))
                                  .value();

                this.assignedOrdersData = _.chain(this.ordersData)
                                          .orderBy('direccion')
                                          .value();

                this.assignedOrders = this.assignedOrdersData;

                loader.dismiss();
            });
        });

    }

    goToScan($event, order){
        this.nav.push(ScanPage, order);
    }

    goToMap($event, order){
        this.nav.push(MapPage, order);
    }


}

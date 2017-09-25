import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import _ from 'lodash';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import moment from "moment";
import { Geolocation } from "@ionic-native/geolocation";
import { AuthData } from '../../providers/auth-data';

import { ScanPage, MapPage } from "../pages";

@Component({
    templateUrl: 'orderAssigned.page.html',
    selector: 'orderAssigned.page.scss'
})

export class OrderAssignedPage {
        
    deliverer: any;
    deliveryMan: any;

    delivererData: any;
    private position: any;
    private lat: any;
    private long: any;

    private ordersData: any;
    assignedOrders = [];
    assignedOrdersData: any;

    allOrders = [];

    map: any = {};

    constructor(private nav: NavController,
                private loadingController: LoadingController,
                private geolocation: Geolocation,
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

                this.allOrders = _.chain(data)
                                 .filter(a => (a.estado === "Asignado" || a.estado === "En reparto" || a.estado === "Siguiente en entrega") && a.idRepartidor === this.deliverer.$key)
                                 .value();

                loader.dismiss();
            });
            
            this.map = {
                lat: 27.942246703329612,
                lng: -15.598526000976562,
                zoom: 9
            };
            
        });

    }

    goToScan($event, order){
        this.nav.push(ScanPage, {data: order});
    }

    goToMap($event, order){
        this.nav.push(MapPage, order);
    }

    getCorrectColor(order){
        switch (order.estado) {
            case "Asignado":
                return '../../assets/marker-icons/marker_blue.png';
            case "En reparto":
                return '../../assets/marker-icons/marker_green.png';
            case "Siguiente en entrega":
                return '../../assets/marker-icons/marker_red.png';
        }
    }
    

}

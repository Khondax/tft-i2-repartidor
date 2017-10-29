import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import _ from 'lodash';
import { AngularFire } from "angularfire2";
import moment from "moment";

import { Geolocation } from "@ionic-native/geolocation";

import { AuthData } from '../../providers/auth-data';

import { ScanPage, MapPage } from "../pages";

import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';

import { CallNumber } from "@ionic-native/call-number";

@Component({
    templateUrl: 'orderAssigned.page.html',
    selector: 'orderAssigned.page.scss'
})

export class OrderAssignedPage {
        
    deliverer: any;
    deliveryMan: any = {};

    delivererData: any;
    private position: any;

    private ordersData: any;
    assignedOrders = [];
    assignedOrdersData: any;

    allOrders = [];

    mapElement: HTMLElement;

    constructor(private nav: NavController,
                private loadingController: LoadingController,
                private geolocation: Geolocation,
                private angularFire: AngularFire,
                private authData: AuthData,
                public locationTracker: LocationTrackerProvider,
                private callNumber: CallNumber) {

        this.locationTracker.startTracking();

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
            
        });

        this.position = this.geolocation.watchPosition({ maximumAge: 10000, enableHighAccuracy: true }).subscribe((data) => {
            this.delivererData.update(this.deliverer.$key, {latitud: data.coords.latitude, longitud: data.coords.longitude, horaCapturaGPS: moment().format()});
        });

        this.position = this.locationTracker.horaCaptura.subscribe((data) => {
            console.log("DATOS: " + data);
            this.delivererData.update(this.deliverer.$key, {latitud: this.locationTracker.lat, longitud: this.locationTracker.lng, horaCapturaGPS: this.locationTracker.horaCaptura});
        });
        
    }

    goToScan($event, order){
        this.nav.push(ScanPage, {data: order});
    }

    goToMap($event, order){

        var data = []
        data[0] = {position: {lng: order.longitud, lat: order.latitud}, title: order.direccion};
        
        this.nav.push(MapPage, data);
    }
    
    goToCluster(){
        var data = [];
        
        for(var i=0; i < this.allOrders.length; i++){
            data[i]= {position: {lng: this.allOrders[i].longitud, lat: this.allOrders[i].latitud}, title: this.allOrders[i].direccion};
        }

        this.nav.push(MapPage, data);
    }

    goToPhone($event, order){
        this.callNumber.callNumber(order.telf, true)
            .then(() => console.log('Teléfono lanzado!'))
            .catch(() => console.log('Error al lanzar el teléfono'));
    }

    refresh(refresher){
        refresher.complete();
        this.ionViewDidLoad();
    }

}
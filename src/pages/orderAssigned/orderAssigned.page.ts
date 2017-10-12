import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import _ from 'lodash';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import moment from "moment";

import { Geolocation } from "@ionic-native/geolocation";

import { AuthData } from '../../providers/auth-data';

import { ScanPage, MapPage } from "../pages";

import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';

import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent, CameraPosition, MarkerOptions, Marker, MarkerCluster, LatLng } from "@ionic-native/google-maps";

@Component({
    templateUrl: 'orderAssigned.page.html',
    selector: 'orderAssigned.page.scss'
})

export class OrderAssignedPage {
        
    deliverer: any;
    deliveryMan: any;

    delivererData: any;
    private position: any;

    private ordersData: any;
    assignedOrders = [];
    assignedOrdersData: any;

    allOrders = [];

    map1: GoogleMap;
    mapElement: HTMLElement;

    constructor(private nav: NavController,
                private loadingController: LoadingController,
                private geolocation: Geolocation,
                private angularFire: AngularFire,
                private authData: AuthData,
                public locationTracker: LocationTrackerProvider,
                private googleMaps: GoogleMaps
               ) {

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

                //this.loadMap();
            
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

    loadMap(){
        this.mapElement = document.getElementById('map1');
        
        let mapOptions: GoogleMapOptions = {
            camera: {
                target: {
                    lat: 27.9422467,
                    lng: -15.598526,
                },
                zoom: 9,
                tilt: 10
            }
        };

        this.map1 = this.googleMaps.create(this.mapElement, mapOptions);


         this.map1.one(GoogleMapsEvent.MAP_READY).then(() => {
            console.log('Mapa listo!');

             this.map1.addMarkerCluster({
                boundsDraw: true,
                markers: this.addMarkers(),
                icons: [
                    {min: 2, max: 5, url: 'assets/marks/m1.png', anchor: {x: 16, y: 16}},
                    {min: 5, max: 10, url: 'assets/marks/m2.png', anchor: {x: 16, y: 16}},
                    {min: 10, max: 20, url: 'assets/marks/m3.png', anchor: {x: 24, y: 24}},
                ]
            });
    
        });
    
    }

    addMarkers(){
        
        var data = [];

        for(var i=0; i < this.allOrders.length; i++){
            data[i]= {position: {lng: this.allOrders[i].longitud, lat: this.allOrders[i].latitud}, title: this.allOrders[i].direccion};
        }

        return data;
    }

    ionViewWillUnload(){
        this.locationTracker.stopTracking();
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
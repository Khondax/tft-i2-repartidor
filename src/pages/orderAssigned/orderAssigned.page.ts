import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';

import _ from 'lodash';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import moment from "moment";

import { Geolocation } from "@ionic-native/geolocation";

import { AuthData } from '../../providers/auth-data';

import { ScanPage, MapPage } from "../pages";

import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';

import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent, CameraPosition, MarkerOptions, Marker, MarkerCluster } from "@ionic-native/google-maps";


@Component({
    templateUrl: 'orderAssigned.page.html',
    selector: 'orderAssigned.page.scss'
})

export class OrderAssignedPage {
        
    deliverer: any;
    deliveryMan: any;

    delivererData: any;
    private position: any;
    //private lat: any;
    //private long: any; 

    private ordersData: any;
    assignedOrders = [];
    assignedOrdersData: any;

    allOrders = [];

    //map: any = {};

    map: GoogleMap;
    mapElement: HTMLElement;

    data = [];

    constructor(private nav: NavController,
                private loadingController: LoadingController,
                private geolocation: Geolocation,
                private angularFire: AngularFire,
                private authData: AuthData,
                public locationTracker: LocationTrackerProvider,
                private googleMaps: GoogleMaps
               ) {

/*         this.map = {
            lat: 27.942246703329612,
            lng: -15.598526000976562,
            zoom: 9,
        }; */

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


        this.loadMap();

        
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

    loadMap(){
        this.mapElement = document.getElementById('map1');
        
        //let location = new LatLng(this.order.latitud, this.order.longitud);

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

        this.map = this.googleMaps.create(this.mapElement, mapOptions);


         this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
            console.log('Mapa listo!');


/*             for (var order = 0; order < this.allOrders.length; order++) {
                var data =+ {position: {lng: this.allOrders[order].longitud, lat: this.allOrders[order].latitud},
                title: this.allOrders[order].direccion}
            } */

            
            for(var order=0; order < this.allOrders.length; order++){
                this.data[order]= {position: {lng: this.allOrders[order].longitud, lat: this.allOrders[order].latitud}, title: this.allOrders[order].direccion};
            }
            

            /* for (var order = 0; order < this.allOrders.length; order++) {
                this.map.addMarker({
                    title: this.allOrders[order].direccion,
                    icon: 'red',
                    animation: 'DROP',
                    position: {
                        lat: this.allOrders[order].latitud,
                        lng: this.allOrders[order].longitud
                    }
                });     
            } */
            
    
        });
    
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
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent, CameraPosition, MarkerOptions, Marker, MarkerCluster } from "@ionic-native/google-maps";

declare var window: any;

//declare var google;

@Component({
    templateUrl: 'map.page.html',
    selector: 'map.page.scss'
})

export class MapPage {

    order: any;
    //map: any = {};
    map2: GoogleMap;
    mapElement: HTMLElement;

    //@ViewChild('map') mapElement: ElementRef;

    constructor(private nav: NavController,
                private navParams: NavParams,
                private loadingController: LoadingController,
                private googleMaps: GoogleMaps,
                private platform: Platform
               ) {

        this.order = this.navParams.data;


    }

    ionViewDidLoad(){
        this.loadMap();
    }

    loadMap(){

        this.mapElement = document.getElementById('map2');

        let mapOptions: GoogleMapOptions = {
            camera: {
                target: {
                  lat: this.order.latitud,
                  lng: this.order.longitud
                },
                zoom: 15,
                tilt: 10
              }
        };

        this.map2 = this.googleMaps.create(this.mapElement, mapOptions);


        this.map2.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
          console.log('Mapa listo!');
  
          // Now you can use all methods safely.
          this.map2.addMarker({
              title: this.order.direccion,
              icon: 'red',
              animation: 'DROP',
              position: {
                lat: this.order.latitud,
                lng: this.order.longitud
              }
            });
  
        });

    }

    ionViewDidLeave(){
        this.map2.remove();
    }

/*     getDirection(){
        let destination = this.order.latitud + ',' + this.order.longitud
        let label = encodeURI('My label');
        window.open ('geo:0,0?q=' + destination + '(' + label + ')', '_system');
    } */

}

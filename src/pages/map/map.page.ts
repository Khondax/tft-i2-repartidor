import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent } from "@ionic-native/google-maps";

@Component({
    templateUrl: 'map.page.html',
    selector: 'map.page.scss'
})

export class MapPage {

    data = [];
    map2: GoogleMap;
    mapElement: HTMLElement;

    constructor(private nav: NavController,
                private navParams: NavParams,
                private googleMaps: GoogleMaps,
               ) {

        this.data = this.navParams.data;

    }

    ionViewDidLoad(){
        this.loadMap();
    }

    loadMap(){

        this.mapElement = document.getElementById('map2');

        if (this.data.length <= 1){
            var mapOptions1: GoogleMapOptions = {
                camera: {
                    target: {
                      lat: this.data[0].position.lat,
                      lng: this.data[0].position.lng
                    },
                    zoom: 15,
                    tilt: 10
                  }
            };

            this.map2 = this.googleMaps.create(this.mapElement, mapOptions1);
            
            this.map2.one(GoogleMapsEvent.MAP_READY).then(() => {
                console.log('Mapa listo!');
        
                this.map2.addMarker({
                    title: this.data[0].title,
                    icon: 'red',
                    animation: 'DROP',
                    position: {
                        lat: this.data[0].position.lat,
                        lng: this.data[0].position.lng
                    }
                });
        
            });

        } else {
            var mapOptions2: GoogleMapOptions = {
                camera: {
                    target: {
                      lat: 27.9422467,
                      lng: -15.598526
                    },
                    zoom: 10,
                    tilt: 10
                  }
            };

            this.map2 = this.googleMaps.create(this.mapElement, mapOptions2);
            
            this.map2.one(GoogleMapsEvent.MAP_READY).then(() => {
                console.log('Mapa listo!');
                
                this.map2.addMarkerCluster({
                    boundsDraw: true,
                    markers: this.data,
                    icons: [
                        {min: 2, max: 5, url: 'assets/marks/m1.png', anchor: {x: 16, y: 16}},
                        {min: 5, max: 10, url: 'assets/marks/m2.png', anchor: {x: 16, y: 16}},
                        {min: 10, max: 20, url: 'assets/marks/m3.png', anchor: {x: 24, y: 24}},
                        {min: 20, url: 'assets/marks/m4.png', anchor: {x: 24, y: 24}}
                    ]
                
                });
        
            });
        }

    }

    ionViewDidLeave(){
        this.map2.remove();
    }

}

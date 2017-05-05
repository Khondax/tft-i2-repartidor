import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Geolocation } from "@ionic-native/geolocation";

import { AngularFire, FirebaseListObservable } from "angularfire2";

@Component({
    templateUrl: 'orderAssigned.page.html'
})
export class OrderAssignedPage {
        
    deliverer: any;

    delivererData: any;
    private lat: any;
    private long: any;
    private horaCaptura: any;

    constructor(private nav: NavController,
                private navParams: NavParams,
                private geolocation: Geolocation,
                private angularFire: AngularFire) {

        this.deliverer = navParams.data;

        this.delivererData = this.angularFire.database.list('/repartidores')

        var pos = geolocation.watchPosition({ maximumAge: 10000, enableHighAccuracy: true }).subscribe((data) => {
            this.lat = data.coords.latitude;
            this.long = data.coords.longitude;
            this.horaCaptura = data.timestamp;

            this.delivererData.update(this.deliverer.$key, {latitud: this.lat, longitud: this.long, horaCapturaGPS: this.horaCaptura});

        });

    }

}

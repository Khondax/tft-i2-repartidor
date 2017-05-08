import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Geolocation } from "@ionic-native/geolocation";

import moment from "moment";

import { AngularFire, FirebaseListObservable } from "angularfire2";

@Component({
    templateUrl: 'orderAssigned.page.html'
})
export class OrderAssignedPage {
        
    deliverer: any;

    delivererData: any;
    private position: any;
    private lat: any;
    private long: any;

    constructor(private nav: NavController,
                private navParams: NavParams,
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
    }


}

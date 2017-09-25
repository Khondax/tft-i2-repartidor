import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

declare var window: any;

@Component({
    templateUrl: 'map.page.html'
})
export class MapPage {

    map: any = {};

    constructor(private nav: NavController,
                private navParams: NavParams,
                private loadingController: LoadingController) {


    }

    ionViewDidLoad(){
        let order = this.navParams.data;

        this.map = {
            lat: order.latitud,
            lng: order.longitud,
            zoom: 16,
            markerLabel: order.direccion
        };
    }

    getDirection(){
        window.location = `geo:${this.map.lat},${this.map.lng};u=35`;
    }

}

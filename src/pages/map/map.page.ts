import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

declare var window: any;

@Component({
    templateUrl: 'map.page.html',
    selector: 'map.page.scss'
})

export class MapPage {

    map: any = {};

    constructor(private nav: NavController,
                private navParams: NavParams,
                private loadingController: LoadingController) {
        
        let order = this.navParams.data;

        this.map = {
            lat: order.latitud,
            lng: order.longitud,
            zoom: 16,
            markerLabel: order.direccion
        };

    }

    getDirection(){
        let destination = this.map.lat + ',' + this.map.lng
        let label = encodeURI('My label');
        window.open ('geo:0,0?q=' + destination + '(' + label + ')', '_system');
    }

}

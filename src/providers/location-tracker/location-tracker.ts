import { Injectable, NgZone } from '@angular/core';

import 'rxjs/add/operator/filter';

import { Observable } from "rxjs/Observable";

import { BackgroundGeolocation, BackgroundGeolocationConfig } from "@ionic-native/background-geolocation";

import moment from "moment";

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class LocationTrackerProvider {

    public watch: any;
    public lat: number = 0;
    public lng: number = 0;
    public horaCaptura: any;
    public horaCapturaObserver: any;

    constructor(public zone: NgZone,
                public backgroundGeolocation: BackgroundGeolocation) {

        this.horaCaptura = Observable.create(observer => {
            this.horaCapturaObserver = observer;
        });
    }

    startTracking(){
        // Background Tracking
        
        let config = {
            desiredAccuracy: 0,
            stationaryRadius: 20,
            distanceFilter: 10,
            stopOnTerminate: false,
            interval: 2000
        };
        
        this.backgroundGeolocation.configure(config).subscribe((location) => {
        
            console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
        
            // Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = location.latitude;
                this.lng = location.longitude;
                this.horaCaptura = moment().format();
                this.horaCapturaObserver.next(true);
            });
        
        }, (err) => {
        
            console.log(err);
        
        });
        
        // Turn ON the background-geolocation system.
        this.backgroundGeolocation.start();
        
    }

    stopTracking(){
        console.log('stopTracking');

        this.backgroundGeolocation.stop();
        this.watch.unsubscribe();
    }


}

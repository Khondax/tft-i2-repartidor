import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';


@Component({
    templateUrl: 'map.page.html'
})
export class MapPage {


    constructor(private nav: NavController,
                private navParams: NavParams,
                private loadingController: LoadingController) {


    }



}

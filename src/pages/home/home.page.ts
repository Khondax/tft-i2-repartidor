import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { OrderAssignedPage, DeliveryPage } from "../pages";

@Component({
    templateUrl: 'home.page.html'
})

export class HomePage {

    deliverer: any;
    orderAssignedTab = OrderAssignedPage;
    deliveryTab = DeliveryPage;
    
    constructor(private nav: NavController, private navParams:  NavParams) {
        this.deliverer = this.navParams.data;
    }

}

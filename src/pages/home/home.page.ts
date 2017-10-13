import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from "angularfire2";
import _ from 'lodash';

import { OrderAssignedPage, DeliveryPage } from "../pages";
import { AuthData } from '../../providers/auth-data';

@Component({
    templateUrl: 'home.page.html'
})

export class HomePage {

    orderAssignedTab = OrderAssignedPage;
    deliveryTab = DeliveryPage;

    constructor(private nav: NavController, private angularFire: AngularFire, public menuController: MenuController) {

        this.menuController.enable(true);
        
    }


}

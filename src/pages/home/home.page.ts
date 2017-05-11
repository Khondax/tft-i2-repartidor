import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from "angularfire2";
import _ from 'lodash';

import { OrderAssignedPage, DeliveryPage } from "../pages";
import { AuthData } from '../../providers/auth-data';

@Component({
    templateUrl: 'home.page.html'
})

export class HomePage {

    deliverer: any;
    deliveryMan: any;
    orderAssignedTab = OrderAssignedPage;
    deliveryTab = DeliveryPage;



    constructor(private nav: NavController, private angularFire: AngularFire, private authData: AuthData) {

        this.angularFire.database.list('/repartidores').subscribe(data => {
                this.deliveryMan = _.chain(data)
                                  .filter(o => o.UID === this.authData.getCurrentUid())
                                  .value();
                this.deliverer = this.deliveryMan;
        });
    }


}

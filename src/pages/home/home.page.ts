import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { OrderAssignedPage, DeliveryPage } from "../pages";
import { AuthData } from '../../providers/auth-data';

@Component({
    templateUrl: 'home.page.html'
})

export class HomePage {

    orderAssignedTab = OrderAssignedPage;
    deliveryTab = DeliveryPage;

    constructor(private nav: NavController, public menuController: MenuController) {

        this.menuController.enable(true);
        
    }


}

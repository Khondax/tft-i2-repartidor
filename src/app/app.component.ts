import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthData } from '../providers/auth-data';

import { HomePage, LoginPage, MapPage, RegistryPage } from "../pages/pages";

import { AngularFire } from 'angularfire2';

import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';

import _ from 'lodash';

@Component({
	templateUrl: 'app.html',
	selector: 'app.scss'
})

export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any;
	deliverer = [];
	deliveryMan: any = {};
	mapClusterKey: any;

	pages: Array<{title: string, component: any}>;

	constructor(public platform: Platform, 
				public statusBar: StatusBar, 
				public splashScreen: SplashScreen, 
				public angularFire: AngularFire, 
				public authData: AuthData,
				public locationTracker: LocationTrackerProvider) {

		const authObserver = angularFire.auth.subscribe( user => {
			if (user) {
				this.rootPage = HomePage;
				const userObserver = this.angularFire.database.list('/repartidores').subscribe(data => {
					this.deliveryMan = _.chain(data)
									  .filter(o => o.UID === this.authData.getCurrentUid())
									  .value();
					this.deliverer = this.deliveryMan[0];
					this.mapClusterKey = this.deliveryMan[0];
					userObserver.unsubscribe(); 
			  	});
				authObserver.unsubscribe();
			} else {
				this.rootPage = LoginPage;
			}
		});

		this.initializeApp();

	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	openPage(page) {
	// Reset the content nav to have just this page
	// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}

	goHome(){
        let view = this.nav.getActive();
        if(view.component.name!="HomePage"){
          this.nav.setRoot(HomePage);
        }
	}
	
	goToCluster(){
		var locations = [];
		var allOrders = [];

		const ordersObserver = this.angularFire.database.list('/pedidos').subscribe(data => {
			allOrders = _.chain(data)
						.filter(a => (a.estado === "Asignado" || a.estado === "En reparto" || a.estado === "Siguiente en entrega") && a.idRepartidor === this.mapClusterKey.$key)
						.value();

			ordersObserver.unsubscribe();

			for(var i=0; i < allOrders.length; i++){
                locations[i]= {position: {lng: allOrders[i].longitud, lat: allOrders[i].latitud}, title: allOrders[i].direccion};
            }

            this.nav.push(MapPage, locations);

		});
	}

	goToRegistry(){
        this.nav.push(RegistryPage);
    }

	logout(){
		this.authData.logoutUser();
		this.nav.push(LoginPage);
		this.locationTracker.stopTracking();
	}
}

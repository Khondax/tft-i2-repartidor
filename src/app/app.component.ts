import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthData } from '../providers/auth-data';

import { HomePage, LoginPage } from "../pages/pages";

import { AngularFire } from 'angularfire2';

import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';

import _ from 'lodash';

@Component({
	templateUrl: 'app.html',
	selector: 'app.scss'
})

export class MyApp {
	@ViewChild(Nav) nav: Nav;

	//rootPage: any = HomePage;
	rootPage: any;
	deliverer = [];
	deliveryMan: any = {};

	pages: Array<{title: string, component: any}>;

	constructor(public platform: Platform, 
				public statusBar: StatusBar, 
				public splashScreen: SplashScreen, 
				public angularFire: AngularFire, 
				public authData: AuthData,
				public alertCtrl: AlertController,
				public locationTracker: LocationTrackerProvider) {

		const authObserver = angularFire.auth.subscribe( user => {
			if (user) {
				this.rootPage = HomePage;
				const userObserver = this.angularFire.database.list('/repartidores').subscribe(data => {
					this.deliveryMan = _.chain(data)
									  .filter(o => o.UID === this.authData.getCurrentUid())
									  .value();
					this.deliverer = this.deliveryMan[0];
					console.log(this.deliverer); 
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


	logout(){

	let alert = this.alertCtrl.create({
				message: "¿Quieres cerrar sesión?",
				buttons: [
					{
						text: "No"
					},
					{
						text: 'Sí',
						handler: data =>{
							this.authData.logoutUser();
							this.nav.push(LoginPage);
							this.locationTracker.stopTracking();
						}
					}
				]
			});

		alert.present();

	}
}

import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import _ from 'lodash';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { AuthData } from '../../providers/auth-data';
import moment from "moment";

import { ScanPage, MapPage } from "../pages";

import { CallNumber } from "@ionic-native/call-number";

@Component({
    templateUrl: 'delivery.page.html',
    selector: 'delivery.page.scss'
})

export class DeliveryPage {

    deliverer: any;
    deliveryMan: any;

    private orders: any;
    ordersData: any;

    deliveryOrders = [];
    deliveryOrdersData: any;


    constructor(private nav: NavController,
                private navParams: NavParams,
                private loadingController: LoadingController,
                private angularFire: AngularFire,
                private authData: AuthData,
                public alertControler: AlertController,
                private callNumber: CallNumber) {


    }

    ionViewDidLoad(){

        this.angularFire.database.list('/repartidores').subscribe(data => {
                this.deliveryMan = _.chain(data)
                                  .filter(o => o.UID === this.authData.getCurrentUid())
                                  .value();
                this.deliverer = this.deliveryMan[0];
        });

        let loader = this.loadingController.create({
            content: 'Obteniendo datos...',
            spinner: 'bubbles'
        });

        this.ordersData = this.angularFire.database.list('/pedidos')

        loader.present().then(() => {
            this.angularFire.database.list('/pedidos').subscribe(data => {
                this.orders = _.chain(data)
                                  .filter(o => o.estado === "En reparto" || o.estado === "Siguiente en entrega" && o.idRepartidor === this.deliverer.$key)
                                  .groupBy('codigoPostal')
                                  .toPairs()
                                  .map(item => _.zipObject(['codPos', 'pedido'], item))
                                  .value();

                this.deliveryOrdersData = _.chain(this.orders)
                                          .orderBy('direccion')
                                          .value();

                this.deliveryOrders = this.deliveryOrdersData;
                console.log(this.deliveryOrders[0].pedido[0].estado);

                loader.dismiss();
            });
        });

    }

    nextDelivery(order){
        var temp;
        var nextDir;
         var nextDirData = this.angularFire.database.list('/pedidos').subscribe(data => {
                nextDir = _.chain(data)
                                  .filter(o => o.estado === "Siguiente en entrega")
                                  .value();
                temp = nextDir;
                console.log(temp);
                if(temp.length == 0 || temp[0].direccion === order.direccion && order.estado === "En reparto"){
                    this.ordersData.update(order.$key, {estado: "Siguiente en entrega"});
                }else if(order.estado === "En reparto"){
                    let alert = this.alertControler.create({
                        message: "Ya existe un paquete seleccionado para la siguiente dirección de entrega. Si deseas cambiarlo, por favor deselecciona el otro paquete.",
                        buttons: [
                            {
                            text: "Ok",
                            role: 'cancel'
                            }
                        ]
                    });
                    alert.present();
                }else{
                    this.ordersData.update(order.$key, {estado: "En reparto"});
                    
                }
                nextDirData.unsubscribe();
        });
        
    }

    goToScan($event, order){
        this.nav.push(ScanPage, {data: order});
    }

    goToMap($event, order){
        var data = []
        data[0] = {position: {lng: order.longitud, lat: order.latitud}, title: order.direccion};
        
        this.nav.push(MapPage, data);
    }

    goToPhone($event, order){
        this.callNumber.callNumber(order.telf, true)
            .then(() => console.log('Teléfono lanzado!'))
            .catch(() => console.log('Error al lanzar el teléfono'));
    }

}

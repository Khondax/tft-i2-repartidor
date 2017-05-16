import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SignaturePad } from "angular2-signaturepad/signature-pad";

import { ScanPage } from "../pages";

@Component({
    templateUrl: 'drawpad.page.html',
    selector: 'drawpad.page.scss'
})

export class DrawpadPage {

    @ViewChild(SignaturePad) private signaturePad: SignaturePad;
    
    public signaturePadOptions: Object = {
        'minWidth': 2,
        'canvasWidth': 340,
        'canvasHeight': 400
    };

    private signatureImage: string;
    private order: any;

    constructor(private nav: NavController, private navParams: NavParams) {

        this.order = navParams.data;
    }

    canvasResize() {
        let canvas = document.querySelector('canvas');
        this.signaturePad.set('minWidth', 1);
        this.signaturePad.set('canvasWidth', canvas.offsetWidth);
        this.signaturePad.set('canvasHeight', canvas.offsetHeight);
    }

    ngAfterViewInit() {
        this.signaturePad.clear();
        this.canvasResize();
    }

    drawCancel(){
        this.nav.pop();
    }


    drawClear(){
        this.signaturePad.clear();
    }

    drawComplete(){
        this.signatureImage = this.signaturePad.toDataURL();
        this.nav.push (ScanPage, {signatureImage: this.signatureImage, data: this.order});
    }

}

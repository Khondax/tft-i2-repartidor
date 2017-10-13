import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { HomePage } from '../pages';
import { EmailValidator } from '../../validators/email';

@Component({
  templateUrl: 'login.page.html',
  selector: 'login.page.scss'
})


export class LoginPage {

  public loginForm: any;
  public loading: any;

  constructor(public navCtrl: NavController, public authData: AuthData, 
    public formBuilder: FormBuilder, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, 
    public menuController: MenuController) {

      this.menuController.enable(false);

      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
    }

    loginUser(){
      if (!this.loginForm.valid){
        console.log(this.loginForm.value);
        if(this.loginForm.value.password.length < 6){
          let alert = this.alertCtrl.create({
              message: "La contraseña debe tener al menos 6 caracteres",
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
        }
      } else {
        this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then( authData => {
          this.navCtrl.setRoot(HomePage);
        }, error => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });

        this.loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
        });
        this.loading.present();
      }
  }

}
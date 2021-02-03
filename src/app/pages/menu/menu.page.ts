import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { CategoriesService} from '../../Services/categories.service'
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AlertController, IonMenu } from '@ionic/angular';
import { LoginService } from '../../Services/login.service'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  @ViewChild(IonMenu , { static: true }) menu: IonMenu;
  pages = 
  [
    {
      title: 'Items',
      func : () =>
      {
        this.router.navigateByUrl(`/list`);
        this.menu.close(true);
      },
      isSelected : () =>
      {
        let pathname = window.location.pathname; 
        let path = pathname.split('/');
        return (path[1] == "list");
      }
    },
    {
      title: 'History',
      func : () =>
      {
        this.router.navigateByUrl(`/history`);
        this.menu.close(true);
      },
      isSelected : () =>
      {
        let pathname = window.location.pathname; 

        return (pathname == "/history");
      }
    
    }
  ]


  constructor(private router:Router,public loginService:LoginService,public alertController:AlertController) 
  { 
    this.loginService.checkStatus();
  }
  
  ngOnInit(): void {
    
  }

  fbLogin() {
    this.loginService.login();
  }

 

  async logoutConfirm() {
    const alert = await this.alertController.create({
      header: 'Log out',
      message: 'Are you sure you want to <strong>Log out</strong>?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          
          }
        }, {
          text: 'Log out',
          handler: () => {
            this.loginService.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  goBackToHome()
  {
    this.router.navigateByUrl(`/`);
    this.menu.close(true);
  }
}

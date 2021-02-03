import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';
import { MenuPage } from './menu.page';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule,
    IonicImageLoader,
  ],
  declarations: [MenuPage]

})
export class MenuPageModule 
{
  constructor(private menu: MenuController,private imageLoader:IonicImageLoader) 
  { 

  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
 
}

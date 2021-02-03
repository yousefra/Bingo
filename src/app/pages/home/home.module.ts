import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { CardModule } from '../../Modules/card/card.module';
import { ReactiveFormsModule } from '@angular/forms'
import { FbloginComponent } from 'src/app/Components/fblogin/fblogin.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CardModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: HomePage }])
  ],
  declarations: [FbloginComponent,HomePage]
})
export class HomePageModule {}

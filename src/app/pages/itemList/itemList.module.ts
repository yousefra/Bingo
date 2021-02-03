import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemListPage } from './itemList.page';
import { CardModule } from '../../Modules/card/card.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CardModule,
    RouterModule.forChild([{ path: '', component: ItemListPage }])
  ],
  declarations: [ItemListPage]
})
export class ItemListPageModule {}

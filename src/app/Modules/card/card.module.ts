import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../Components/card/card.component';
import { CardSetComponent } from '../../Components/card-set/card-set.component';
import { HistoryCardComponent } from '../../Components/history-card/history-card.component';
import { IonicImageLoader } from 'ionic-image-loader';
@NgModule({
  declarations: [CardComponent,CardSetComponent,HistoryCardComponent],
  imports: [
    CommonModule,
    IonicImageLoader
  ],
  exports:[
    CardComponent
    ,CardSetComponent,HistoryCardComponent,
    IonicImageLoader
  ]
})
export class CardModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';


const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'list',
        loadChildren: () => import('../../pages/itemList/itemList.module').then(m => m.ItemListPageModule)
      },
      {
        path: 'history',
        loadChildren: () => import('../../pages/history/history.module').then(m => m.HistoryPageModule)
      },
      {
        path: '',
        loadChildren: () => import('../../pages/home/home.module').then(m => m.HomePageModule) 
      }
     
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}

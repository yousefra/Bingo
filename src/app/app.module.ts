import { TokenInterceptorService } from './services/token-interceptor.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ColorSketchModule } from 'ngx-color/sketch';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ItemsComponent } from './pages/items/items.component';
import { UsersComponent } from './pages/users/users.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LatestSpinsComponent } from './components/latest-spins/latest-spins.component';
import { NumberBoxComponent } from './components/number-box/number-box.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { ItemDialogComponent } from './dialogs/item-dialog/item-dialog.component';
import { CategoryDialogComponent } from './dialogs/category-dialog/category-dialog.component';
import { YesNoComponent } from './dialogs/yes-no/yes-no.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CategoriesComponent,
    ItemsComponent,
    UsersComponent,
    SidebarComponent,
    LatestSpinsComponent,
    NumberBoxComponent,
    LoginComponent,
    ItemDialogComponent,
    CategoryDialogComponent,
    YesNoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    HttpClientModule,
    ColorSketchModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

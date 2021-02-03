import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonSelect } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/Services/categories.service';

@Component({
  selector: 'app-itemList',
  templateUrl: 'itemList.page.html',
  styleUrls: ['itemList.page.scss']
})
export class ItemListPage {

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSelect, { static: true }) select: IonSelect;

  constructor(private categoryService:CategoriesService) {}
  category;
  query = '';
  data = [];
  categories = [];

  ionViewWillEnter()
  {
   this.categoryService.updateCategories().then(() =>
   {
    
      this.category = CategoriesService.curCategory;
      this.select.value = this.category;
      this.categories = CategoriesService.categoryNames;
      this.data = this.categoryService.getCategoryItems(this.category,0,this.findCardsNum().width * this.findCardsNum().height);
     
   });
   
  }
  
  loadData(event)
  {
    setTimeout(() => {

      event.target.complete();
      let newData = this.categoryService.getCategoryItems(this.category,this.data.length,this.findCardsNum().width,this.query);
      if(newData.length > 0)
        this.data = this.data.concat(newData);
      else
      {
        event.target.disabled = true;
      }
    
    }, 300);
  }

  findCardsNum()
  {
    return {
      width : Math.floor((window.innerWidth - 50)/150),
      height: Math.ceil((window.innerHeight)/235) + 1
    }
  }

  listStyle()
  {
    let margin = (window.innerWidth - 50)%150 + 25;
    margin /= 2;
    return {
      "margin-left":margin + 7 + "px",
      "margin-right":margin + "px",
    }
  }

  // filter Category Using Searchbar
  filter(event)
  {
    this.query = event.srcElement.value;
    this.data = this.categoryService.getCategoryItems(this.category,0,this.findCardsNum().width * this.findCardsNum().height,this.query);
    document.getElementById("loading")['disabled'] = false;
  }

  // change category using catgory Selector
  changeCategory(event)
  {
    this.category =  event.srcElement.value;
    this.data = this.categoryService.getCategoryItems(this.category,0,this.findCardsNum().width * this.findCardsNum().height,this.query);
  }
}

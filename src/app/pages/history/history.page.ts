import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { UserService } from '../../Services/user.service';
import { CategoriesService } from '../../Services/categories.service';

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss']
})

export class HistoryPage {

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  constructor(private userService: UserService, private categoriesService: CategoriesService) { }
  category = "All";
  data = [];
  categories = [];

  ionViewWillEnter() {
    this.categories = CategoriesService.categoryNames;
    this.userService.updateHistory().then(() => {
      this.refreshData();
      this.load(undefined);
    });
  }


  filter(event) {
    this.category = event.srcElement.value;
    this.refreshData();
    this.load(undefined);
    this.setLoadingState(true);
  }

  setLoadingState(state) {
    let element = document.getElementById("loading");
    if (element)
      element['disabled'] = state;
  }

  refreshData() {
    this.data = [];
  }

  load(event) {
    if (event != undefined) event.target.complete();

    let newData = this.userService.history.filter(item => {
      if (this.category == "All")
        return true;

      if (this.category == "Gifts")
        return 'gifter' in item;

      return item.category == this.category;
    }).reverse().slice(0, this.data.length + 10);

    if (newData.length != this.data.length)
      this.data = newData;
    else
      this.setLoadingState(false);
  }

  stats(item) {
    return this.userService.stats[`${item.category},${item.name}-spins`];
  }

  percentage(item) {
    return Math.floor(100 * this.userService.stats[`${item.category},${item.name}-spins`] / this.userService.stats[`${item.category}-spins`]);
  }
}

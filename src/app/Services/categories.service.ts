import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ImageLoaderService } from 'ionic-image-loader';
import { Storage } from '@ionic/storage'

@Injectable({
	providedIn: 'root'
})
export class CategoriesService {

	static curCategory = "fruit";
	static categories;

	static categoryNames = [];
	static items: any = {
		sport: ["basketball", "bowling", "dog race", "football", "horse race", "soccer", "table tennis", "tennis"],
		fruit: ["banana", "cherry", "grape", "kiwi", "lemon", "melon", "orange", "strawberry"],
		battle: ["Deal 3 Damage", "Heal 2", "Shield damage"]
	};

	constructor(private http: HttpClient, private imageLoader: ImageLoaderService, private storage: Storage) { }

	getCategories() {
		return this.sendReq('get', 'categories');
	}

	getItems() {
		return this.sendReq('get', 'items');
	}

	getCategoryItems(name, start = 0, count = Infinity, query = '') {
		if (!CategoriesService.items[name])
			return [];

		return CategoriesService.items[name].filter(ele => {
			return ele.name.toLowerCase().includes(query.toLowerCase());
		}).slice(start, start + count);
	}

	updateCategories() {
		return new Promise((resolve, reject) => {
			this.sendReq('get', 'categories').subscribe(data => {
				CategoriesService.categories = data['categories'];
				CategoriesService.categoryNames = [];
				CategoriesService.categories['forEach'](element => CategoriesService.categoryNames.push(element.name));
				CategoriesService.curCategory = CategoriesService.categories[0].name;
				this.storage.remove('cached');
				this.storage.set('categories-names', CategoriesService.categoryNames);
				this.storage.set('categories', CategoriesService.categories);
				this.updateItems().then(() => resolve());

			}, () => this.backUpData(() => resolve()));
		});
	}

	updateItems() {
		return new Promise((resolve, reject) => {
			this.sendReq('get', 'items').subscribe(data => {

				let temp = data['items'];
				CategoriesService.items = {};

				temp.forEach(ele => {
					let obj =
					{
						name: ele.name,
						img: ele.image,
						backColor: ele.backColor
					};
					this.imageLoader.preload(obj.img);
					if (!(ele.category.name in CategoriesService.items))
						CategoriesService.items[ele.category.name] = [];
					CategoriesService.items[ele.category.name].push(obj);
				})

				this.storage.set('cached-data', CategoriesService.items);
				this.storage.set('cached', true);
				resolve();
			}, () => this.backUpData(() => resolve()));
		});
	}

	sendReq(type: string, base: string, data?: any) {
		const url = `${environment['bingoApi']}/${base}`;
		if (type === 'get') {
			return this.http.get(url);
		}
		else if (type === 'post') {
			return this.http.post(url, data);
		}
		else if (type === 'patch') {
			return this.http.patch(url, data);
		}
		else if (type === 'delete') {
			return this.http.delete(url);
		}
	}


	async backUpData(callback) {
		await this.storage.keys().then(keys => {
			if (keys.some(key => key == "cached")) {
				this.loadSavedData().then(callback);
			}
			else
				this.loadDefaultData().then(callback);
		}
		)
	}

	loadSavedData() {
		return new Promise((resolve, reject) => {
			this.storage.get('categories-names').then(data => {
				CategoriesService.categoryNames = data;
				this.storage.get('categories').then(data => {
					CategoriesService.categories = data;
					this.storage.get('cached-data').then(data => {
						CategoriesService.items = data;
						resolve();
					})
				})
			});
		});

	}

	loadDefaultData() {
		return new Promise((resolve, reject) => {
			CategoriesService.categories = environment.defaultCat;
			CategoriesService.categoryNames = [];
			CategoriesService.categories['forEach'](element => CategoriesService.categoryNames.push(element.name));

			let temp = environment.defaultItems;
			CategoriesService.items = {};

			Object.keys(temp).forEach(key => {
				temp[key].forEach(ele => {
					let obj =
					{
						name: ele,
						img: " assets/img/" + key + '/' + ele + '.png',
						backColor: ""
					};

					if (!(key in CategoriesService.items))
						CategoriesService.items[key] = [];

					CategoriesService.items[key].push(obj);
				});
			});
			CategoriesService.curCategory = CategoriesService.categories[0].name;
			resolve();
		});
	}
}

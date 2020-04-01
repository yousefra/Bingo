import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class BingoAPIService {

	constructor(private http: HttpClient) { }

	// Categories
	getCategories() {
		return this.sendReq('get', 'categories');
	}

	addCategory(categoryName, categoryTitle) {
		return this.sendReq('post', 'categories', { name: categoryName, title: categoryTitle });
	}

	deleteCategory(categoryId) {
		return this.sendReq('delete', `categories/${categoryId}`);
	}

	editCategory(categoryId, categoryName, categoryTitle) {
		return this.sendReq('patch', `categories/${categoryId}`, [
			{ propName: 'name', value: categoryName },
			{ propName: 'title', value: categoryTitle },
		]);
	}

	// Items
	getItems() {
		return this.sendReq('get', 'items');
	}

	addItem(data: FormData) {
		return this.sendReq('post', 'items', data);
	}

	deleteItem(itemId) {
		return this.sendReq('delete', `items/${itemId}`);
	}

	editItem(itemId, fd, body) {
		const data = [
			{ propName: 'name', value: body.name },
			{ propName: 'backColor', value: body.backColor },
			{ propName: 'category', value: body.category }
		];
		fd.append('body', JSON.stringify(data));
		return this.sendReq('patch', `items/${itemId}`, fd);
	}

	// Users
	getUsers() {
		return this.sendReq('get', 'user');
	}

	deleteUser(userId) {
		return this.sendReq('delete', `user/${userId}`);
	}

	// Authentication
	login(username: string, password: string) {
		return this.sendReq('post', 'user/login', { username, password });
	}

	isAdminLoggedIn() {
		return this.sendReq('get', 'user/isAdminLoggedIn');
	}

	sendReq(type: string, base: string, data?: any) {
		const url = `${environment.bingoApi}/${base}`;
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
}

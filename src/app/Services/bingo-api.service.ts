import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class BingoAPIService {

	constructor(private http: HttpClient) { }

	getSpins() {
		return this.sendReq('get', 'spins');
	}

	addSpin(itemName, itemImage, itemCategory) {
		return this.sendReq('post', 'spins', { itemName, itemImage, itemCategory });
	}

	sendGift(spinId, email) {
		return this.sendReq('patch', `spins/${spinId}`, { email });
	}

	getUserFbId(userId) {
		return this.sendReq('get', `user/${userId}`);
	}

	sendReq(type: string, base: string, data?: any) {
		const url = `${environment['bingoApi']}/${base}`;
		const httpOptions = {
			headers: new HttpHeaders({
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'x-auth-token': localStorage.getItem('token')
			})
		};
		if (type === 'get') {
			return this.http.get(url, httpOptions);
		}
		else if (type === 'post') {
			return this.http.post(url, data, httpOptions);
		}
		else if (type === 'patch') {
			return this.http.patch(url, data, httpOptions);
		}
		else if (type === 'delete') {
			return this.http.delete(url, httpOptions);
		}
	}
	
}

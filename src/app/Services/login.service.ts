import { environment } from './../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class LoginService {

	constructor(public fb: Facebook, private http: HttpClient, private storage: Storage) { }

	isLoggedIn = false;
	users = { id: '', name: '', email: '', picture: { data: { url: '' } } };

	checkStatus() {
		this.fb.getLoginStatus()
			.then(res => {
				if (res.status === 'connected') {
					this.isLoggedIn = true;
					// Send to auth/me
					const token = res.authResponse.accessToken;
					this.http.post(`${environment.bingoApi}/auth/facebook`, { access_token: token }, { observe: 'response' }).subscribe(res => {
						const APIToken = res.headers.get('x-auth-token');
						localStorage.setItem('token', APIToken);
					});
					this.getUserDetail(res.authResponse.userID);
				} else {
					this.isLoggedIn = false;
				}
			})
	}

	// DONE: extend this to make it work with our database not only facebook
	login(): Boolean {
		this.fb.login(['public_profile', 'user_friends', 'email'])
			.then(res => {
				if (res.status === 'connected') {
					this.isLoggedIn = true;
					const token = res.authResponse.accessToken;
					this.http.post(`${environment.bingoApi}/auth/facebook`, { access_token: token }, { observe: 'response' }).subscribe(res => {
						const APIToken = res.headers.get('x-auth-token');
						localStorage.setItem('token', APIToken);
					});
					this.getUserDetail(res.authResponse.userID);
					return true;
				} else {
					this.isLoggedIn = false;
					return false;
				}
			})
			.catch(e => {
				window.alert("failed to login\n  check your internet connection");
				return false;
			});

		return false;
	}

	logout() {
		this.fb.logout()
			.then(res => this.isLoggedIn = false)
	}

	getUserDetail(userid: any) {
		this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
			.then(res => {
				this.users = res;
			})
	}

	userDetails(id)
	{
		return this.fb.api('/' + id + '/?fields=id,email,name,picture', ['public_profile']);
	}
	getToken() {
		return localStorage.getItem('token');
		// return new Observable(observer => {
		// 	this.storage.get('token').then(token => {
		// 		observer.next(token);
		// 	});
		// });
	}
}

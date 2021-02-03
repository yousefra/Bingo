import { LoginService } from 'src/app/Services/login.service';
import { BingoAPIService } from './bingo-api.service';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	
	constructor(private storage: Storage, private loginService: LoginService, private bingoApi: BingoAPIService) { }
	lastSpinID = 1;
	history;
	totalSpins = 0;
	stats = {};

	// send gift to specificed email
	gift(email): Observable<any> {
		return this.bingoApi.sendGift(this.lastSpinID, email);
	}

	// record a spin
	recordSpin(item) {
		// if logged in record it to the database
		if (this.loginService.isLoggedIn) {
			const image = 'itemsImages' + item.img.split('itemsImages')[1];
			this.bingoApi.addSpin(item.name, image, item.category).subscribe(res => {
				const createdSpin = res['createdSpin'];
				this.lastSpinID = createdSpin.id;
				this.updateHistory();
			})
		}
		else {
			// record it to local storage if there is no connection
			this.storage.get('history').then(data => {
				item.date = Date.now();
				if (data == null) data = [];
				data.push(item);
				this.storage.set('history', data);
			});
		}
	}

	// update the updateHistory
	updateHistory(): Promise<any> {
		return new Promise((resolve, reject) => {
			if (this.loginService.isLoggedIn) {
				// fetch history from data base if there is connection
				this.bingoApi.getSpins().subscribe(res => {
					const spinsCount = res['count'];
					const spins = res['spins']
					this.history = [];

					// change the format of the fetched histoy
					spins.forEach(element => {
						let obj =
						{
							name: element.itemName,
							img: environment.bingoApi + '/' + element.itemImage,
							category: element.itemCategory,
							date: element.date,
						};

						// fetch gifter information if item was a gift
						if (element.giftFrom != 0) 
						{
							obj['gifter'] = "  ";
							obj['gifterPic'] = "  ";
							this.bingoApi.getUserFbId(element.giftFrom).subscribe(res => {
								const userFbId = res['userId'];
								this.loginService.userDetails(userFbId).then(res => {
									obj['gifter'] = res.name;
									obj['gifterPic'] = res.picture.data.url;
								});
							});
						}

						this.history.push(obj);
					});

					this.updateStats();
					resolve();
				})
			}
			else {
				// fetch history from local storage if not logged in
				this.storage.get('history').then(data => {
					this.history = data
					this.updateStats();
					resolve();
				});
			}
		});
	}


	updateStats() {
		if (this.history == null) {
			return;
		}
		this.stats = {};
		this.totalSpins = 0;
		this.history.forEach(item => {
			if (!(`${item.category},${item.name}-spins` in this.stats))
				this.stats[`${item.category},${item.name}-spins`] = 0;
			this.stats[`${item.category},${item.name}-spins`]++;

			if (!(`${item.category}-spins` in this.stats))
				this.stats[`${item.category}-spins`] = 0;
			this.stats[`${item.category}-spins`]++;

			this.totalSpins++;
		});
	}
}

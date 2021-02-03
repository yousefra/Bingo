import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoriesService } from '../../Services/categories.service';
import { CardSetComponent } from '../../Components/card-set/card-set.component';
import { AlertController, NavController } from '@ionic/angular';
import { UserService } from '../../Services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../Services/login.service';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss']
})
export class HomePage {
	gifted = false;
	CatService = [];
	loginToGift = false;
	currentCatagory = CategoriesService.categoryNames[0];
	spinned = false;
	@ViewChild(CardSetComponent, { static: false }) cardSet: CardSetComponent;
	title;
	categories;
	constructor(public navCtrl: NavController, private catService: CategoriesService, public alertController: AlertController, public user: UserService, public loginService: LoginService) {
		this.catService.updateCategories().then( () =>
		{
			this.cardSet.init();
			this.categories = CategoriesService.categoryNames;this.title = CategoriesService.categories[0].title;
		});		
	}




	finished(state) {
		this.spinned = !state;
		this.lockSlide(state);
	}



	reset() {
		this.cardSet.reset();
		this.spinned = false;
		this.gifted = false;
	}

	cardSetScale() {
		let val = window.innerWidth * 0.55 / 375;
		val = Math.max(val, 0.55);
		val = Math.min(1, val);

		return {
			"transform": `Scale(${val})`,
			"height": val * 255 + "px",
			"margin-top": (window.innerHeight - val * 255) / 16 + "px",
			"margin-bottom": (window.innerHeight - val * 255) / 12 + "px",
			"margin-right": 144 / 2 * val + "px"
		}
	}



	// Slider Element Style
	slideStyle(index) {
		let mySweeper;
		try {
			mySweeper = document.querySelector('.swiper-container')['swiper'];


			let animation = ((index == mySweeper.activeIndex) ? "selected 750ms forwards" : "unselected 750ms forwards");

			return {
				"animation": animation
			}
		} catch (err) {
			let animation = ((index == 0) ? "selected 0ms forwards" : "unselected 0ms forwards");
			return {
				"animation": animation
			}
		};
	}

	// Sweeper functionality
	slideTo(index) {
		let mySweeper = document.querySelector('.swiper-container')['swiper'];
		CategoriesService.curCategory = CategoriesService.categoryNames[index];
		mySweeper.slideTo(index);
	}

	slideChange(event) {
		let mySweeper = document.querySelector('.swiper-container')['swiper'];
		this.currentCatagory = CategoriesService.categoryNames[mySweeper.activeIndex];
		CategoriesService.curCategory = CategoriesService.categoryNames[mySweeper.activeIndex];
		this.title = CategoriesService.categories[mySweeper.activeIndex].title;
	}

	lockSlide(lock) {
		let mySweeper = document.querySelector('.swiper-container')['swiper'];

		lock = !lock;
		mySweeper.allowSlideNext = lock;
		mySweeper.allowSlidePrev = lock;
		mySweeper.allowClick = lock;
		mySweeper.allowTouchMove = lock;
	}

	// gift pop up related function
	// form checking and validation
	loginForm = new FormGroup({ email: new FormControl('', Validators.compose([Validators.required, Validators.email])), });

	// send gift functionality
	gift() {
		if (this.loginService.isLoggedIn)
		{
			this.user.gift(this.loginForm.value.email).subscribe(() => this.gifted = true,() => window.alert("there is no user with this email"));
		}
		else {
			this.loginToGift = true;
		}
	}

	// cancel Gift 
	cancelGiftLogin() {
		this.loginToGift = false;
	}




}

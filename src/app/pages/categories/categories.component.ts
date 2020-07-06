import { YesNoComponent } from './../../dialogs/yes-no/yes-no.component';
import { CategoryDialogComponent } from './../../dialogs/category-dialog/category-dialog.component';
import { AlertService } from './../../services/alert.service';
import { BingoAPIService } from './../../services/bingo-api.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-categories',
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

	categories: any;

	constructor(private bingoAPI: BingoAPIService, public dialog: MatDialog, private alert: AlertService) { }

	ngOnInit(): void {
		this.bingoAPI.getCategories().subscribe(res => {
			this.categories = res['categories'];
		})
	}

	openDialog(buttonValue, categoryName?, categoryTitle?) {
		return this.dialog.open(CategoryDialogComponent, {
			width: '350px',
			data: { title: `${buttonValue} Category`, buttonValue, name: categoryName, categoryTitle }
		});
	}

	openYesNoDialog(message) {
		return this.dialog.open(YesNoComponent, {
			width: '350px',
			data: { message }
		});
	}

	addCategory() {
		const dialogRef = this.openDialog('Add');
		dialogRef.afterClosed().subscribe(result => {
			if (result.status) {
				// Add category
				this.bingoAPI.addCategory(result.name, result.categoryTitle).subscribe(res => {
					this.alert.success('Category added');
					this.categories.push(res['createdCategory']);
				}, err => {
					this.alert.error('Server error!');
				});
			}
		});
	}

	editCategory(categoryId, categoryName, categoryTitle) {
		const dialogRef = this.openDialog('Edit', categoryName, categoryTitle);
		dialogRef.afterClosed().subscribe(result => {
			if (result.status) {
				// Edit category
				this.bingoAPI.editCategory(categoryId, result.name, result.categoryTitle).subscribe(res => {
					this.alert.success('Category edited');
					this.categories.map(category => {
						if (category._id === categoryId) {
							category.name = result.name;
							category.title = result.categoryTitle;
						}
					});
				}, err => {
					this.alert.error('Server error!');
				});
			}
		})
	}

	deleteCategory(categoryId) {
		const dialogRef = this.openYesNoDialog('This will delete all of this categorys\' items. Are you sure?');
		dialogRef.afterClosed().subscribe(result => {
			if (result.status) {
				// Delete category
				this.bingoAPI.deleteCategory(categoryId).subscribe(res => {
					this.alert.success('Category deleted');
					this.categories = this.categories.filter(category => category._id != categoryId);
				}, err => {
					this.alert.error('Server error!');
				});
			}
		});
	}
}

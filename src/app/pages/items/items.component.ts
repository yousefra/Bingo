import { YesNoComponent } from './../../dialogs/yes-no/yes-no.component';
import { ItemDialogComponent } from './../../dialogs/item-dialog/item-dialog.component';
import { environment } from './../../../environments/environment';
import { AlertService } from './../../services/alert.service';
import { BingoAPIService } from './../../services/bingo-api.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-items',
	templateUrl: './items.component.html',
	styleUrls: ['./items.component.css', '../categories/categories.component.css']
})
export class ItemsComponent implements OnInit {

	items: any;
	categories: any;
	imageUrl: string;

	constructor(private bingoAPI: BingoAPIService, public dialog: MatDialog, private alert: AlertService) { }

	ngOnInit(): void {
		this.imageUrl = environment.bingoApi;
		this.bingoAPI.getItems().subscribe(res => {
			this.items = res['items'];
		})
		this.bingoAPI.getCategories().subscribe(res => {
			this.categories = res['categories'];
		});
	}

	openDialog(buttonValue, itemName?, category?, backColor?, image?) {
		const categories = this.categories;
		return this.dialog.open(ItemDialogComponent, {
			width: '550px',
			data: { title: `${buttonValue} Item`, buttonValue, categories, name: itemName, category, backColor, image }
		});
	}

	openYesNoDialog(message) {
		return this.dialog.open(YesNoComponent, {
			width: '350px',
			data: { message }
		});
	}

	addItem() {
		const dialogRef = this.openDialog('Add');
		dialogRef.afterClosed().subscribe(result => {
			if (result.status) {
				// Add Item
				const fd = new FormData();
				fd.append('image', result.file, result.file.name);
				fd.append('name', result.name);
				fd.append('backColor', result.backColor);
				fd.append('category', result.category);
				this.bingoAPI.addItem(fd).subscribe(res => {
					this.alert.success('Item added');
					let createdItem = res['createdItem'];
					const categoryId = createdItem.category;
					createdItem.category = {
						_id: categoryId,
						name: this.categories.filter(category => category._id === categoryId)[0].name
					}
					this.items.push(res['createdItem']);
				}, err => {
					this.alert.error('Server error.');
				});
			}
		});
	}

	editItem(itemId, itemName, category, backColor, image) {
		const dialogRef = this.openDialog('Edit', itemName, category, backColor, image);
		dialogRef.afterClosed().subscribe(result => {
			if (result.status) {
				// Edit Item
				const fd = new FormData();
				if (result.fileChanged) {
					fd.append('image', result.file, result.file.name);
				}
				const body = {
					name: result.name,
					backColor: result.backColor,
					category: result.category
				};
				this.bingoAPI.editItem(itemId, fd, body).subscribe(res => {
					this.alert.success('Category edited');
					const newCategory = this.categories.filter(category => category._id === result.category)[0];
					this.items.map(item => {
						if (item._id === itemId) {
							item.name = result.name;
							item.category = newCategory;
							item.backColor = result.backColor;
							item.image = res['updatedItem'].image;
						}
					});
				}, err => {
					this.alert.error('Server error.');
				});
			}
		})
	}

	deleteItem(itemId) {
		const dialogRef = this.openYesNoDialog('Are you sure?');
		dialogRef.afterClosed().subscribe(result => {
			if (result.status) {
				// Delete item
				this.bingoAPI.deleteItem(itemId).subscribe(res => {
					this.alert.success('Item deleted');
					this.items = this.items.filter(item => item._id != itemId);
				}, err => {
					this.alert.error('Server error.');
				});
			}
		});
	}
}

import { YesNoComponent } from './../../dialogs/yes-no/yes-no.component';
import { AlertService } from './../../services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { BingoAPIService } from './../../services/bingo-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['../categories/categories.component.css', './users.component.css']
})
export class UsersComponent implements OnInit {

	users: any;

	constructor(private bingoAPI: BingoAPIService, public dialog: MatDialog, private alert: AlertService) { }

	ngOnInit(): void {
		this.bingoAPI.getUsers().subscribe(res => {
			this.users = res['users'];
		});
	}

	openYesNoDialog(message) {
		return this.dialog.open(YesNoComponent, {
			width: '350px',
			data: { message }
		});
	}

	deleteUser(userId) {
		const dialogRef = this.openYesNoDialog('This will delete all the user\'s spins. Are you sure?');
		dialogRef.afterClosed().subscribe(result => {
			if (result.status) {
				// Delete user
				this.bingoAPI.deleteUser(userId).subscribe(res => {
					this.alert.success('User deleted');
					this.users = this.users.filter(user => user._id != userId);
				}, err => {
					this.alert.error('Server error.');
				});
			}
		});
	}
}

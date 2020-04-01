import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
	message: string;
}

@Component({
	selector: 'app-yes-no',
	templateUrl: './yes-no.component.html',
	styleUrls: ['../category-dialog/category-dialog.component.css', './yes-no.component.css']
})
export class YesNoComponent implements OnInit {

	status: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<YesNoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData
	) { }

	ngOnInit(): void { }

	yesClicked() {
		this.status = true;
		this.dialogRef.close({ status: this.status });
	}

	noClicked() {
		this.status = false;
		this.dialogRef.close({ status: this.status });
	}
}

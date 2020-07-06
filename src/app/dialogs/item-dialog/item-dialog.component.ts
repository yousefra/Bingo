import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorEvent } from 'ngx-color';

export interface DialogData {
	title: string;
	buttonValue: string;
	name: string;
	backColor: string;
	category: string;
	categories: string;
	file: File;
}

@Component({
	selector: 'app-item-dialog',
	templateUrl: './item-dialog.component.html',
	styleUrls: ['../category-dialog/category-dialog.component.css', './item-dialog.component.css']
})
export class ItemDialogComponent implements OnInit {

	itemDialogForm: FormGroup;
	selectedFile: File = null;
	selectedColor: string = this.data.backColor || '#22194D';
	fileChanged: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<ItemDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData
	) { }

	ngOnInit(): void {
		this.itemDialogForm = this.formBuilder.group({
			name: [this.data.name, Validators.required],
			category: [this.data.category, Validators.required],
			file: ['']
		});
		if (this.data.buttonValue === 'Add') {
			const fileControl = this.itemDialogForm.get('file');
			fileControl.setValidators([Validators.required]);
			fileControl.updateValueAndValidity();
		}

	}

	onFileSelected(event) {
		this.selectedFile = <File>event.target.files[0];
		this.fileChanged = true;
	}

	get f() { return this.itemDialogForm.controls; }

	changeComplete($event: ColorEvent) {
		this.selectedColor = $event.color.hex;
		// color = {
		//   hex: '#333',
		//   rgb: {
		//     r: 51,
		//     g: 51,
		//     b: 51,
		//     a: 1,
		//   },
		//   hsl: {
		//     h: 0,
		//     s: 0,
		//     l: .20,
		//     a: 1,
		//   },
		// }
	}

	onSubmit() {
		this.dialogRef.close({
			status: true,
			name: this.f.name.value,
			file: this.selectedFile,
			fileChanged: this.fileChanged,
			category: this.f.category.value,
			backColor: this.selectedColor
		});
	}
}

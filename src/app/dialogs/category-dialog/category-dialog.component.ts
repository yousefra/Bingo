import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  name: string;
  categoryTitle: string;
  buttonValue: string;
}

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent implements OnInit {

  categoryDialog: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.categoryDialog = this.formBuilder.group({
      name: [this.data.name, Validators.required],
      categoryTitle: [this.data.categoryTitle, Validators.required]
    })
  }

  get f() { return this.categoryDialog.controls; }

  onSubmit() {
    this.dialogRef.close({ status: true, name: this.f.name.value, categoryTitle: this.f.categoryTitle.value });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'add-sample-dialog',
    templateUrl: './add-sample-dialog.component.html',
    styleUrls: ['./add-sample-dialog.component.scss']
})
export class AddSampleDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<AddSampleDialogComponent>) { }

    ngOnInit() {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}

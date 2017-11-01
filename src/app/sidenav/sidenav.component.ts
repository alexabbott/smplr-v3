import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddSampleDialogComponent } from '../add-sample-dialog/add-sample-dialog.component';

@Component({
    selector: 'sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

    constructor(public dialog: MatDialog) { }

    ngOnInit() {
    }

    openSampleDialog() {
        let dialogRef = this.dialog.open(AddSampleDialogComponent, {
            width: '250px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }
}

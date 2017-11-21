import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase/app';
import { MatSnackBar } from '@angular/material';
import { GlobalService } from '../global.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

@Component({
    selector: 'add-sample-dialog',
    templateUrl: './add-sample-dialog.component.html',
    styleUrls: ['./add-sample-dialog.component.scss']
})
export class AddSampleDialogComponent implements OnInit {
    sampleName: string;
    storageRef: any;
    file: any;
    sampleURL: string;
    user: string;
    allowSave: boolean;
    tags: any;

    // Enter, comma
    separatorKeysCodes = [ENTER, COMMA];

    constructor(
        public dialogRef: MatDialogRef<AddSampleDialogComponent>,
        public db: AngularFirestore,
        public af: FirebaseApp,
        public snackBar: MatSnackBar,
        public globalService: GlobalService
    ) {
        this.storageRef = af.storage().ref();
        this.allowSave = false;
        this.tags = [];
    }

    ngOnInit() {
        this.globalService.user.subscribe((u) => {
            this.user = u;
        });
    }

    handleFiles(e) {
        this.file = e.srcElement.files[0];
        if (this.file.size > 2097152) {
            let snackBarRef = this.snackBar.open('Images must be 2 MB or less', 'OK!', {
                duration: 3000
            });
        } else {
            this.uploadSample();
        }
    }

    uploadSample() {
        let storageRef = firebase.storage().ref();
        let path = Date.now().toString() + '-' + this.file.name;
        let iRef = storageRef.child('samples/' + path);
        let me = this;
        iRef.put(this.file).then((snapshot) => {
            let snackBarRef = this.snackBar.open('Sample uploaded', 'OK!', {
                duration: 3000
            });
            this.storageRef.child('samples/' + path).getDownloadURL().then((url) => {
                me.sampleURL = url;
                this.allowSave = true;
            });
        });
    }

    saveSample() {
        let sampleData = {
            name: this.sampleName,
            slug: this.globalService.slugify(this.sampleName),
            url: this.sampleURL,
            user: this.db.collection('users').doc(this.user).ref,
            tags: this.tags
        }
        console.log('sampleData', sampleData);
        this.db.collection('samples').add(sampleData).then((resp) => {
            console.log('saved sample', resp);
            this.db.collection('users/' + this.user + '/samples').add({
                sample: this.db.collection('samples').doc(resp.id).ref})
            .then((response) => {
                console.log('saved user sample', response);
            });
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addChip(event: MatChipInputEvent): void {
        let input = event.input;
        let value = event.value;

        if ((value || '').trim()) {
            this.tags.push({ name: value.trim() });
        }

        if (input) {
            input.value = '';
        }
    }

    removeChip(tag: any): void {
        let index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

}

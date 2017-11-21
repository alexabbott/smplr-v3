import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase/app';
import { MatSnackBar } from '@angular/material';
import { GlobalService } from '../global.service';

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

    constructor(
        public dialogRef: MatDialogRef<AddSampleDialogComponent>,
        public db: AngularFirestore,
        public af: FirebaseApp,
        public snackBar: MatSnackBar,
        public globalService: GlobalService
    ) {
        this.storageRef = af.storage().ref();
        this.allowSave = false;
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
        this.db.collection('samples').add({
            name: this.sampleName,
            slug: this.globalService.slugify(this.sampleName),
            url: this.sampleURL,
            user: this.db.collection('users').doc(this.user).ref
        }).then((resp) => {
            console.log('saved sample', resp);
            this.db.collection('users/' + this.user + '/samples').add(
                this.db.collection('samples').doc(resp.id).ref)
            .then((response) => {
                console.log('saved user sample', response);
            });
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}

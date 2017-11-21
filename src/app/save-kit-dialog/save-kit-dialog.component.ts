import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from '../global.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'save-kit-dialog',
  templateUrl: './save-kit-dialog.component.html',
  styleUrls: ['./save-kit-dialog.component.scss']
})
export class SaveKitDialogComponent implements OnInit {
  kitName: string;
  currentSamples: any;
  user: string;

  constructor(
    public dialogRef: MatDialogRef<SaveKitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public db: AngularFirestore,
    public globalService: GlobalService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.globalService.user.subscribe((u) => this.user = u);
    if (this.data && this.data.kitName) {
      this.kitName = this.data.kitName;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveNewKit() {
    this.globalService.currentSamples.subscribe((samples) => {
      this.currentSamples = samples;
      let sampleRefs = [];
      for (let i = 0; i < this.currentSamples.length; i++) {
        sampleRefs.push(this.db.doc('samples/' + this.currentSamples[i].id).ref);
      }
      this.db.collection('kits').doc(this.globalService.slugify(this.kitName)).set({
        name: this.kitName,
        slug: this.globalService.slugify(this.kitName),
        samples: sampleRefs,
        user: this.db.collection('users').doc(this.user).ref
      }).then((resp) => {
        console.log('saved kit', resp);
        this.db.collection('users/' + this.user + '/kits').add({
          kit: this.db.collection('kits').doc(this.globalService.slugify(this.kitName)).ref})
          .then((response) => {
            console.log('saved user kit', response);
        });
      });
    });
  }
}
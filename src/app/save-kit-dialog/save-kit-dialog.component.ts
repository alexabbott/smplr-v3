import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from '../global.service';

@Component({
  selector: 'save-kit-dialog',
  templateUrl: './save-kit-dialog.component.html',
  styleUrls: ['./save-kit-dialog.component.scss']
})
export class SaveKitDialogComponent implements OnInit {
  kitName: string;
  currentSamples: any;

  constructor(
    public dialogRef: MatDialogRef<SaveKitDialogComponent>,
    public db: AngularFirestore,
    public globalService: GlobalService
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveNewKit() {
    this.globalService.currentSamples.subscribe((samples) => {
      this.currentSamples = samples;
      let sampleRefs = [];
      for (let i = 0; i < this.currentSamples.length; i++) {
        sampleRefs.push(this.db.doc('samples/' + this.currentSamples[i].id));
      }
      this.db.collection<any[]>('kits').doc(this.slugify(this.kitName)).set({
        name: this.kitName,
        slug: this.slugify(this.kitName),
        samples: sampleRefs
      }).then((resp) => {
        console.log('saved kit', resp);
      });
    });
  }

  slugify(text) {
    return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
  }

}
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { GlobalService } from '../global.service';
import { SequencerService } from '../sequencer.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';

@Component({
  selector: 'save-kit-dialog',
  templateUrl: './save-kit-dialog.component.html',
  styleUrls: ['./save-kit-dialog.component.scss']
})
export class SaveKitDialogComponent implements OnInit {
  kitName: string;
  currentSamples: any;
  user: string;
  sequence: Array<Array<Number>>;
  tags: Array<any>;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA, SPACE];

  constructor(
    public dialogRef: MatDialogRef<SaveKitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public db: AngularFirestore,
    public globalService: GlobalService,
    public sequencerService: SequencerService,
    public snackBar: MatSnackBar,
    public router: Router,
  ) {
    this.tags = [];
  }

  ngOnInit() {
    this.globalService.userId.subscribe((u) => this.user = u);

    this.globalService.currentSamples.subscribe((samples) => this.currentSamples = samples);

    this.sequencerService.sequence.subscribe((s) => { this.sequence = s; console.log(this.sequence); });

    if (this.data) {
      if (this.data.name) { this.kitName = this.data.name; }
      if (this.data.tags) { this.tags = this.globalService.formattedChips(this.data.tags); }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectSequence() {
    let sequence;
    if (this.sequence.length > 0) {
      sequence = this.sequencerService.buildSequenceObject(this.sequence);
    } else if (this.data && this.data.sequence) {
      sequence = this.data.sequenece;
    } else {
      sequence = {};
    }
    return sequence;
  }

  saveNewKit() {
    const sampleRefs = [];
    const slug = this.globalService.slugify(this.kitName);

    for (let i = 0; i < this.currentSamples.length; i++) {
      sampleRefs.push(this.db.doc('samples/' + this.currentSamples[i].id).ref);
    }

    this.db.collection('kits').doc(slug).set({
      name: this.kitName,
      slug,
      samples: sampleRefs,
      user: this.db.collection('users').doc(this.user).ref,
      sequence: this.selectSequence(),
      tags: this.globalService.formattedTags(this.kitName, this.tags),
      updated: firebase.firestore.FieldValue.serverTimestamp(),
      favoritesCount: this.data && this.data.favoritesCount ? this.data.favoritesCount : 0,
    }, {merge: true}).then((resp) => {
      console.log('saved kit', resp);
      this.saveUserKit();
    });
  }

  saveUserKit() {
    this.db.collection('users/' + this.user + '/kits').add({
      kit: this.db.collection('kits').doc(this.globalService.slugify(this.kitName)).ref
    })
      .then((response) => {
        console.log('saved user kit', response);
        this.router.navigate([`kit/${this.globalService.slugify(this.kitName)}`]);
      });
  }

  addChip(event: any): void {
    const input = event.input;
    const value = event.value;

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
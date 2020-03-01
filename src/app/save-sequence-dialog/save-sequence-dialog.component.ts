import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalService } from '../global.service';
import { SequencerService } from '../sequencer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'save-sequence-dialog',
  templateUrl: './save-sequence-dialog.component.html',
  styleUrls: ['./save-sequence-dialog.component.scss']
})
export class SaveSequenceDialogComponent implements OnInit {
  kitName: string;
  kitSamples: any;

  constructor(
    public dialogRef: MatDialogRef<SaveSequenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public db: AngularFirestore,
    public globalService: GlobalService,
    public sequencerService: SequencerService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.globalService.kitName.subscribe((name) => {
      this.kitName = name;
    });
    this.globalService.currentSamples.subscribe((samples) => {
      this.kitSamples = samples;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveSequence() {
    this.sequencerService.sequence.subscribe((sequence) => {
      this.globalService.slugify(this.kitName);
      this.db.collection('kits').doc(this.globalService.slugify(this.kitName)).update({
        sequence: this.sequencerService.buildSequenceObject(sequence),
      }).then((resp) => {
        console.log('saved sequence', resp);
      });
    });
  }
}
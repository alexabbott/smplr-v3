import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Firestore, updateDoc, doc, collection } from '@angular/fire/firestore';
import { GlobalService } from '../global.service';
import { SequencerService } from '../sequencer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'save-sequence-dialog',
  templateUrl: './save-sequence-dialog.component.html',
  styleUrls: ['./save-sequence-dialog.component.scss']
})
export class SaveSequenceDialogComponent implements OnInit {
  kitName!: string;
  kitSamples: any;

  constructor(
    public dialogRef: MatDialogRef<SaveSequenceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public firestore: Firestore = Inject(Firestore),
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
    this.sequencerService.sequence.subscribe(async (sequence) => {
      this.globalService.slugify(this.kitName);

      const kitsRef = collection(this.firestore, 'kits')

      const kitRef = doc(kitsRef, this.globalService.slugify(this.kitName))

      await updateDoc(kitRef, {
        sequence: this.sequencerService.buildSequenceObject(sequence)
      })

      console.log('saved sequence');
        let snackBarRef = this.snackBar.open('Sequence saved', 'OK!', {
          duration: 3000
        });

    });
  }
}
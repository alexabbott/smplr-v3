import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalService } from '../global.service';
import { AudioService } from '../audio.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SaveSampleDialogComponent } from '../save-sample-dialog/save-sample-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})
export class SamplesComponent implements OnInit {
  samples: any;
  search: string;
  initialResults: Array<any>;
  modelChanged: Subject<string> = new Subject<string>();
  user: string;
  sort = 'updated';
  context: any;

  constructor(
    public db: AngularFirestore,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public audioService: AudioService,
  ) {
    this.samples = [];
    this.modelChange();
    this.globalService.userId.subscribe((u) => this.user = u);
    this.context = this.audioService.context;
  }

  ngOnInit() {
    this.initialSearch();
  }

  modelChange() {
    this.modelChanged
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe(search => {
        if (search && search !== '') {
          this.searchSamples(search);
        } else {
          this.samples = this.initialResults;
        }
      });
  }

  initialSearch() {
    this.db
      .collection('samples', ref => ref
        .limit(20)
        .orderBy(this.sort, 'desc'))
      .snapshotChanges()
      .subscribe((samples) => {
        this.samples = this.transformedData(samples)
        this.initialResults = this.samples;
      });
  }

  searchChanged(text: string) {
    this.modelChanged.next(text);
  }

  searchSamples(search: string) {
    this.db
      .collection('samples', ref => ref
        .where('tags', 'array-contains-any', search.split(' '))
        .orderBy(this.sort, 'desc')
        .limit(20))
      .snapshotChanges()
      .subscribe((response) => {
        this.samples = this.transformedData(response);
      });
  }

  transformedData(samples) {
    const newSamples = [];
    samples.forEach((sample) => {
      const newSample = sample.payload.doc.data();
      newSample.id = sample.payload.doc.id;
      newSamples.push(newSample);
    });
    return newSamples;
  }

  sortSamples(attribute: string) {
    this.sort = attribute;
    if (!this.search || this.search === '') {
      this.initialSearch();
    } else {
      if (this.search && this.search !== '') {
        this.searchSamples(this.search);
      } else {
        this.samples = this.initialResults;
      }
    }
  }

  openSampleDialog() {
    this.globalService.keyMapEnabled.next(false);
    const dialogRef = this.dialog.open(SaveSampleDialogComponent, {
        width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
        this.globalService.keyMapEnabled.next(true);
        console.log('The sample upload dialog was closed');
    });
  }
}

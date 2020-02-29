import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalService } from '../global.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

  constructor(
    public db: AngularFirestore,
    public globalService: GlobalService,
  ) {
    this.samples = [];
    this.modelChange();
    this.globalService.user.subscribe((u) => this.user = u);
  }

  ngOnInit() {
    this.initialSearch();
  }

  modelChange() {
    this.modelChanged
      .pipe(debounceTime(300), distinctUntilChanged())
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
        .where('tags', 'array-contains-any', [search])
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
}

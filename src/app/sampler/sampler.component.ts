import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'sampler',
  templateUrl: './sampler.component.html',
  styleUrls: ['./sampler.component.scss']
})
export class SamplerComponent implements OnInit {
  kitsCollection: AngularFirestoreCollection<any[]>;
  kit: Observable<any>;
  samples: any;
  kitSamples: any;
  newSample: Observable<any>;

  constructor(
    public db: AngularFirestore,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.samples = [];
    this.kitSamples = [];
  }

  getSample(sampleId) {
    return this.db.doc('samples/' + sampleId).valueChanges();
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params.slug) {
        this.kitsCollection = this.db.collection<any[]>('kits', ref => ref.where('slug', '==', params.slug));
        this.kit = this.kitsCollection.valueChanges();
        this.kit.subscribe((k) => {
          console.log(this.getSample(k[0].samples[0].id));
          k.samples.forEach((s) => {
            this.samples.push(this.getSample(s.id));
          });
        });
      }
    });
  }

}

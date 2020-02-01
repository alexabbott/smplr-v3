import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from '../global.service';

@Component({
    selector: 'sample-bank',
    templateUrl: './sample-bank.component.html',
    styleUrls: ['./sample-bank.component.scss']
})
export class SampleBankComponent implements OnInit {
    samplesRef: Observable<any>;
    samples: any;
    sampleSearch: string;
    newSample: any;

    constructor(
        public db: AngularFirestore,
        public globalService: GlobalService,
    ) {
        this.sampleSearch = '';
        this.samples = [];
        this.samplesRef = this.db.collection<any[]>('samples').snapshotChanges();
    }

    ngOnInit() {
        this.samplesRef.subscribe((s) => {
            for (let i = 0; i < s.length; i++) {
                this.newSample = s[i].payload.doc.data();
                this.newSample.id = s[i].payload.doc.id;
                this.samples.push(this.newSample);
            }
        });
    }
}

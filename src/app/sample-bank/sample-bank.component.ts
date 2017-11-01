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

    constructor(
        public db: AngularFirestore,
        public globalService: GlobalService
    ) {
        this.samples = [];
        this.samplesRef = this.db.collection<any[]>('samples').valueChanges();

        globalService.movedSample.subscribe((sample) => {
            if (sample) {
                this.samples.push(sample);
            }
        });
    }

    ngOnInit() {
        this.samplesRef.subscribe((s) => {
            for (let i = 0; i < s.length; i++) {
                this.samples.push(s[i]);
            }
        });
    }

    consoleIt($event: any) {
        console.log('start', $event);
    }

}

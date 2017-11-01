import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({
    selector: 'sampler',
    templateUrl: './sampler.component.html',
    styleUrls: ['./sampler.component.scss']
})
export class SamplerComponent implements OnInit {
    kit: Observable<any>;
    kitSamples: any;

    constructor(
        public db: AngularFirestore,
        public route: ActivatedRoute,
        public router: Router,
        public globalService: GlobalService
    ) {
        this.kitSamples = [];
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            if (params.slug) {
                this.kit = this.db.collection<any[]>('kits').doc(params.slug).valueChanges();
                this.kit.subscribe((k) => {
                    for (let i = 0; i < k.samples.length; i++) {
                        this.db.collection<any[]>('samples').doc(k.samples[i].id).valueChanges().subscribe((s) => {
                            this.kitSamples.push(s);
                        });
                    }
                });
            }
        });
    }

    addBack($event: any) {
        console.log('dropped', $event);
        this.globalService.movedSample.next($event);
    }
}

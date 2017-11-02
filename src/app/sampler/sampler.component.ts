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
    kits: Observable<any>;
    kitSamples: any;
    currentKit: any;

    constructor(
        public db: AngularFirestore,
        public route: ActivatedRoute,
        public router: Router,
        public globalService: GlobalService
    ) {
        this.kitSamples = [];
        this.kits = this.db.collection<any[]>('kits').valueChanges();
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            if (params.slug) {
                this.kit = this.db.collection<any[]>('kits').doc(params.slug).valueChanges();
                this.kit.subscribe((k) => {
                    this.currentKit = k.slug;
                    for (let i = 0; i < k.samples.length; i++) {
                        this.db.collection<any[]>('samples').doc(k.samples[i].id).valueChanges().subscribe((s) => {
                            this.kitSamples.push(s);
                        });
                    }
                });
            }
        });
    }

    changeKit() {
        this.kitSamples = [];
        this.router.navigateByUrl('kit/' + this.currentKit);
    }

    replaceSample($event: any) {
        let index = $event.mouseEvent.toElement.id.split('sample')[1] - 1;
        this.kitSamples.splice(index, 1, $event.dragData);
    }
}

import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalService } from '../global.service';
import { MatDialog } from '@angular/material';
import { AddSampleDialogComponent } from '../add-sample-dialog/add-sample-dialog.component';
import { SaveKitDialogComponent } from '../save-kit-dialog/save-kit-dialog.component';

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
    sample: any;

    constructor(
        public db: AngularFirestore,
        public route: ActivatedRoute,
        public router: Router,
        public globalService: GlobalService,
        public dialog: MatDialog
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
                            this.sample = {};
                            this.sample = s;
                            this.sample.id = k.samples[i].id;
                            this.kitSamples.push(this.sample);
                        });
                    }
                    this.globalService.currentSamples.next(this.kitSamples);
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
        this.globalService.currentSamples.next(this.kitSamples);
    }

    openSampleDialog() {
        let dialogRef = this.dialog.open(AddSampleDialogComponent, {
            width: '250px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The sample upload dialog was closed');
        });
    }

    openSaveKitDialog() {
        let dialogRef = this.dialog.open(SaveKitDialogComponent, {
            width: '250px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The save kit dialog was closed');
        });
    }
}

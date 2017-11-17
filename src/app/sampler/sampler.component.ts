import { Component, OnInit, HostListener } from '@angular/core';
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
    keyMap: any;

    constructor(
        public db: AngularFirestore,
        public route: ActivatedRoute,
        public router: Router,
        public globalService: GlobalService,
        public dialog: MatDialog
    ) {
        this.kitSamples = [];
        this.kits = this.db.collection<any[]>('kits').valueChanges();

        this.keyMap = {
            'z': 12,
            'x': 13,
            'c': 14,
            'v': 15,
            'a': 8,
            's': 9,
            'd': 10,
            'f': 11,
            'q': 4,
            'w': 5,
            'e': 6,
            'r': 7,
            '1': 0,
            '2': 1,
            '3': 2,
            '4': 3,
        }
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

    @HostListener('document:keydown', ['$event'])
    keydown(e: KeyboardEvent) {
        let sample = <HTMLAudioElement>document.getElementById('player' + (this.keyMap[e.key] + 1));
        sample.play();
    }

    @HostListener('document:keyup', ['$event'])
    keyup(e: KeyboardEvent) {
        let sample = <HTMLAudioElement>document.getElementById('player' + (this.keyMap[e.key] + 1));
        sample.pause();
        sample.currentTime = 0;
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

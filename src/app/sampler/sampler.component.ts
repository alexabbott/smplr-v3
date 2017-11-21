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
    user: any;
    kit: Observable<any>;
    kits: Observable<any>;
    kitUser: any;
    kitSamples: any;
    currentKit: any;
    sample: any;
    keys: any;
    keyMap: any;
    keyMapEnabled: boolean;
    activeKeys: any;

    constructor(
        public db: AngularFirestore,
        public route: ActivatedRoute,
        public router: Router,
        public globalService: GlobalService,
        public dialog: MatDialog
    ) {
        this.kitSamples = [];
        this.currentKit = {};
        this.kits = this.db.collection<any[]>('kits').valueChanges();

        this.globalService.keyMapEnabled.subscribe((enabled) => {
            this.keyMapEnabled = enabled;
        });

        this.keys = [
            '4',
            '5',
            '6',
            '7',
            'e',
            'r',
            't',
            'y',
            's',
            'd',
            'f',
            'g',
            'z',
            'x',
            'c',
            'v',
        ];

        this.keyMap = {
            'z': 12,
            'x': 13,
            'c': 14,
            'v': 15,
            's': 8,
            'd': 9,
            'f': 10,
            'g': 11,
            'e': 4,
            'r': 5,
            't': 6,
            'y': 7,
            '4': 0,
            '5': 1,
            '6': 2,
            '7': 3,
        }

        this.activeKeys = {
            'z': false,
            'x': false,
            'c': false,
            'v': false,
            's': false,
            'd': false,
            'f': false,
            'g': false,
            'e': false,
            'r': false,
            't': false,
            'y': false,
            '4': false,
            '5': false,
            '6': false,
            '7': false,
        };
    }


    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            if (params.slug) {
                this.kit = this.db.collection<any[]>('kits').doc(params.slug).valueChanges();
                this.kit.subscribe((k) => {
                    this.currentKit.slug = k.slug;
                    this.currentKit.name = k.name;
                    for (let i = 0; i < k.samples.length; i++) {
                        this.db.collection<any[]>('samples').doc(k.samples[i].id).valueChanges().subscribe((s) => {
                            this.sample = {};
                            this.sample = s;
                            this.sample.id = k.samples[i].id;
                            this.kitSamples.push(this.sample);
                        });
                    }
                    this.db.collection<any[]>('users').doc(k.user.id).snapshotChanges().subscribe((u) => {
                        this.kitUser = u.payload.id;
                    });
                    this.globalService.currentSamples.next(this.kitSamples);
                });
            }
        });

        this.globalService.user.subscribe((u) => {
            this.user = u;
        });
    }

    @HostListener('document:keydown', ['$event'])
    keydown(e: KeyboardEvent) {
        if (this.keyMapEnabled && this.keys.includes(e.key)) {
            let sample = <HTMLAudioElement>document.getElementById('player' + (this.keyMap[e.key] + 1));
            if (!this.activeKeys[e.key]) {
                sample.play();
            }
            this.activeKeys[e.key] = true;
            sample.onended = () => {
                sample.pause();
                sample.currentTime = 0;
            };
        }
    }

    @HostListener('document:keyup', ['$event'])
    keyup(e: KeyboardEvent) {
        if (this.keyMapEnabled && this.keys.includes(e.key)) {
            this.activeKeys[e.key] = false;
            let sample = <HTMLAudioElement>document.getElementById('player' + (this.keyMap[e.key] + 1));
            sample.pause();
            sample.currentTime = 0;
        }
    }

    changeKit() {
        this.kitSamples = [];
        this.router.navigateByUrl('kit/' + this.currentKit.slug);
    }

    replaceSample($event: any) {
        let index = $event.mouseEvent.toElement.id.split('sample')[1] - 1;
        this.kitSamples.splice(index, 1, $event.dragData);
        this.globalService.currentSamples.next(this.kitSamples);
    }

    openSampleDialog(edit: boolean) {
        this.globalService.keyMapEnabled.next(false);
        let dialogRef = this.dialog.open(AddSampleDialogComponent, {
            width: '350px'
        });

        dialogRef.afterClosed().subscribe(result => {
            this.globalService.keyMapEnabled.next(true);
            console.log('The sample upload dialog was closed');
        });
    }

    openSaveKitDialog(edit: boolean) {
        this.globalService.keyMapEnabled.next(false);
        let dialogRef;

        if (edit) {
            dialogRef = this.dialog.open(SaveKitDialogComponent, {
                width: '350px',
                data: { kitName: this.currentKit.name }
            });
        } else {
            dialogRef = this.dialog.open(SaveKitDialogComponent, {
                width: '350px'
            });
        }

        dialogRef.afterClosed().subscribe(result => {
            this.globalService.keyMapEnabled.next(true);
            console.log('The save kit dialog was closed');
        });
    }
}

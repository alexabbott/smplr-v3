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
            '1',
            '2',
            '3',
            '4',
            'q',
            'w',
            'e',
            'r',
            'a',
            's',
            'd',
            'f',
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

        this.activeKeys = {
            'z': false,
            'x': false,
            'c': false,
            'v': false,
            'a': false,
            's': false,
            'd': false,
            'f': false,
            'q': false,
            'w': false,
            'e': false,
            'r': false,
            '1': false,
            '2': false,
            '3': false,
            '4': false,
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
        if (this.keyMapEnabled) {
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
        if (this.keyMapEnabled) {
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
            width: '250px'
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
                width: '250px',
                data: { kitName: this.currentKit.name }
            });
        } else {
            dialogRef = this.dialog.open(SaveKitDialogComponent, {
                width: '250px'
            });
        }

        dialogRef.afterClosed().subscribe(result => {
            this.globalService.keyMapEnabled.next(true);
            console.log('The save kit dialog was closed');
        });
    }
}

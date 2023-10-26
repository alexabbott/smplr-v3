import { Component, OnInit, HostListener, inject } from '@angular/core'
import { Firestore, collection, query, where, getDocs, doc, getDoc, documentId } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { GlobalService } from '../global.service'
import { AudioService } from '../audio.service'
import { MatDialog } from '@angular/material/dialog'
import { SaveKitDialogComponent } from '../save-kit-dialog/save-kit-dialog.component'
import { SaveSequenceDialogComponent } from '../save-sequence-dialog/save-sequence-dialog.component'
import 'firebase/firestore'

@Component({
    selector: 'kit',
    templateUrl: './kit.component.html',
    styleUrls: ['./kit.component.scss']
})
export class KitComponent implements OnInit {
    user: any
    kit!: Observable<any>
    kits!: Observable<any>
    kitUser: any = {}
    kitSamples: any
    currentKit: any
    sample: any
    keys: any
    keyMap: any
    keyMapEnabled!: boolean
    activeKeys: any
    sampleLimit: number = 16
    newKit = false
    gainNodes!: any
    private firestore: Firestore = inject(Firestore)

    constructor(
        public db: Firestore,
        public route: ActivatedRoute,
        public router: Router,
        public globalService: GlobalService,
        public audioService: AudioService,
        public dialog: MatDialog
    ) {
        this.kitSamples = this.globalService.create2DArray(this.sampleLimit)
        this.currentKit = {}
        this.activeKeys = {}

        this.globalService.keyMapEnabled.subscribe((enabled) => {
            this.keyMapEnabled = enabled
        })

        this.keys = this.globalService.keys

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
    }

    ngOnInit() {
        this.initializeActiveKeys()
        this.loadKit()

        this.globalService.userId.subscribe((user) => {
            this.user = user
        })

        this.globalService.currentSamples.subscribe((samples) => {
            this.kitSamples = samples
        })

        this.audioService.gainNodes.subscribe((nodes) => {
            this.gainNodes = nodes
        })
    }

    @HostListener('document:keydown', ['$event'])
    keydown(e: KeyboardEvent) {
        this.audioService.resumeContext()
        if (this.keyMapEnabled && this.keys.includes(e.key)) {
            const sample = <HTMLAudioElement>document.getElementById('sampler' + (this.keyMap[e.key] + 1))
            if (sample.getAttribute('src')) {
                if (!this.activeKeys[e.key]) {
                    const sampleName = (sample.id).replace('sampler', '')
                    const gainNode = this.gainNodes[sampleName]
                    const ogGain = (<HTMLInputElement>sample.parentElement!.querySelector('.gain')).value
                    gainNode.gain.value = ogGain
                    sample.currentTime = 0
                    sample.play()
                }
                this.activeKeys[e.key] = true
                sample.onended = () => {
                    sample.pause()
                    sample.currentTime = 0
                }
            }
        }
    }

    @HostListener('document:keyup', ['$event'])
    keyup(e: KeyboardEvent) {
        if (this.keyMapEnabled && this.keys.includes(e.key)) {
            this.activeKeys[e.key] = false
            const sample = <HTMLAudioElement>document.getElementById('sampler' + (this.keyMap[e.key] + 1))
            if (sample.getAttribute('src')) {
                const gainNode = this.gainNodes[(sample.id).replace('sampler', '')]
                gainNode.gain.setValueAtTime(gainNode.gain.value, this.audioService.context.currentTime) 
                gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioService.context.currentTime + 0.03)
                sample.pause()
                sample.currentTime = 0
            }
        }
    }

    initializeActiveKeys() {
        this.keys.forEach((key: string | number) => {
            this.activeKeys[key] = false
        })
    }

    replaceSample($event: any) {
        console.log('$event', $event.container.id)
        // const target = $event.item.element['nativeElement']['firstChild']
        // if (target) {
        //     const index = $event.container.id.split('sample')[1] - 1
        //     console.log('index', index)
        //     this.kitSamples.splice(index, 1, $event.item.data)
        //     console.log('k', this.kitSamples)
        //     this.globalService.currentSamples.next(this.kitSamples)
        // }
    }

    openSaveKitDialog(edit: boolean) {
        this.globalService.keyMapEnabled.next(false)
        let dialogRef

        if (edit) {
            dialogRef = this.dialog.open(SaveKitDialogComponent, {
                width: '350px',
                data: this.currentKit
            })
        } else {
            dialogRef = this.dialog.open(SaveKitDialogComponent, {
                width: '350px'
            })
        }

        dialogRef.afterClosed().subscribe(result => {
            this.globalService.keyMapEnabled.next(true)
            console.log('The save kit dialog was closed')
        })
    }

    openSaveSequenceDialog() {
        this.globalService.keyMapEnabled.next(false)
        let dialogRef

        dialogRef = this.dialog.open(SaveSequenceDialogComponent, {
            width: '350px',
        })

        dialogRef.afterClosed().subscribe(result => {
            this.globalService.keyMapEnabled.next(true)
            console.log('The save sequence dialog was closed')
        })
    }

    loadKit() {
        this.route.params.subscribe(async (params: Params) => {
            if (params['slug']) {
                const kitsRef = collection(this.firestore, 'kits')
                const kitsQuery = query(kitsRef, where('slug', '==', params['slug']))
                const querySnapshot = await getDocs(kitsQuery)
                const kit = this.transformedData(querySnapshot)[0]
    
                this.currentKit = {
                    slug: kit.slug,
                    name: kit.name,
                    favoritesCount: kit.favoritesCount,
                    tags: kit.tags,
                    user: kit.user.id,
                    sequence: kit.sequence,
                }
                this.globalService.currentSequence.next(kit.sequence)
                if (kit && kit.samples) { this.loadKitSamples(kit) }
                this.setKitUser()
                this.globalService.currentSamples.next(this.kitSamples)
                this.globalService.kitName.next(this.currentKit.name)
            } else {
                this.currentKit = { samples: {} }
                this.kitSamples = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
                this.newKit = true
            }
        })
    }

    async loadKitSamples(kit: any) {
        const sampleIds = kit.samples.map((sample: any) => sample.id)
        this.kitSamples = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
        const samplesRef = collection(this.firestore, 'samples')
        const firstBatch = query(samplesRef, where(documentId(), 'in', sampleIds.slice(0, 8)))
        const secondBatch = query(samplesRef, where(documentId(), 'in', sampleIds.slice(8, 16)))
        const firstBatchSamples = await getDocs(firstBatch)

        firstBatchSamples.forEach((sample: any) => {
            this.kitSamples[sampleIds.indexOf(sample.id)] = sample.data()
        })

        const secondBatchSamples = await getDocs(secondBatch)

        secondBatchSamples.forEach((sample: any) => {
            this.kitSamples[sampleIds.indexOf(sample.id)] = sample.data()
        })
    }

    async setKitUser() {
        const kitQuery = doc(this.firestore, `users/${this.currentKit.user}`)
        const kitRef = await getDoc(kitQuery)
        this.kitUser = kitRef.data()
        this.kitUser['id'] = this.currentKit.user
    }

    transformedData(items: any) {
        const newArray: any[] = []
        items.forEach((item: any) => {
          const newItem = item.data()
          newItem.id = item.id
          newArray.push(newItem)
        })
        return newArray
      }

    openUserProfile() {
        this.globalService.updateParams('profile', this.currentKit.user)
    }
}

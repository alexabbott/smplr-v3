import { Component, OnInit, Inject } from '@angular/core'
import { Router } from '@angular/router'
import { Firestore, doc, serverTimestamp, updateDoc, addDoc, collection } from '@angular/fire/firestore'
import { GlobalService } from '../global.service'
import { SequencerService } from '../sequencer.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes'

@Component({
  selector: 'save-kit-dialog',
  templateUrl: './save-kit-dialog.component.html',
  styleUrls: ['./save-kit-dialog.component.scss']
})
export class SaveKitDialogComponent implements OnInit {
  kitName!: string
  currentSamples: any
  user!: any
  sequence!: Array<Array<Number>>
  tags: Array<any>

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA, SPACE]

  constructor(
    public dialogRef: MatDialogRef<SaveKitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public db: Firestore,
    public globalService: GlobalService,
    public sequencerService: SequencerService,
    public snackBar: MatSnackBar,
    public router: Router,
    private firestore: Firestore = Inject(Firestore)
  ) {
    this.tags = []
  }

  ngOnInit() {
    this.globalService.userId.subscribe((u) => this.user = u)

    this.globalService.currentSamples.subscribe((samples) => this.currentSamples = samples)

    this.sequencerService.sequence.subscribe((s) => { this.sequence = s })

    if (this.data) {
      if (this.data.name) { this.kitName = this.data.name }
      if (this.data.tags) { this.tags = this.globalService.formattedChips(this.data.tags) }
    }
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  selectSequence() {
    let sequence
    if (this.sequence.length > 0) {
      sequence = this.sequencerService.buildSequenceObject(this.sequence)
    } else if (this.data && this.data.sequence) {
      sequence = this.data.sequence
    } else {
      sequence = {}
    }
    return sequence
  }

  async saveNewKit() {
    const sampleRefs: any[] = []
    const slug = this.globalService.slugify(this.kitName)

    this.currentSamples.forEach((sample: { id: any; sid: any }) => {
      if (sample.id) { sample.sid = sample.id }
      sampleRefs.push(doc(this.firestore, `samples/${sample.sid}`))
    })

    const kitData = {
      name: this.kitName,
      slug,
      samples: sampleRefs,
      user: doc(this.firestore, `users/${this.user}`).id,
      sequence: this.selectSequence(),
      tags: this.globalService.formattedTags(this.kitName, this.tags),
      updated: serverTimestamp(),
      favoritesCount: this.data && this.data.favoritesCount ? this.data.favoritesCount : 0,
    }

    const kitsRef = collection(this.firestore, 'kits')
    const kitRef = doc(this.firestore, `kits/${slug}`)

    if (!this.data) {
      await addDoc(kitsRef, kitData)
      console.log('saved kit')
      this.saveUserKit()
    } else {
      await updateDoc(kitRef, kitData)
    }
  }

  async saveUserKit() {
    const kitsRef = collection(this.firestore, 'kits')
    const userKitsRef = collection(this.firestore, `users/${this.user}/kits`)
    await addDoc(userKitsRef, {
      kit: doc(kitsRef, this.globalService.slugify(this.kitName))
    })

    console.log('saved user kit')
    this.router.navigate([`kit/${this.globalService.slugify(this.kitName)}`])
  }

  addChip(event: any): void {
    const input = event.input
    const value = event.value

    if ((value || '').trim()) {
      this.tags.push({ name: value.trim() })
    }

    if (input) {
      input.value = ''
    }
  }

  removeChip(tag: any): void {
    let index = this.tags.indexOf(tag)

    if (index >= 0) {
      this.tags.splice(index, 1)
    }
  }
}
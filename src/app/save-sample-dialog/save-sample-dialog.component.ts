import { Component, OnInit, Inject } from '@angular/core'
import { Firestore, collection, serverTimestamp, doc, addDoc } from '@angular/fire/firestore'
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage'
import { MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { GlobalService } from '../global.service'
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes'

@Component({
  selector: 'save-sample-dialog',
  templateUrl: './save-sample-dialog.component.html',
  styleUrls: ['./save-sample-dialog.component.scss']
})
export class SaveSampleDialogComponent implements OnInit {
  sampleName!: string
  storageRef: any
  file: any
  sampleURL!: string
  user!: any
  allowSave: boolean
  tags: any

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA, SPACE]

  constructor(
    public dialogRef: MatDialogRef<SaveSampleDialogComponent>,
    public db: Firestore,
    public snackBar: MatSnackBar,
    public globalService: GlobalService,
    private storage: Storage = Inject(Storage),
    private firestore: Firestore = Inject(Firestore)
  ) {
    this.allowSave = false
    this.tags = []
  }

  ngOnInit() {
    this.globalService.userId.subscribe((u) => this.user = u)
  }

  handleFiles(e: any) {
    this.file = e.srcElement.files[0]
    if (this.file.size > 2097152) {
      let snackBarRef = this.snackBar.open('Samples must be 2 MB or less', 'OK!', {
        duration: 3000
      })
    } else {
      this.uploadSample()
    }
  }

  async uploadSample() {
    const path = 'samples/' + Date.now().toString() + '-' + this.file.name
    const storageRef = ref(this.storage, path)
    const upload = await uploadBytesResumable(storageRef, this.file)

    this.snackBar.open('Sample uploaded', 'OK!', {
      duration: 3000
    })
  
    this.sampleURL = upload.ref.fullPath
    this.allowSave = true
  }

  async saveSample() {
    const usersRef = collection(this.firestore, 'users')
    let sampleData = {
      name: this.sampleName,
      slug: this.globalService.slugify(this.sampleName),
      url: this.sampleURL,
      user: doc(usersRef, this.user),
      updated: serverTimestamp(),
      tags: this.globalService.formattedTags(this.sampleName, this.tags),
      favoritesCount: 0,
    }

    const samplesRef = collection(this.firestore, 'samples')
    const response = await addDoc(samplesRef, sampleData)
    console.log('saved sample')

    const userSamplesRef = collection(this.firestore, `users/${this.user}/samples`)
    await addDoc(userSamplesRef, {
      sample: doc(samplesRef, response.id)
    })

    console.log('saved user sample')

  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  addChip(event: any): void {
    let input = event.input
    let value = event.value

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

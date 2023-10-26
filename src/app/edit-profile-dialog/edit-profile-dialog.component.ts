import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Firestore, doc, updateDoc } from '@angular/fire/firestore'
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent implements OnInit {
  username!: string
  file: any
  avatarURL!: string
  allowSave = false

  constructor(
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    private db: Firestore,
    public storage: Storage,
    private firestore: Firestore = Inject(Firestore)
  ) {}

  ngOnInit(): void {
    if (this.data.username) {
      this.username = this.data.username
    }
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  async saveProfile() {
    const profileData: any = {
      username: this.username
    }
    if (this.avatarURL) {
      profileData['avatar'] = this.avatarURL
    }
    const userRef = doc(this.firestore, `users/${this.data.id}`)
    await updateDoc(userRef, profileData)
    this.snackBar.open('Profile saved', 'OK!', {
      duration: 3000
    })
  }

  handleFiles(e: any) {
    this.file = e.srcElement.files[0]
    if (this.file.size > 2097152) {
      this.snackBar.open('Profile photo must be 2 MB or less', 'OK!', {
        duration: 3000
      })
    } else {
      this.uploadAvatar()
    }
  }

  async uploadAvatar() {
    const path = 'avatars/' + Date.now().toString() + '-' + this.file.name
    const storageRef = ref(this.storage, path)
    const upload = await uploadBytesResumable(storageRef, this.file)

    this.snackBar.open('Profile photo uploaded', 'OK!', {
      duration: 3000
    })
    this.avatarURL = upload.ref.fullPath
    this.allowSave = true
  }
}

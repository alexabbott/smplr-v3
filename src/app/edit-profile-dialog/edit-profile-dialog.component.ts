import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseApp } from '@angular/fire';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent implements OnInit {
  username: string;
  file: any;
  avatarURL: string;
  allowSave = false;

  constructor(
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    private db: AngularFirestore,
    public firebase: FirebaseApp,
  ) {}

  ngOnInit(): void {
    if (this.data.username) {
      this.username = this.data.username;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveProfile() {
    const profileData = {
      username: this.username
    };
    if (this.avatarURL) {
      profileData['avatar'] = this.avatarURL;
    }
    this.db.collection('users').doc(this.data.id).update(profileData).then((resp) => {
      console.log('saved profile', resp);
      this.snackBar.open('Profile saved', 'OK!', {
        duration: 3000
      });
    });
  }

  handleFiles(e) {
    this.file = e.srcElement.files[0];
    if (this.file.size > 2097152) {
      this.snackBar.open('Profile photo must be 2 MB or less', 'OK!', {
        duration: 3000
      });
    } else {
      this.uploadAvatar();
    }
  }

  uploadAvatar() {
    const storageRef = this.firebase.storage().ref();
    const path = 'avatars/' + Date.now().toString() + '-' + this.file.name;
    const fileRef = storageRef.child(path);

    fileRef.put(this.file).then((snapshot) => {
      this.snackBar.open('Profile photo uploaded', 'OK!', {
        duration: 3000
      });
      storageRef.child('avatars/' + path).getDownloadURL().then((url) => {
        this.avatarURL = url;
        this.allowSave = true;
      });
    });
  }
}

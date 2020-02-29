import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { GlobalService } from './global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userData: any;
  isKit: boolean;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public globalService: GlobalService,
    public router: Router,
  ) {
    this.authenticateUser();
    this.router.events.subscribe((url) => {
      this.isKit = window.location.pathname.substring(0, 4) === '/kit' ? true : false;
    });
  }

  ngOnInit() {
    this.globalService.user.subscribe((id) => {
      this.setFavorites(id, 'kits');
      this.setFavorites(id, 'samples');
    });
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
      console.log('logged in');
    });
  }

  logout() {
    this.afAuth.auth.signOut();
    location.reload();
  }

  authenticateUser() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        let userData = {
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email
        };
        this.globalService.user.next(user.uid);
        this.globalService.userRef.next(this.db.collection('users').doc(user.uid).ref)
        const userRef = this.db.collection('users').doc(user.uid);
        userRef.valueChanges().subscribe((u) => {
          if (!u) {
            userRef.set(userData);
          } else {
            userRef.update(userData);
          }
        });
      }
    });
  }

  convertArrayToObject(array) {
    const newObject = {};
    array.forEach((item) => { newObject[Object.keys(item)[0]] = true; });
    return newObject;
  };

  setFavorites(id: string, collection: string) {
    if (id) {
      this.db.collection(`user-favorite-${collection}`).doc(id).collection('favorites').valueChanges().subscribe((items) => {
        if (items) {
          this.globalService[`favorite${this.globalService.capitalize(collection)}`].next(this.convertArrayToObject(items));
        } else {
          this.globalService[`favorite${this.globalService.capitalize(collection)}`].next({});
        }
      });
    }
  }
}


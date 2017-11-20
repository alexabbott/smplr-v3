import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { GlobalService } from './global.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    userData: any;

    constructor(
        public afAuth: AngularFireAuth,
        public db: AngularFirestore,
        public globalService: GlobalService
    ) {
        afAuth.authState.subscribe((user) => {
            if (user) {
                this.globalService.user.next(user.uid);
                let userData = {
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    email: user.email
                };
                this.globalService.user.next(user.uid);
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

    login() {
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
            console.log('logged in');
        });
    }

    logout() {
        this.afAuth.auth.signOut();
    }
}


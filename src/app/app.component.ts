import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        public afAuth: AngularFireAuth,
        public db: AngularFirestore
    ) { }

    login() {
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
            let userData = {
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                email: result.user.email
            };
            const userRef = this.db.collection('users').doc(result.user.uid);
            userRef.valueChanges().subscribe((u) => {
                if (!u) {
                    userRef.set(userData);
                } else {
                    userRef.update(userData);
                }
            });
        });
    }

    logout() {
        this.afAuth.auth.signOut();
    }
}


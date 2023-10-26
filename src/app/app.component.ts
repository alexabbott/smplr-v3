import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Firestore, collection, doc, addDoc, updateDoc } from '@angular/fire/firestore'
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth'
import { GlobalService } from './global.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userData: any
  isKit: boolean = false
  userProfile: any
  private firestore: Firestore = inject(Firestore)
  private auth: Auth = inject(Auth)
  public user: any

  constructor(
    public globalService: GlobalService,
    public router: Router,
  ) {
    this.auth.onAuthStateChanged
    this.authenticateUser()
    this.router.events.subscribe((url) => {
      this.isKit = (window.location.pathname.substring(0, 4) === '/kit' || window.location.pathname === '/new-kit') ? true : false
    })
    // this.globalService.userId.subscribe((user: string) => {
    //   this.user = user
    //   this.setFavorites(user, 'kits')
    //   this.setFavorites(user, 'samples')
    // })
  }

  login() {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then((result: any) => {
      console.log('logged in')
    })
  }

  logout() {
    this.auth.signOut()
    location.reload()
  }

  authenticateUser() {
    this.auth.onAuthStateChanged(() => {
      if (this.auth.currentUser) {
        this.user = this.auth.currentUser
        const userData = {
          displayName: this.user.displayName,
          photoURL: this.user.photoURL,
          email: this.user.email
        }
        const firebaseUser = doc(this.firestore, `users/${this.user.uid}`)
        this.globalService.userId.next(this.user.uid)
        this.globalService.user.next(this.user)

        if (!firebaseUser) {
          addDoc(collection(this.firestore, 'users'), userData)
        } else {
          updateDoc(firebaseUser, userData)
        }
      }
    })
  }

  convertArrayToObject(array: any[]) {
    const newObject = {}
    // array.forEach((item: {}) => { newObject[Object.keys(item)[0]] = true })
    return newObject
  }

  setFavorites(id: string, collection: string) {
    if (id) {
      // collection(this.firestore, `user-favorite-${collection}`).doc(id).collection('favorites').valueChanges().subscribe((items: any) => {
      //   if (items) {
      //     this.globalService[`favorite${this.globalService.capitalize(collection)}`].next(this.convertArrayToObject(items))
      //   } else {
      //     this.globalService[`favorite${this.globalService.capitalize(collection)}`].next({})
      //   }
      // })
    }
  }

  toggleOpenClass() {
    document.body.classList.toggle('sidenav-closed')
  }
}


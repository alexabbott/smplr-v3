import { Component, OnInit, Inject } from '@angular/core'
import { Firestore, collection, doc, getDoc, query, where, orderBy, getDocs } from '@angular/fire/firestore'
import { GlobalService } from '../global.service'
import { Router, ActivatedRoute } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component'

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  samplesRef: any
  samplesQuery: any
  samples: any
  kitsRef: any
  kitsQuery: any
  kits: any
  userRef: any
  user: any
  profileUser: any
  allowEdit = false

  constructor(
    public firestore: Firestore = Inject(Firestore),
    public globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.samplesRef = collection(this.firestore, 'samples')
    this.kitsRef = collection(this.firestore, 'kits')
    this.samplesQuery = []
    this.kitsQuery = []
  }

  ngOnInit() {
    this.globalService.user.subscribe((u) => {
      this.user = u
    })

    this.route.queryParams.subscribe((queryParams: any) => {
      if (queryParams.profile) {
        const usersRef = collection(this.firestore, 'users')
        const userDoc = doc(usersRef, queryParams.profile)
        
        this.userRef = getDoc(userDoc)
        const userData = this.userRef.data()
          userData['id'] = queryParams.profile
          this.profileUser = userData

          if (this.user.uid === this.profileUser.id) {
            this.allowEdit = true
          } else {
            this.allowEdit = false
          }
        this.fetchUserKits()
        this.fetchUserSamples()
      }
    })
  }

  addKitUsers() {
    this.kitsQuery.forEach((kit: { fullUser: any }) => {
      kit.fullUser = this.profileUser
    })
  }

  async fetchUserSamples() {
    const samplesRef = collection(this.firestore, 'samples')
    const samplesQuery = query(samplesRef, where('user', '==', this.userRef), orderBy('updated', 'desc'))
    const samplesData = await getDocs(samplesQuery)

    samplesData.forEach((sample: any) => {
      this.samplesQuery.push(sample.data())
    })
  }

  async fetchUserKits() {
    const kitsRef = collection(this.firestore, 'kits')
    const kitsQuery = query(kitsRef, where('user', '==', this.userRef), orderBy('updated', 'desc'))
    const kitsData = await getDocs(kitsQuery)

    kitsData.forEach((kit: any) => {
      this.kitsQuery.push(kit.data())
    })

    this.addKitUsers()
  }

  closeProfile() {
    this.router.navigate([location.pathname.split('?')[0]], { queryParams: { module: null } })
  }

  openEditProfileDialog() {
    this.dialog.open(EditProfileDialogComponent, {
        width: '350px',
        data: this.profileUser
    })
  }
}

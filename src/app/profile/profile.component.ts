import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalService } from '../global.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  samplesRef: any;
  samplesQuery: any;
  samples: any;
  kitsRef: any;
  kitsQuery: any;
  kits: any;
  userRef: any;
  user: any;
  profileUser: any;
  allowEdit = false;

  constructor(
    public db: AngularFirestore,
    public globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.samplesRef = this.db.collection<any[]>('samples');
    this.kitsRef = this.db.collection<any[]>('kits');
    this.samplesQuery = [];
    this.kitsQuery = [];
  }

  ngOnInit() {
    this.globalService.user.subscribe((u) => {
      this.user = u;
    });

    this.route.queryParams.subscribe((queryParams: any) => {
      if (queryParams.profile) {
        const userDoc = this.db.collection('users').doc(queryParams.profile);
        this.userRef = userDoc.ref;
        userDoc.valueChanges().subscribe((u) => {
          u['id'] = queryParams.profile;
          this.profileUser = u;

          if (this.user.uid === this.profileUser.id) {
            this.allowEdit = true;
          } else {
            this.allowEdit = false;
          }
        });
        this.fetchUserKits();
        this.fetchUserSamples();
      }
    });
  }

  addKitUsers() {
    this.kitsQuery.forEach((kit) => {
      kit.fullUser = this.profileUser;
    });
  }

  fetchUserSamples() {
    this.db
      .collection('samples', ref => ref
        .where('user', '==', this.userRef)
        .orderBy('updated', 'desc'))
      .valueChanges()
      .subscribe((samples: any) => {
        this.samplesQuery = samples;
      });
  }

  fetchUserKits() {
    this.db
      .collection('kits', ref => ref
        .where('user', '==', this.userRef)
        .orderBy('updated', 'desc'))
      .valueChanges()
      .subscribe((kits: any) => {
        this.kitsQuery = kits;
        this.addKitUsers();
      });
  }

  closeProfile() {
    this.router.navigate([location.pathname.split('?')[0]], { queryParams: { module: null } });
  }

  openEditProfileDialog() {
    this.dialog.open(EditProfileDialogComponent, {
        width: '350px',
        data: this.profileUser
    });
  }
}

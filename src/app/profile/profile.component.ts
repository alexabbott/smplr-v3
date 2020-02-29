import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalService } from '../global.service';
import { Router } from '@angular/router';

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

  constructor(
    public db: AngularFirestore,
    public globalService: GlobalService,
    private router: Router
  ) {
    this.samplesRef = this.db.collection<any[]>('samples');
    this.kitsRef = this.db.collection<any[]>('kits');
    this.samplesQuery = [];
    this.kitsQuery = [];
    this.globalService.userRef.subscribe((ref) => {
      if (ref) {
        this.userRef = ref;
        this.fetchUserKits();
        this.fetchUserSamples();
      }
    });
  }

  ngOnInit() { }

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
      });
  }

  closeProfile() {
    this.router.navigate([location.pathname.split('?')[0]], { queryParams: { module: null } });
  }
}

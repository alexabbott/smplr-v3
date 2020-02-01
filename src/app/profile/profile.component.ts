import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
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
  user: string;

  constructor(
    public db: AngularFirestore,
    public globalService: GlobalService,
    private router: Router
  ) {
    this.samplesRef = this.db.collection<any[]>('samples');
    this.kitsRef = this.db.collection<any[]>('kits');
    this.samplesQuery = [];
    this.kitsQuery = [];
    this.globalService.user.subscribe((u) => {
      this.user = u;
      this.fetchUserSamples(u);
      this.fetchUserKits(u);
    });
  }

  ngOnInit() {

  }

  fetchUserSamples(user) {
    this.db.collection('users/' + user + '/samples').valueChanges().subscribe((samps: any) => {
      for (let i = 0; i < samps.length; i++) {
        this.db.doc(samps[i].sample.path).valueChanges().subscribe((s) => {
          this.samplesQuery.push(s);
        });
      }
    });
  }

  fetchUserKits(user) {
    this.db.collection('users/' + user + '/kits').valueChanges().subscribe((kits: any) => {
      for (let i = 0; i < kits.length; i++) {
        this.db.doc(kits[i].kit.path).valueChanges().subscribe((k) => {
          this.kitsQuery.push(k);
        });
      }
    });
  }

  closeProfile() {
    this.router.navigate([location.pathname.split('?')[0]], { queryParams: { module: null } });
  }

}

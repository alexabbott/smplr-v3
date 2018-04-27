import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
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
    this.globalService.user.subscribe((u) => {
      this.user = u;
      this.db.collection('users/' + u + '/samples').valueChanges().subscribe((samps:any) => {
        for (let i = 0; i < samps.length; i++) {
          this.db.doc(samps[i].sample.path).valueChanges().subscribe((s) => {
            this.samplesQuery.push(s);
          });
        }
      });
    });
  }

  ngOnInit() {

  }

  closeProfile() {
    this.router.navigate([location.pathname.split('?')[0]], { queryParams: { module: null } });
  }

}

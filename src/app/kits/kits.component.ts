import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { GlobalService } from '../global.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'kits',
  templateUrl: './kits.component.html',
  styleUrls: ['./kits.component.scss'],
})
export class KitsComponent implements OnInit {
  kits: any;
  search: string;
  initialResults = [];
  modelChanged: Subject<string> = new Subject<string>();
  user: string;
  sort = 'updated';

  constructor(
    public db: AngularFirestore,
    public globalService: GlobalService,
  ) {
    this.modelChange();
    this.globalService.userId.subscribe((u) => this.user = u);
  }

  ngOnInit() {
    this.initialSearch();
  }

  modelChange() {
    this.modelChanged
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe(search => {
        if (search && search !== '') {
          this.searchKits(search);
        } else {
          this.kits = this.initialResults;
        }
      });
  }

  initialSearch() {
    this.db
      .collection('kits', ref => ref.orderBy(this.sort, 'desc').limit(20))
      .snapshotChanges()
      .subscribe((response: any) => {
        this.kits = this.transformedData(response);
        this.addKitUsers();
        this.initialResults = this.kits;
      });
  }

  searchChanged(text: string) {
    this.modelChanged.next(text);
  }

  searchKits(search: string) {
    this.db
      .collection('kits', ref => ref
        .where('tags', 'array-contains-any', search.split(' '))
        .orderBy(this.sort, 'desc')
        .limit(20))
      .snapshotChanges()
      .subscribe((response: any) => {
        this.kits = this.transformedData(response);
        this.addKitUsers();
      });
  }

  addKitUsers() {
    this.kits.forEach((kit, index) => {
      this.db.collection<any[]>('users').doc(kit.user.id).valueChanges().subscribe((u) => {
        if (this.kits[index]) {
          this.kits[index].fullUser = u;
        }
      });
    });
  }

  transformedData(kits) {
    const newKits = [];
    kits.forEach((kit) => {
      const newKit = kit.payload.doc.data();
      newKit.id = kit.payload.doc.id;
      newKits.push(newKit);
    });
    return newKits;
  }

  sortKits(attribute: string) {
    this.sort = attribute;
    if (!this.search || this.search === '') {
      this.initialSearch();
    } else {
      if (this.search && this.search !== '') {
        this.searchKits(this.search);
      } else {
        this.kits = this.initialResults;
      }
    }
  }
}

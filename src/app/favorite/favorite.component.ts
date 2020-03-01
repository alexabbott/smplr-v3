import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '../global.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Component({
  selector: 'favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit {
  user: string;
  favorites = {};
  @Input() id: string;
  @Input() collection: string;
  @Input() favoritesCount: number;
  @Input() disabledFavorite: boolean;

  constructor(
    public globalService: GlobalService,
    public db: AngularFirestore,
  ) { }

  ngOnInit() {
    this.globalService.user.subscribe((u) => this.user = u);
    this.globalService[`favorite${this.globalService.capitalize(this.collection)}`].subscribe((favorites) => { this.favorites = favorites; });
  }

  toggleFavorite(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.favorites[this.id]) {
      this.removeUserFavorite();
      this.removeCollectionFavorite();
    } else {
      this.saveUserFavorite();
      this.saveCollectionFavorite();
    }
  }

  saveUserFavorite() {
    this.db
      .collection(`user-favorite-${this.collection}`)
      .doc(this.user)
      .collection('favorites')
      .doc(this.id)
      .ref
      .set({ [this.id]: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true })
      .then((resp) => {
        console.log(`${this.id} added`, resp);
      });
  }

  removeUserFavorite() {
    this.db
      .collection(`user-favorite-${this.collection}`)
      .doc(this.user)
      .collection('favorites')
      .doc(this.id)
      .delete()
      .then((resp) => {
        console.log(`${this.id} removed`, resp);
      });
  }

  saveCollectionFavorite() {
    this.db
      .collection(`${this.collection}-favorite-user`)
      .doc(this.id)
      .collection('favorites')
      .ref
      .doc(this.user)
      .set({ [this.user]: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true })
      .then((resp) => {
        console.log(`${this.user} added`, resp);
      });
  }

  removeCollectionFavorite() {
    this.db
      .collection(`${this.collection}-favorite-user`)
      .doc(this.id)
      .collection('favorites')
      .doc(this.user)
      .delete()
      .then((resp) => {
        console.log(`${this.user} removed`, resp);
      });
  }
}

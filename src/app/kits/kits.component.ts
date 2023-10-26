import { Component, OnInit, inject } from '@angular/core'
import { Firestore, collection, limit, query, getDocs, orderBy, where, doc, getDoc } from '@angular/fire/firestore'
import { Subject } from 'rxjs'
import { GlobalService } from '../global.service'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: 'kits',
  templateUrl: './kits.component.html',
  styleUrls: ['./kits.component.scss'],
})
export class KitsComponent implements OnInit {
  kits: any
  search!: string
  initialResults = []
  modelChanged: Subject<string> = new Subject<string>()
  user!: any
  sort = 'updated'
  resultsLimit = 200
  private firestore: Firestore = inject(Firestore)

  constructor(
    public db: Firestore,
    public globalService: GlobalService,
  ) {
    this.modelChange()
    this.globalService.userId.subscribe((u) => this.user = u)
  }

  ngOnInit() {
    this.initialSearch()
  }

  modelChange() {
    this.modelChanged
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe(search => {
        if (search && search !== '') {
          this.searchKits(search)
        } else {
          this.kits = this.initialResults
        }
      })
  }

  async initialSearch() {
    const kitsRef = collection(this.firestore, 'kits')
    const kitsQuery = query(
        kitsRef,
        limit(this.resultsLimit),
        orderBy(this.sort, 'desc')
      )

      const querySnapshot = await getDocs(kitsQuery)
    this.kits = this.transformedData(querySnapshot)
    this.addKitUsers();
    this.initialResults = this.kits
  }

  searchChanged(text: string) {
    this.modelChanged.next(text)
  }

  async searchKits(search: string) {
    const kitsRef = collection(this.firestore, 'kits')
    const kitsQuery = query(
        kitsRef,
        where('tags', 'array-contains-any', search.toLocaleLowerCase().split(' ')),
        limit(this.resultsLimit),
        orderBy(this.sort, 'desc')
      )

      const querySnapshot = await getDocs(kitsQuery)
    this.kits = this.transformedData(querySnapshot)
    this.addKitUsers()
  }

  addKitUsers() {
    this.kits.forEach(async (kit: any, index: any) => {
      const firestoreUser = doc(this.firestore, `users/${kit.user.id}`)
      const userData = await getDoc(firestoreUser)

      if (this.kits[index]) {
        this.kits[index].fullUser = userData.data()
      }
    })
  }

  transformedData(kits: any) {
    const newKits: any[] = []
    kits.forEach((kit: any) => {
      const newKit = kit.data()
      newKit.id = kit.id
      newKits.push(newKit)
    })
    return newKits
  }

  sortKits(attribute: string) {
    this.sort = attribute
    if (!this.search || this.search === '') {
      this.initialSearch()
    } else {
      if (this.search && this.search !== '') {
        this.searchKits(this.search)
      } else {
        this.kits = this.initialResults
      }
    }
  }
}

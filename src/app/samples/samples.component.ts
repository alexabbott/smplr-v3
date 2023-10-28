import { Component, OnInit, inject } from '@angular/core'
import { Firestore, collection, query, limit, orderBy, where, getDocs } from '@angular/fire/firestore'
import { GlobalService } from '../global.service'
import { AudioService } from '../audio.service'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { SaveSampleDialogComponent } from '../save-sample-dialog/save-sample-dialog.component'
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss'],
})
export class SamplesComponent implements OnInit {
  samples: any
  search!: string
  initialResults!: Array<any>
  modelChanged: Subject<string> = new Subject<string>()
  user!: any
  sort = 'updated'
  context: any
  initialLimit = 20
  resultsLimit = 20
  currentSamples: any
  private firestore: Firestore = inject(Firestore)

  constructor(
    public db: Firestore,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public audioService: AudioService,
  ) {
    this.samples = []
    this.modelChange()
    this.globalService.userId.subscribe((u) => this.user = u)
    this.globalService.currentSamples.subscribe((s) => this.currentSamples = s)
    this.context = this.audioService.context
  }

  ngOnInit() {
    this.initialSearch()
  }

  modelChange() {
    this.modelChanged
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe(search => {
        if (search && search !== '') {
          this.searchSamples(search)
        } else {
          this.resultsLimit = this.initialLimit
          this.samples = this.initialResults
        }
      })
  }

  async initialSearch() {
    const samplesRef = collection(this.firestore, 'samples')
    const samplesQuery = query(
        samplesRef,
        limit(this.resultsLimit),
        orderBy(this.sort, 'desc')
      )

      const querySnapshot = await getDocs(samplesQuery)
    this.samples = this.transformedData(querySnapshot)
    this.initialResults = this.samples
  }

  loadMore() {
    this.resultsLimit += this.resultsLimit
    if (this.search && this.search !== '') {
      this.searchSamples(this.search)
    } else {
      this.initialSearch()
    }
  }

  searchChanged(text: string) {
    this.modelChanged.next(text)
  }

  async searchSamples(search: string) {
      const samplesRef = collection(this.firestore, 'samples')
      const samplesQuery = query(
        samplesRef,
        limit(this.resultsLimit),
        orderBy(this.sort, 'desc'),
        where('tags', 'array-contains-any', search.toLocaleLowerCase().split(' '))
      )
      const querySnapshot = await getDocs(samplesQuery)
      this.samples = this.transformedData(querySnapshot)
  }

  transformedData(query: any) {
    const newSamples: any[] = []
      query.forEach((sample: any) => {
        const newSample = sample.data()
        newSample.id = sample.id
        newSamples.push(newSample)
      });
    return newSamples
  }

  sortSamples(attribute: string) {
    this.sort = attribute
    if (!this.search || this.search === '') {
      this.initialSearch()
    } else {
      if (this.search && this.search !== '') {
        this.searchSamples(this.search)
      } else {
        this.samples = this.initialResults
      }
    }
  }

  openSampleDialog() {
    this.globalService.keyMapEnabled.next(false)
    const dialogRef = this.dialog.open(SaveSampleDialogComponent, {
        width: '350px'
    })

    dialogRef.afterClosed().subscribe(result => {
        this.globalService.keyMapEnabled.next(true)
        console.log('The sample upload dialog was closed')
    })
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AudioService } from './audio.service';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public showSampleUpload = new BehaviorSubject(false);
  public currentSequence = new BehaviorSubject(null);
  public currentSamples = new BehaviorSubject(null);
  public kitName = new BehaviorSubject('');
  public userId = new BehaviorSubject(null);
  public user = new BehaviorSubject(null);
  public userRef = new BehaviorSubject(null);
  public keyMapEnabled = new BehaviorSubject(true);
  public favoriteKits = new BehaviorSubject({});
  public favoriteSamples = new BehaviorSubject({});
  private sidenav!: MatSidenav;

  queryParams: any;

  public keys = [
    '4',
    '5',
    '6',
    '7',
    'e',
    'r',
    't',
    'y',
    's',
    'd',
    'f',
    'g',
    'z',
    'x',
    'c',
    'v',
];

  constructor(
    public router: Router,
    private audioService: AudioService,
  ) { }

  slugify(text: { toString: () => string; }) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  formattedTags(name: string, tagsArray: any[]) {
    const tags: any[] = [];
    tagsArray.forEach((tag: { name: any; }) => {
      tags.push(tag.name);
    });
    const slugArray = name.replace('-', ' ').replace('_', ' ').split(' ').map((item: any) => this.slugify(item));
    return [...new Set(tags.concat(slugArray))];
  }

  formattedChips(tags: any[]) {
    return tags.map((tag: any) => { return { name: tag } });
  }

  capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  playSample(event: { target: any; }) {
    this.audioService.resumeContext();
    const target = event.target;
    if (target.querySelector('.audio')) {
      target.querySelector('.audio').play();
      target.classList.add('active');
    }
  }

  stopSample(event: { target: any; }) {
    const target = event.target;
    if (target.querySelector('.audio')) {
      const audio = target.querySelector('.audio');
      audio.pause();
      audio.currentTime = 0;
      target.classList.remove('active');
    }
  }

  softStopSample(event: { target: any; }) {
    const target = event.target;
    if (target.querySelector('.audio')) {
      target.classList.remove('active');
    }
  }

  updateParams(key: string | number, value: { uid: any; } | null) {
    let query = {
      queryParams: { ...this.queryParams }
    };
    if (value) {
      query.queryParams[key] = typeof value === 'object' && value !== null ? value.uid : value;
    } else {
      query.queryParams[key] = null;
    }
    this.router.navigate([location.pathname], query);
  }

  create2DArray(rows: number) {
    const arr = [];
    for (var i = 0; i < rows; i++) {
      arr[i] = [];
    }
    return arr;
  }

  setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  openSidenav() {
      return this.sidenav.open();
  }

  closeSidenav() {
      return this.sidenav.close();
  }
}

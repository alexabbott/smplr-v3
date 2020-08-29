import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AudioService } from './audio.service';

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

  slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  formattedTags(name, tagsArray) {
    const tags = [];
    tagsArray.forEach((tag) => {
      tags.push(tag.name);
    });
    const slugArray = name.replace('-', ' ').replace('_', ' ').split(' ').map(item => this.slugify(item));
    return [...new Set(tags.concat(slugArray))];
  }

  formattedChips(tags) {
    return tags.map((tag) => { return { name: tag } });
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  playSample(event) {
    this.audioService.resumeContext();
    const target = event.target;
    if (target.querySelector('.audio')) {
      target.querySelector('.audio').play();
      target.classList.add('active');
    }
  }

  stopSample(event) {
    const target = event.target;
    if (target.querySelector('.audio')) {
      const audio = target.querySelector('.audio');
      audio.pause();
      audio.currentTime = 0;
      target.classList.remove('active');
    }
  }

  softStopSample(event) {
    const target = event.target;
    if (target.querySelector('.audio')) {
      target.classList.remove('active');
    }
  }

  updateParams(key, value) {
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

  create2DArray(rows) {
    const arr = [];
    for (var i = 0; i < rows; i++) {
      arr[i] = [];
    }
    return arr;
  }
}

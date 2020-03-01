import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public showSampleUpload = new BehaviorSubject(false);
  public currentSequence = new BehaviorSubject(null);
  public currentSamples = new BehaviorSubject(null);
  public kitName = new BehaviorSubject('');
  public user = new BehaviorSubject(null);
  public userRef = new BehaviorSubject(null);
  public keyMapEnabled = new BehaviorSubject(true);
  public favoriteKits = new BehaviorSubject({});
  public favoriteSamples = new BehaviorSubject({});
  queryParams: any;

  constructor(
    public router: Router,
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
    const slugArray = name.split(' ').map(item => this.slugify(item));
    return [...new Set(tags.concat(slugArray))];
  }

  formattedChips(tags) {
    return tags.map((tag) => { return { name: tag } });
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  playSample(event) {
    event.target.querySelector('.audio').play();
  }

  stopSample(event) {
    event.target.querySelector('.audio').pause();
    event.target.querySelector('.audio').currentTime = 0;
  }

  updateParams(key, value) {
    let query = {
      queryParams: { ...this.queryParams }
    };
    if (value) {
      query.queryParams[key] = value;
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

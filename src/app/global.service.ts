import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class GlobalService {
  public showSampleUpload = new BehaviorSubject(false);
  public currentSamples = new BehaviorSubject(null);
  public user = new BehaviorSubject(null);

  constructor() {}

  slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  playSample(event) {
    event.target.firstElementChild.play();
  }

  stopSample(event) {
    event.target.firstElementChild.pause();
    event.target.firstElementChild.currentTime = 0;
  }

}

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Injectable()
export class GlobalService {
  public showSampleUpload = new BehaviorSubject(false);
  public currentSamples = new BehaviorSubject(null);
  public user = new BehaviorSubject(null);
  public keyMapEnabled = new BehaviorSubject(true);
  queryParams: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router
  ) {}

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

}

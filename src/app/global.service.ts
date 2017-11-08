import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class GlobalService {
  public showSampleUpload = new BehaviorSubject(false);
  public currentSamples = new BehaviorSubject(null);

  constructor() {}

}

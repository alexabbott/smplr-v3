import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class GlobalService {
  public movedSample = new BehaviorSubject(null);

  constructor() {}

}

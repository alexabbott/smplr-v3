import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  public context = new AudioContext();
  public gainNodes = new BehaviorSubject({
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
    8: {},
    9: {},
    10: {},
    11: {},
    12: {},
    13: {},
    14: {},
    15: {},
    16: {},
  });

  constructor() {}

  resumeContext() {
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }
}
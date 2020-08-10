import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  public context = new AudioContext();

  constructor() { }

  resumeContext() {
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }
}

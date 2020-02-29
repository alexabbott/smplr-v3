import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SequencerService {
  public sequence = new BehaviorSubject([]);

  constructor() { }

}

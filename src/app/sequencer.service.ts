import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SequencerService {
  public sequence = new BehaviorSubject([]);

  constructor() { }

  buildSequenceObject(sequence: any) {
    const sequenceObject: any = {};
    sequence.forEach((step: any, index: any) => {
      sequenceObject[index] = step;
    });
    return sequenceObject;
  }

}

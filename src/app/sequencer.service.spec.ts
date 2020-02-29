import { TestBed } from '@angular/core/testing';

import { SequencerService } from './sequencer.service';

describe('SequencerService', () => {
  let service: SequencerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SequencerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

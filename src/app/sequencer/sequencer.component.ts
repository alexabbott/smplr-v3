import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit {
  steps: Array<Array<any>>
  interval: number;
  intervalRef;
  currentStep: number;
  samples: Array<any>;
  stepLimit: number;

  constructor(
    public globalService: GlobalService,
  ) {
    this.stepLimit = 16;
    this.steps = this.create2DArray(this.stepLimit);
    this.interval = 300;
    this.currentStep = 0;
  }

  ngOnInit() {
    this.globalService.currentSamples.subscribe((samples) => {
      this.samples = samples;
    });
  }

  toggleStepSample(step, sample) {
    if (this.steps[step].includes(sample)) {
      this.steps[step].splice(this.steps[step].indexOf(sample), 1);
    } else {
      this.steps[step].push(sample);
    }
  }

  create2DArray(rows) {
    const arr = [];
    for (var i = 0; i < rows; i++) {
      arr[i] = [];
    }
    return arr;
  }

  playSample(sample) {
    const index = this.samples.indexOf(sample);
    const audio = <HTMLAudioElement>document.getElementById('sampler' + (index + 1));
    audio.play();
    audio.onended = () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }

  play() {
    this.intervalRef = setInterval(() => {
      const stepSamples = this.steps[this.currentStep];
      stepSamples.forEach((sample) => {
        this.playSample(sample);
      });
      if (this.currentStep === this.stepLimit - 1) {
        this.currentStep = 0;
      } else {
        this.currentStep += 1;
      }
    }, this.interval);
  }

  stop() {
    clearInterval(this.intervalRef);
  }
}

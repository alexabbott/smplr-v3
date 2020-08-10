import { Component, OnInit } from '@angular/core';
import { SequencerService } from '../sequencer.service';
import { GlobalService } from '../global.service';
import { AudioService } from '../audio.service';

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit {
  steps: Array<Array<any>>
  bpm: number;
  intervalRef;
  currentStep: number;
  samples: Array<any>;
  stepLimit: number;
  playing: boolean;

  constructor(
    public globalService: GlobalService,
    public sequencerService: SequencerService,
    public audioService: AudioService,
  ) {
    this.stepLimit = 32;
    this.steps = this.globalService.create2DArray(this.stepLimit);
    this.bpm = 100;
    this.currentStep = 0;
  }

  ngOnInit() {
    this.globalService.currentSamples.subscribe((samples) => {
      this.samples = samples;
    });
    this.globalService.currentSequence.subscribe((sequence) => {
      if (sequence) {
        const keys = Object.keys(sequence);
        for (let i = 0; i < keys.length; i++) {
          this.steps[i] = sequence[keys[i]];
        }
      }
    });
  }

  toggleStepSample(sampleIndex, stepIndex) {
    if (this.steps[stepIndex].includes(sampleIndex)) {
      this.steps[stepIndex].splice(this.steps[stepIndex].indexOf(sampleIndex), 1);
    } else {
      this.steps[stepIndex].push(sampleIndex);
    }
    this.sequencerService.sequence.next(this.steps);
  }

  playSample(index) {
    this.audioService.resumeContext();
    const audio = <HTMLAudioElement>document.getElementById('sampler' + (index + 1));
    audio.pause();
    audio.currentTime = 0;
    audio.play();

    audio.onended = () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }

  play() {
    this.currentStep = 0;
    this.playing = true;
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
    }, this.bpm * 1.5);
  }

  stop() {
    this.playing = false;
    this.currentStep = 0;
    clearInterval(this.intervalRef);
  }
}

import { Component, OnInit, HostListener } from '@angular/core'
import { Router } from '@angular/router'
import { SequencerService } from '../sequencer.service'
import { GlobalService } from '../global.service'
import { AudioService } from '../audio.service'

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit {
  steps!: any
  bpm: number
  intervalRef: string | number | NodeJS.Timeout | undefined
  currentStep: number
  samples!: any
  stepLimit!: number
  playing!: boolean
  sampleOrder: any = {
    1: 4,
    2: 3,
    3: 2,
    4: 1,
    5: 8,
    6: 7,
    7: 6,
    8: 5,
    9: 12,
    10: 11,
    11: 10,
    12: 9,
    13: 16,
    14: 15,
    15: 14,
    16: 13,
  }

  constructor(
    public globalService: GlobalService,
    public sequencerService: SequencerService,
    public audioService: AudioService,
    private router: Router,
  ) {
    this.setSteps(32)
    this.bpm = 120
    this.currentStep = 0

    router.events.subscribe((val) => {
      this.stop()
    })
  }

  ngOnInit() {
    this.globalService.currentSamples.subscribe((samples) => {
      this.samples = samples
    })
    this.globalService.currentSequence.subscribe((sequence) => {
      if (sequence) {
        const keys = Object.keys(sequence)
        // if (keys.length === 64) this.setSteps(64)
        for (let i = 0; i < this.stepLimit; i++) {
          this.steps[i] = sequence[keys[i]]
        }
      }
    })
  }

  setSteps(limit: number) {
    this.stepLimit = limit
    this.steps = this.globalService.create2DArray(this.stepLimit)
  }

  @HostListener('document:keydown', ['$event'])
    keydown(e: KeyboardEvent) {
      if (e.key === ' ') {
        this.audioService.resumeContext()

        if (this.playing) {
          this.stop()
        } else {
          this.play()
        }
      }
    }

  toggleStepSample(sampleIndex: any, stepIndex: string | number) {
    if (this.steps[stepIndex].includes(sampleIndex)) {
      this.steps[stepIndex].splice(this.steps[stepIndex].indexOf(sampleIndex), 1)
    } else {
      this.steps[stepIndex].push(sampleIndex)
    }
    this.sequencerService.sequence.next(this.steps)
  }

  playSample(index: number) {
    this.audioService.resumeContext()
    const audio = <HTMLAudioElement>document.getElementById('sampler' + (index + 1))
    audio.pause()
    audio.currentTime = 0
    audio.play()

    audio.onended = () => {
      audio.pause()
      audio.currentTime = 0
    }
  }

  play() {
    this.currentStep = 0
    this.playing = true
    this.intervalRef = setInterval(() => {
      const stepSamples = this.steps[this.currentStep]
      stepSamples.forEach((sample: any) => {
        this.playSample(sample)
      })
      if (this.currentStep === this.stepLimit - 1) {
        this.currentStep = 0
      } else {
        this.currentStep += 1
      }
    }, (60 / (this.bpm * 2)) * 1000)
  }

  stop() {
    this.playing = false
    this.currentStep = 0
    clearInterval(this.intervalRef)
  }

  updateSteps(limit: number) {
    if (limit > this.stepLimit) {
      this.steps = this.steps.concat(this.globalService.create2DArray(limit - this.stepLimit))
    } else {
      this.steps.splice(limit, this.stepLimit)
    }
    this.stepLimit = limit
  }
}

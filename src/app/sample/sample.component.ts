import { Component, AfterViewInit, Input, ViewChild } from '@angular/core'
import { GlobalService } from '../global.service'
import { AudioService } from '../audio.service'
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements AfterViewInit {
  gainNodes: any
  gainNode: any
  gainValue = 1
  @Input() sample: any
  @Input() index!: number
  @Input() component!: string
  @Input() active!: boolean
  @Input() showFavorite!: boolean
  @Input() showKeys!: boolean
  @ViewChild('audio') audio: any
  @ViewChild('gain') gain: any
  keys: Array<string>
  kitSamples: any

  constructor(private globalService: GlobalService, private audioService: AudioService) {
    this.keys = this.globalService.keys
    this.audioService.gainNodes.subscribe((nodes) => {
      this.gainNodes = nodes
    })

    this.globalService.currentSamples.subscribe((samples) => {
      this.kitSamples = samples
    })
  }

  ngAfterViewInit() {
    const audioElement = this.audio.nativeElement
    const context = this.audioService.context
    if (audioElement.src) {      
      audioElement.crossOrigin = 'anonymous'
      const audioSource = new MediaElementAudioSourceNode(context, {
        mediaElement: audioElement,
      })

      if (this.showKeys) {
        this.gainNode = context.createGain()
        this.audioService.gainNodes.next({...this.gainNodes, [this.index]: this.gainNode})
        audioSource.connect(this.gainNode)
        this.gainNode.connect(context.destination)
      } else {
        audioSource.connect(context.destination)
      }

      this.audioService.resumeContext()
    }
  }

  changeGain() {
    this.gainNode.gain.value = this.gainValue
  }

  replaceSample($event: any, sample: any) {
    console.log('$event', $event.event.target.firstChild.id.split('sampler')[1] - 1)
    console.log('s', sample)
    const target = $event.event.target
    if (target) {
      const index = target.firstChild.id.split('sampler')[1] - 1
      console.log('index', index)
      this.kitSamples.splice(index, 1, sample)
      this.globalService.currentSamples.next(this.kitSamples)
    }
  }
}

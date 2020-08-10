import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';
import { GlobalService } from '../global.service';
import { AudioService } from '../audio.service';

@Component({
  selector: 'sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements AfterViewInit {

  @Input() sample: any;
  @Input() index: number;
  @Input() component: string;
  @Input() active: boolean;
  @Input() showFavorite: boolean;
  @Input() showKeys: boolean;
  @ViewChild('audio') audio; 
  keys: Array<string>

  constructor(private globalService: GlobalService, private audioService: AudioService) {
    this.keys = this.globalService.keys;
  }

  ngAfterViewInit() {
    const audioElement = this.audio.nativeElement;
    const context = this.audioService.context;
    if (audioElement.src) {
      audioElement.crossOrigin = 'anonymous';
      const audioSource = new MediaElementAudioSourceNode(context, {
        mediaElement: audioElement,
      });
      audioSource.connect(context.destination);
      this.audioService.resumeContext();
    }
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {

  @Input() sample: any;
  @Input() index: number;
  @Input() component: string;
  @Input() active: boolean;
  @Input() showFavorite: boolean;
  @Input() showKeys: boolean;
  keys: Array<string>

  constructor(private globalService: GlobalService) {
    this.keys = this.globalService.keys;
  }

  ngOnInit() {
  }
}

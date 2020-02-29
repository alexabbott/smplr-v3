import { Component, OnInit, Input } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }
}

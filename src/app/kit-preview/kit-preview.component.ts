import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'kit-preview',
  templateUrl: './kit-preview.component.html',
  styleUrls: ['./kit-preview.component.scss']
})
export class KitPreviewComponent implements OnInit {
  @Input() kit: any;
  @Input() user: any;

  constructor(private globalService: GlobalService) { }

  ngOnInit(): void {
  }

  openProfile(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.globalService.updateParams('profile', this.kit.user.id);
  }

}

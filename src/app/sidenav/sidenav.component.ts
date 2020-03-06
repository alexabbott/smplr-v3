import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  params: any;
  showProfile: boolean;

  constructor(
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: any) => {
      this.params = queryParams;

      if (this.params.profile) {
        this.showProfile = true;
      } else {
        this.showProfile = false;
      }
    });
  }
}

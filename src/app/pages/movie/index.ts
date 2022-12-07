import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie',
  standalone: true,
  template: `<div>Movie</div>`,
})
export default class AppMovieComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((queryParams: Params) => {
      console.log('queryParams', queryParams);
    });
  }
}

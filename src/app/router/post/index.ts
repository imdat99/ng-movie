import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  template: ` <div>
    Post
    <div *ngIf="$id | async as id">{{ id }}</div>
  </div>`,
})
export default class PostComponent implements OnInit {
  $id = this.activateRoute.paramMap.pipe(map((params) => params.get('id')));
  constructor(private readonly activateRoute: ActivatedRoute) {}

  ngOnInit() {
    // this.$id.pipe(tap(console.log)).subscribe();
  }
}

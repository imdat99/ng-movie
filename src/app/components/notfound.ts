import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-notfound',
  template: `<div>Trang không tồn tại</div>`,
})
export default class NotFoundComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

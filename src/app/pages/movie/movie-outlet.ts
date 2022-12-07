import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  standalone: true,
  template: '<router-outlet></router-outlet>',
})
export default class MovieOutletComponent {}

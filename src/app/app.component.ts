import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer';
import AppHeader from './components/header';

@Component({
  selector: 'my-app',
  standalone: true,
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  imports: [FooterComponent, RouterOutlet, AppHeader],
})
export class AppComponent {}

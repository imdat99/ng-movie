import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer';
import AppHeader from './components/header';
@Component({
  selector: 'my-app',
  standalone: true,
  template: `
    <app-header></app-header>
    <div class="content-container">
      <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>
  `,
  imports: [FooterComponent, RouterOutlet, AppHeader],
  styles: [
    `
      .content-container {
        min-height: calc(100vh - 248px);
        padding-top: 58px;
        display: block;
      }
    `,
  ],
})
export class AppComponent {}

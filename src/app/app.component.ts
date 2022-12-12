import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './app.animation';
import { FooterComponent } from './components/footer';
import AppHeader from './components/header';
@Component({
  selector: 'my-app',
  standalone: true,
  animations: [slideInAnimation],
  template: `
    <app-header></app-header>
    <section
      class="content-container"
      [@slideInAnimation]="o.isActivated ? o.activatedRoute : ''"
    >
      <router-outlet #o="outlet"></router-outlet>
    </section>
    <app-footer></app-footer>
  `,
  imports: [FooterComponent, RouterOutlet, AppHeader],
  styles: [
    `
      .content-container {
        /* min-height: calc(100vh - 248px); */
        min-height: 100vh;
        padding-top: 58px;
        display: block;
      }
    `,
  ],
})
export class AppComponent {}

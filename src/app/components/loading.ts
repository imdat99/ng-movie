import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [NgFor],
  template: ` <div class="loading-screen">
    <div class="loader">
      <div class="loader-inner" data-loading="Đang tải...">
        <div class="ball-spin-fade-loader">
          <div *ngFor="let item of [].constructor(4)" class="loader-item"></div>
        </div>
      </div>
    </div>
  </div>`,
})
export default class LoadingComponent {}

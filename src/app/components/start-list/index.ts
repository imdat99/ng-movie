import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { EncodeURIPipe, QueryParamsPipe, SlugPipe } from '@app/pipes';
import { ImgLazyComponent } from '../lazy-img';

@Component({
  selector: 'movie-stars',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    EncodeURIPipe,
    RouterLinkWithHref,
    SlugPipe,
    QueryParamsPipe,
  ],
  template: `
    <div #imgContainer class="star-container">
      <div class="d-flex h5 my-2 pb-2 border-bottom justify-content-between">
        <b>{{ startData?.homeSectionName }}</b>
        <div class="btn-control">
          <button type="button">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button type="button">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <div class="star-list">
        <div class="star-container">
          <ng-container *ngFor="let item of startData?.recommendContentVOList">
            <a [routerLink]="['/album']" [queryParams]="item | queryParams">
              <div class="star-inner">
                <div class="star-img">
                  <img
                    src="/110.png"
                    alt=""
                    loading="lazy"
                    [attr.lazy-src]="
                      item.cover ||
                        item.imageUrl ||
                        item?.coverHorizontalUrl ||
                        item?.image ||
                        '/110.png' | encodeURI
                    "
                  />
                </div>
                <span class="star-name" *ngIf="item.title || item.localName">
                  {{ item.title || item.localName || '' }}
                </span>
              </div>
            </a>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./style.scss'],
})
export default class MovieStarsComponent extends ImgLazyComponent {
  @Input() startData: any;
}

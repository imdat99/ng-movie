import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { EncodeURIPipe, QueryParamsPipe, SlugPipe } from '@app/pipes';
import { ImgLazyComponent } from '../lazy-img';

@Component({
  standalone: true,
  imports: [
    NgFor,
    EncodeURIPipe,
    RouterLinkWithHref,
    SlugPipe,
    QueryParamsPipe,
  ],
  selector: 'movie-list',
  styleUrls: ['./style.scss'],
  template: `
    <div class="movie-list" #imgContainer>
      <div class="row">
        <ng-container *ngFor="let item of movieDatas">
          <div class="col-6 col-xs-6 col-sm-6 col-md-4 col-lg-4 col-xl.20">
            <a
              [queryParams]="item | queryParams"
              [routerLink]="['/movie', item | slug]"
            >
              <div class="poster-container">
                <div class="poster-img">
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
                <span class="poster-name">
                  {{ item.title || item?.name || 'unknown' }}
                </span>
              </div>
            </a>
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
export default class MovieListComponent extends ImgLazyComponent {
  @Input() movieDatas: any;
  constructor() {
    super();
  }
}

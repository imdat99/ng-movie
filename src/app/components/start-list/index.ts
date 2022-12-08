import { NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
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
          <button type="button" #prevBtn>
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button type="button" #nextBtn>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <div class="star-list">
        <div class="star-container" #starContainer>
          <ng-container *ngFor="let item of startData?.recommendContentVOList">
            <div class="star-content">
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
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./style.scss'],
})
export default class MovieStarsComponent
  extends ImgLazyComponent
  implements AfterViewInit
{
  @Input() startData: any;
  @ViewChild('prevBtn') prevBtn!: ElementRef;
  @ViewChild('nextBtn') nextBtn!: ElementRef;
  @ViewChild('starContainer') starContainer!: ElementRef;
  ngAfterViewInit(): void {
    this.appCarousel();
  }

  appCarousel() {
    const product = this.starContainer.nativeElement.querySelectorAll(
      '.star-content'
    ) as NodeListOf<HTMLElement>;
    let product_page = Math.ceil(product.length / 4);
    let l = 0;
    let movePer = 25;
    let isInView = false;
    // mobile_view
    const isInViewport = () => {
      const rect = product[product.length - 1].getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight ||
            this.starContainer.nativeElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || this.starContainer.nativeElement.clientWidth)
      );
    };
    const right_mover = () => {
      if (!isInView) {
        l = l + movePer;
        if (product.length == 1) {
          l = 0;
        }
        for (const i of product as any) {
          (i as any).style.left = '-' + l + '%';
        }
      }
    };
    const left_mover = () => {
      l = l - movePer;
      if (l <= 0) {
        l = 0;
      }
      for (const i of product as any) {
        if (product_page > 1) {
          (i as any).style.left = '-' + l + '%';
        }
      }
    };
    this.nextBtn.nativeElement.onclick = () => {
      isInView = isInViewport();
      right_mover();
    };
    this.prevBtn.nativeElement.onclick = () => {
      left_mover();
      isInView = isInViewport();
    };
  }
}

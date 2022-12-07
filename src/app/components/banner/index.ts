import { NgFor } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { EncodeURIPipe } from '@app/pipes';

@Component({
  selector: 'app-banner',
  imports: [NgFor, EncodeURIPipe],
  standalone: true,
  template: `
    <div class="carousel-content">
      <div class="carousel slide" #carouselSlide>
        <div class="carousel-inner">
          <div
            class="carousel-item fade-in"
            *ngFor="let item of bannerData?.recommendContentVOList"
          >
            <a href="/">
              <div>
                <div class="banner-img position-relative">
                  <img
                    [src]="item?.imageUrl || '' | encodeURI"
                    class="position-absolute"
                    alt="..."
                  />
                </div>
                <div class="carousel-caption d-none d-md-block ">
                  <h5 class="h4">{{ item?.title }}</h5>
                  <p>
                    Some representative placeholder content for the first slide.
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
        <button class="carousel-control-prev" type="button">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./style.scss'],
})
export default class BannerComponent implements AfterViewInit, OnDestroy {
  @Input() bannerData: any;
  @ViewChild('carouselSlide') carouselSlide!: ElementRef;

  ngAfterViewInit(): void {
    this.appCarousel('init');
  }
  ngOnDestroy(): void {
    this.appCarousel('');
  }

  appCarousel(type: string) {
    const carousel =
      this.carouselSlide.nativeElement.querySelector('.carousel-inner');
    const carouselChildNodes = carousel.querySelectorAll('.carousel-item');
    let lastActive = 0;
    const activeItem = (index: number) => {
      (carouselChildNodes[lastActive] as HTMLElement).classList.remove(
        'active'
      );
      (carouselChildNodes[index] as HTMLElement).classList.add('active');
      lastActive = index;
    };
    activeItem(0);
    const activeNext = () => {
      if (lastActive == carouselChildNodes.length! - 1) {
        activeItem(0);
      } else {
        activeItem(lastActive + 1);
      }
    };
    this.carouselSlide.nativeElement
      .querySelector('.carousel-control-prev')!
      .addEventListener('click', () => {
        if (lastActive === 0) {
          activeItem(carouselChildNodes.length! - 1);
        } else {
          activeItem(lastActive - 1);
        }
      });
    this.carouselSlide.nativeElement
      .querySelector('.carousel-control-next')!
      .addEventListener('click', activeNext);
    const autoSlide = setInterval(() => {
      activeNext();
    }, 10000);
    if (type !== 'init') {
      clearInterval(autoSlide);
    }
  }
}

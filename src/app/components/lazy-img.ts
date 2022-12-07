import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  template: '',
})
export class ImgLazyComponent implements AfterViewInit {
  @ViewChild('imgContainer') imgContainer!: ElementRef;
  constructor() {
    this.observer = this.observerImg();
  }
  observer: IntersectionObserver;
  ngAfterViewInit(): void {
    this.getLazyImg();
  }
  private loadImg(img: HTMLElement) {
    const url = img.getAttribute('lazy-src');
    if (url) {
      img.setAttribute('src', url);
      img.removeAttribute('lazy-src');
    }
  }

  private observerImg() {
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadImg(entry.target as HTMLElement);
        }
      });
    });
  }

  private getLazyImg(this: any) {
    const lazyImg = this.imgContainer.nativeElement.querySelectorAll(
      '[lazy-src]'
    ) as NodeListOf<HTMLElement>;
    lazyImg.forEach((img) => {
      if ('IntersectionObserver' in window) {
        this.observer.observe(img);
      } else {
        this.loadImg(img as HTMLElement);
      }
    });
  }
}

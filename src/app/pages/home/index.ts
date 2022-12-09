import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import AppBanner from '@app/components/banner';
import MovieListComponent from '@app/components/movie-list';
import MovieStarsComponent from '@app/components/start-list';
import { DestroyService } from '@app/services/destroy-service';
import { BehaviorSubject, finalize, fromEvent, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [DestroyService],
  template: `
    <div class="container my-5" #imgContainer>
      <div class="my-5" *ngFor="let item of pageData">
        <ng-container *ngIf="item.homeSectionType === 'BANNER'">
          <app-banner [bannerData]="item"></app-banner>
        </ng-container>
        <ng-container *ngIf="item.homeSectionType === 'BLOCK_GROUP'">
          <movie-stars [startData]="item"></movie-stars>
        </ng-container>
        <ng-container
          *ngIf="
            item.homeSectionType !== 'BANNER' &&
            item.homeSectionType !== 'BLOCK_GROUP'
          "
        >
          <div class="my-5">
            <b class="d-block h5 my-2 pb-2 border-bottom">
              {{ item?.homeSectionName }}
            </b>
            <movie-list
              [movieDatas]="item?.recommendContentVOList"
            ></movie-list>
          </div>
        </ng-container>
      </div>

      <div *ngIf="loading" class="spinner"></div>
      <span *ngIf="isEnd">không còn dữ liệu</span>
    </div>
  `,
  imports: [NgIf, NgFor, AppBanner, MovieStarsComponent, MovieListComponent],
})
export default class HomeComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private $destroy: DestroyService
  ) {
    this.navigationId = this.route.snapshot.data['navigationId'];
  }

  private navigationId: number;
  private $page = new BehaviorSubject(0);
  loading: boolean = false;
  isEnd = false;
  private sectionIds: number[] = [];
  pageData: any[] = [];

  loadData(page: number) {
    this.loading = true;
    this.httpClient
      .get('/homePage/getHome', {
        params: { size: 10, page, navigationId: this.navigationId },
      })
      .pipe(
        map((res) => {
          const { data } = res as any;
          if (data.recommendItems.length) {
            data.recommendItems.forEach((item: any) => {
              if (!this.sectionIds.includes(item.homeSectionId)) {
                this.pageData.push(item);
                this.sectionIds.push(item.homeSectionId);
              }
            });
          } else {
            this.isEnd = true;
          }
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.$page
      .pipe(
        map((page) => this.loadData(page)),
        takeUntil(this.$destroy)
      )
      .subscribe();
    fromEvent(window, 'scroll')
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        const { scrollHeight, clientHeight, scrollTop } =
          document.documentElement;
        if (
          scrollTop + clientHeight > scrollHeight - 250 &&
          !this.isEnd &&
          !this.loading
        ) {
          this.$page.next(this.$page.value + 1);
        }
      });
  }
}

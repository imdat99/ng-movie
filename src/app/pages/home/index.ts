import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import AppBanner from '@app/components/banner';
import MovieListComponent from '@app/components/movie-list';
import MovieStarsComponent from '@app/components/start-list';
import { DestroyService } from '@app/services/destroy-service';
import { takeUntil } from 'rxjs';
import { HomeService } from './service';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [DestroyService],
  template: `
    <div class="container my-5">
      <ng-container *ngIf="$pageData | async as pageData">
        <div class="my-5" *ngFor="let item of pageData.data">
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
        <div *ngIf="pageData.loading" class="spinner"></div>
        <span *ngIf="pageData.isEnd">không còn dữ liệu</span>
      </ng-container>
    </div>
  `,
  imports: [
    NgIf,
    NgFor,
    AppBanner,
    MovieStarsComponent,
    MovieListComponent,
    AsyncPipe,
  ],
})
export default class HomeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private $destroy: DestroyService,
    private homeService: HomeService
  ) {
    this.homeService.setNavigationId(this.route.snapshot.data['navigationId']);
  }
  $pageData = this.homeService.$pageData;

  ngOnInit() {
    window.scrollTo(0, 0);
    this.homeService.scroll().pipe(takeUntil(this.$destroy)).subscribe();
  }
}

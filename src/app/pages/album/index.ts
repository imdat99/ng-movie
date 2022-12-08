import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import MovieListComponent from '@app/components/movie-list';
import { DestroyService } from '@app/services/destroy-service';
import { BehaviorSubject, finalize, fromEvent, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [MovieListComponent, NgIf],
  providers: [DestroyService],
  template: `
    <div class="container my-5">
      <div class="home-content">
        <div class="my-5">
          <strong class="d-block h5 my-2 pb-2 border-bottom">
            {{ resData?.name }}
          </strong>
          <ng-container *ngIf="content.length">
            <movie-list [movieDatas]="content"></movie-list>
          </ng-container>
        </div>
        <div *ngIf="loading" class="spinner"></div>
        <span *ngIf="isEnd">không còn dữ liệu</span>
      </div>
    </div>
  `,
})
export default class AlbumComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private $destroy: DestroyService
  ) {}
  queryParams: any;
  loading = false;
  isEnd = false;
  resData: any;
  content: any[] = [];
  private $page = new BehaviorSubject(0);
  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      // this.loadData(queryParams);
      this.queryParams = queryParams;
    });

    window.scrollTo(0, 0);
    this.$page
      .pipe(
        map((page) => this.loadData({ ...this.queryParams, page })),
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

  private loadData(params: Params) {
    this.loading = true;
    this.httpClient
      .get('/album/detail', {
        params: {
          page: 0,
          size: 10,
          ...params,
        },
      })
      .pipe(
        map((res) => {
          const { data } = res as any;
          if (data.content.length) {
            const { content, ...otherData } = data;
            this.resData = otherData;
            this.content.push(...content);
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
}

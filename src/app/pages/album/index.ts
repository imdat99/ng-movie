import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import MovieListComponent from '@app/components/movie-list';
import { finalize, map } from 'rxjs';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [MovieListComponent, NgIf],
  template: `
    <div class="container my-5">
      <div class="home-content">
        <div class="my-5">
          <strong class="d-block h5 my-2 pb-2 border-bottom">
            {{ resData?.name }}
          </strong>
          <ng-container *ngIf="resData">
            <movie-list [movieDatas]="resData?.content"></movie-list>
          </ng-container>
        </div>
        <div *ngIf="loading" class="spinner"></div>
        <!-- {this.data.isEnd && <span>không còn dữ liệu</span>} -->
      </div>
    </div>
  `,
})
export default class AlbumComponent implements OnInit {
  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {}
  params: any;
  loading = false;
  isEnd = false;
  resData: any;
  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.loadData(queryParams);
    });
  }

  loadData(params: Record<string, any>) {
    this.loading = true;
    this.httpClient
      .get('/album/detail', {
        params: {
          ...params,
          page: 0,
          size: 12,
        },
      })
      .pipe(
        map((res) => {
          const { data } = res as any;
          if (data.content.length) {
            this.resData = data;
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

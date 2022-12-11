import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, RouterLinkWithHref } from '@angular/router';
import { PlayerComponent } from '@app/components/player';
import { QUALITY_TYPE } from '@app/constants';
import Artplayer from 'artplayer';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  finalize,
  forkJoin,
  map,
  of,
  take,
} from 'rxjs';

@Component({
  selector: 'watch-movie',
  standalone: true,
  styleUrls: ['./style.scss'],
  imports: [NgIf, AsyncPipe, NgFor, RouterLinkWithHref, PlayerComponent],
  template: `
    <ng-container *ngIf="resData as data; else spin">
      <ng-container *ngIf="!loading; else spin">
        <app-player [palyerData]="data.playerData"></app-player>
        <section class="section-watch container">
          <div class="text-center">
            Phim load chậm?
            <span (click)="handleLoadCham()"> Xem hướng dẫn </span>
          </div>
          <a
            class="d-block text-center"
            href="https://devratroom.blogspot.com/p/cross-domain-cors-extension.html"
            target="_blank"
          >
            <span class="text-danger"
              >Phim không load được? hãy thử cài Extention Cors</span
            >
          </a>
          <p class="text-center" (click)="handleKhongTieng()">
            Phim không có tiếng / mất tiếng nhân vật / âm thanh bị rè?
            <span> Xem hướng dẫn </span>
          </p>
          <div class="section">
            <div class="container">
              <div class="columns watch-top">
                <div class="column name">
                  <h1>
                    {{ data.name }}
                    <ng-container *ngIf="params['ep']">
                      &nbsp;- Ep.{{ +params['ep'] + 1 }}
                    </ng-container>
                  </h1>
                  <h2>{{ data.aliasName }}</h2>
                  <div class="intro my-3">
                    {{ data.introduction || 'Đang cập nhật...' }}
                  </div>
                  <div>
                    <a
                      [attr.href]="
                        'https://www.facebook.com/sharer/sharer.php?u=' +
                        location.href
                      "
                      class="fb-share-button"
                      target="_blank"
                    >
                      <i class="fa-brands fa-square-facebook"></i>
                      Chia sẻ
                    </a>
                  </div>
                </div>
                <div class="column feature">
                  <ng-container *ngIf="data.episodeVo.length > 1; index">
                    <span class="d-block mb-3">Tập phim</span>
                    <a
                      [routerLink]="['.']"
                      [queryParams]="{
                        id: params['id'],
                        category: params['category'],
                        ep: item.seriesNo - 1
                      }"
                      routerLinkActive="router-link-active"
                      *ngFor="let item of data.episodeVo"
                      type="button"
                      class="btn m-1 disable"
                      [class.btn-success]="
                        (params['ep'] || 0) == item.seriesNo - 1
                      "
                      [class.btn-danger]="
                        (params['ep'] || 0) != item.seriesNo - 1
                      "
                    >
                      {{ item.seriesNo }}
                    </a>
                  </ng-container>
                </div>
              </div>

              <a
                [routerLink]="['/movie', $params | async]"
                [queryParams]="params"
                class="watch-btn"
              >
                <div class="back">
                  <i class="fa-solid fa-backward"></i>
                  <span>Trở về trang giới thiệu phim</span>
                </div>
              </a>
            </div>
          </div>
          <div class="comments-section">
            <h2 class="comments-title">
              <i class="fa-regular fa-comments"></i>
              Bình luận phim
            </h2>
            <form action="comment">
              <textarea
                class="textarea"
                rows="2"
                placeholder="Nhập bình luận... (Phần này không chạy, để cho đẹp :v)"
              ></textarea>
              <button type="button" class="btn btn-outline-secondary">
                Gửi
              </button>
            </form>
          </div>
        </section>
      </ng-container>
    </ng-container>
    <ng-template #spin>
      <div *ngIf="!error; else err" class="spinner"></div>
    </ng-template>
    <ng-template #err>
      <span class="d-block text-center fs-5 text-danger">
        Không có dữ liệu
      </span>
    </ng-template>
  `,
})
export default class WatchmovieComponent implements OnInit {
  location = window.location;
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.params = params;
      this.cdr.detectChanges();
      this.loadData(params);
    });
  }

  loadData(params: Params) {
    this.loading = true;
    this.httpClient
      .get('/movieDrama/get', { params })
      .pipe(
        concatMap(({ data }: any) => {
          const episodeVoData = data.episodeVo[params['ep'] || 0];
          const observables = episodeVoData.definitionList.map((item: any) =>
            this.httpClient.get('/media/previewInfo', {
              params: {
                category: data.category,
                contentId: data.id,
                episodeId: episodeVoData.id,
                definition: item.code,
              },
            })
          );
          observables.unshift(of(data));
          return forkJoin(
            observables,
            (movieData: any, ...quanlityData: any[]) => {
              const mediaList = quanlityData.map(
                ({ data }: any, index: number) => ({
                  default: !index,
                  html: (QUALITY_TYPE as any)[data?.currentDefinition],
                  url: data?.mediaUrl,
                })
              );
              this.loading = false;
              this.resData = {
                ...movieData,
                playerData: {
                  url: mediaList[0].url,
                  poster: encodeURI(movieData.coverHorizontalUrl),
                  subtitle: episodeVoData.subtitlingList,
                  quality: mediaList,
                },
              };
            }
          );
        }),
        catchError((e) => {
          console.log(e);
          this.error = true;
          this.artPlayer?.destroy(true);
          return of(null);
        }),
        take(1)
      )
      .subscribe();
  }
  artPlayer!: Artplayer;
  error = false;
  loading = false;
  resData: any;
  params!: Params;
  $params = this.route.params.pipe(map((e) => e['id']));
  handleLoadCham() {
    window.open(
      `https://www.google.com/search?q=${encodeURI('Phim load chậm')}`
    );
  }
  handleKhongTieng() {
    window.open(
      `https://www.google.com/search?q=${encodeURI(
        'Phim không có tiếng / mất tiếng nhân vật / âm thanh bị rè?'
      )}`
    );
  }
}

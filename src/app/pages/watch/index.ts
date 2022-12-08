import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  AfterContentChecked,
  ViewChild,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, RouterLinkWithHref } from '@angular/router';
import { QUALITY_TYPE } from '@app/constants';
import Artplayer from 'artplayer';
import { catchError, concatMap, forkJoin, map, of, throwError } from 'rxjs';
import playerOptions from './player';

@Component({
  selector: 'watch-movie',
  standalone: true,
  styleUrls: ['./style.scss'],
  imports: [NgIf, AsyncPipe, NgFor, RouterLinkWithHref],
  template: `
    <div class="video">
      <div class="player-container" [style.height]="'300px'" #player></div>
    </div>
    <ng-container *ngIf="resData as data; else loading">
      <section class="section-watch container">
        <div class="text-center">
          Phim không load được? hãy thử
          <span> Reload </span>
        </div>
        <div class="text-center">
          Phim load chậm?
          <span> Xem hướng dẫn </span>
        </div>
        <p class="text-center">
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
                <ng-container *ngIf="data.episodeVo.length; index">
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
            <button type="button" class="btn btn-outline-secondary">Gửi</button>
          </form>
        </div>
      </section>
    </ng-container>
    <ng-template #loading>
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
  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.params = params;
      this.artPlayer?.destroy(false);
      this.loadData(params);
    });
  }
  loadData(params: Params) {
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

              this.artPlayer = playerOptions({
                container: this.player.nativeElement,
                url: mediaList[0].url,
                poster: encodeURI(movieData.coverHorizontalUrl),
                subtitle: episodeVoData.subtitlingList,
                quality: mediaList,
              });
              return movieData;
            }
          );
        }),
        catchError(() => {
          this.error = true;
          this.artPlayer?.destroy(true);
          return of(null);
        })
      )
      .subscribe((res) => {
        this.resData = res;
      });
  }
  @ViewChild('player') player!: ElementRef;
  artPlayer!: Artplayer;
  error = false;
  resData: any;
  params!: Params;
  $params = this.route.params.pipe(map((e) => e['id']));
}

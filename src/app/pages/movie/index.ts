import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  RouterLinkWithHref,
} from "@angular/router";
import MovieListComponent from "@app/components/movie-list";
import MovieStarsComponent from "@app/components/start-list";
import { EncodeURIPipe } from "@app/pipes";
import { DestroyService } from "@app/services/destroy-service";
import { concatMap, filter, map, of, takeUntil, tap } from "rxjs";

@Component({
  selector: "app-movie",
  styleUrls: ["./style.scss"],
  imports: [
    MovieStarsComponent,
    RouterLinkWithHref,
    MovieListComponent,
    EncodeURIPipe,
    AsyncPipe,
    NgFor,
    NgIf,
  ],
  providers: [DestroyService],
  standalone: true,
  template: `
    <ng-container *ngIf="!loading; else spin">
      <div *ngIf="resData[id] as data" class="detail-page fade-in">
        <div
          class="backdrop"
          [style.background-image]="
            'url(' + (data.coverHorizontalUrl | encodeURI) + ')'
          "
        ></div>
        <section class="section position-relative" #imgContainer>
          <div class="container shiftup">
            <div class="tt-detail">
              <div class="poster-column">
                <div class="poster-img">
                  <img
                    src="/poster-blank.png"
                    [src]="data.coverVerticalUrl"
                    [alt]="data.name"
                  />
                </div>
                <a
                  class="watch-btn"
                  [routerLink]="['/watch', $params | async]"
                  [queryParams]="$queryParams | async"
                >
                  <span> <i class="fa-solid fa-play"></i> XEM PHIM </span>
                </a>
              </div>
              <div class="main-column">
                <h1 class="maintitle">
                  {{ data.name }}
                </h1>
                <h2 class="subtitle">{{ data.aliasName }}({{ data.year }})</h2>
                <div class="meta">
                  <span class="content-rating">PG-13</span>
                </div>
                <div class="meta">
                  <span class="imb-icon">
                    <img src="/assets/imdb.svg" alt="imdb" />
                  </span>
                  <span class="imb-rating">
                    {{ data.score }}
                  </span>
                </div>
                <div class="level genres">
                  <div class="level-left">
                    <div class="level-item">
                      <a
                        [attr.href]="
                          'https://www.facebook.com/sharer/sharer.php?u=' +
                          location.href
                        "
                      >
                        <i class="fa-brands fa-square-facebook"></i>
                        Chia sẻ
                      </a>
                    </div>
                    <div class="level-item">
                      <span class="colection add">
                        <i class="fa-solid fa-bug-slash"></i>
                      </span>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item buttons">
                      <button
                        *ngFor="let item of data.tagNameList"
                        type="button"
                        class="btn btn-outline-light btn-sm rounded"
                      >
                        {{ item }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="horizontal">
                  <div class="hoz-content">
                    <p>Đạo diễn</p>
                    <span>Jaume Collet-Serra</span>
                  </div>
                  <div class="hoz-content">
                    <p>Quốc gia</p>
                    <span>
                      {{ data.areaNameList.join(", ") }}
                    </span>
                  </div>
                  <div class="hoz-content">
                    <p>Khởi chiếu</p>
                    <span>
                      {{ data.year }}
                    </span>
                  </div>
                </div>
                <div class="intro">
                  {{ data.introduction || "Đang cập nhật..." }}
                </div>
                <div *ngIf="data.starList.length" class="cast mt-5">
                  <movie-stars
                    [startData]="{
                      homeSectionName: 'Diễn viên',
                      recommendContentVOList: data.starList
                    }"
                  ></movie-stars>
                </div>
                <div class="trailer mt-5">
                  <strong class="d-block h5 my-2 pb-2 border-bottom">
                    Cùng thể loại
                  </strong>
                  <movie-list [movieDatas]="data.likeList"></movie-list>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ng-container>
    <ng-template #spin>
      <div class="spinner"></div>
    </ng-template>
  `,
})
export default class AppMovieComponent {
  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private _router: Router,
    private $destroy: DestroyService
  ) {}
  location = window.location;
  $queryParams = this.route.queryParams;
  $params = this.route.params.pipe(map(({ id }: any) => id));
  loading = false;
  id!: number;
  resData: Record<string, any> = {};
  ngOnInit() {
    this._router.events
      .pipe(
        filter((e) => e instanceof NavigationStart),
        tap(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }),
        takeUntil(this.$destroy)
      )
      .subscribe();
    this.loadData().subscribe();
  }
  loadData() {
    return this.route.queryParams.pipe(
      concatMap((queryParams) => {
        this.id = queryParams["id"];
        if (this.resData[this.id]) {
          return of(null);
        }
        this.loading = true;
        return this.httpClient
          .get("/movieDrama/get", { params: queryParams })
          .pipe(
            tap(({ data }: any) => {
              this.resData[this.id] = data;
              this.loading = false;
            }),
            takeUntil(this.$destroy)
          );
      })
    );
  }
}

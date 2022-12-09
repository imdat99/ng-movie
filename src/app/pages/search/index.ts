import { AsyncPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import MovieListComponent from '@app/components/movie-list';
import { BehaviorSubject, debounceTime, finalize, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [FormsModule, AsyncPipe, MovieListComponent, NgIf],
  standalone: true,
  template: `
    <div class="container">
      <div class="my-5">
        <div class="input-group position-relative mb-3 input-group-lg">
          <input
            type="text"
            class="form-control"
            placeholder="Tìm kiếm..."
            aria-label="Tìm kiếm..."
            [ngModel]="searchKeyword"
            #inputSearch
            (ngModelChange)="changeSearchKeyword($event)"
          />
          <i
            class="fa-solid fa-circle-xmark position-absolute clear-input"
            (click)="handleClearInput()"
          ></i>
          <button class="btn btn-outline-secondary" type="button">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
      <div class="result-list">
        <movie-list [movieDatas]="defaultData"></movie-list>
      </div>
      <div *ngIf="loading" class="spinner"></div>
      <span *ngIf="!defaultData.length && !loading">không có dữ liệu</span>
    </div>
  `,
})
export default class SearchComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}
  @ViewChild('inputSearch') input!: ElementRef;
  defaultData: any[] = [];
  $searchData!: Observable<any>;
  searchKeyword: string = '';
  loading = false;
  ngOnInit() {
    this._route.queryParams
      .pipe(
        tap((e) => {
          this.searchKeyword = e['searchKeyWord'];
        }),
        debounceTime(500)
      )
      .subscribe((queryParams: Params) => {
        this.defaultData = [];
        this.loading = true;
        if (!queryParams['searchKeyWord']) {
          this.httpClient
            .get('/search/v1/searchLeaderboard')
            .pipe(
              finalize(() => {
                this.loading = false;
              })
            )
            .subscribe(({ data }: any) => {
              this.defaultData = data.list;
            });
        } else {
          this.httpClient
            .post('/search/v1/searchWithKeyWord', {
              ...queryParams,
              size: 50,
              sort: '',
              searchType: '',
            })
            .pipe(
              finalize(() => {
                this.loading = false;
              })
            )
            .subscribe(({ data }: any) => {
              this.defaultData = data.searchResults;
            });
        }
      });
  }
  handleClearInput() {
    this.defaultData = [];
    this.changeSearchKeyword('');
    this.input.nativeElement.focus();
  }

  changeSearchKeyword(value: string) {
    const queryParams: { searchKeyWord?: string } = { searchKeyWord: value };

    this._router.navigate([], {
      relativeTo: this._route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}

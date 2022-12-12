import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  fromEvent,
  map,
  of,
  tap,
} from 'rxjs';

interface HomeData {
  navigationId: number;
  page: number;
  data: any;
}
interface Section {
  navigationId: number;
  ids: any[];
}

interface PagesData {
  [key: string]: Partial<HomeData>;
}
interface SectionData {
  [key: string]: Partial<Section>;
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private httpClient: HttpClient) {
    this.$navigationId.subscribe((e) => {
      if (e) {
        this.pagesData[e] = {
          navigationId: e,
          page: this.pagesData[e]?.page || 0,
          data: this.pagesData[e]?.data || [],
        };
        this.sectionIds[e] = {
          navigationId: e,
          ids: this.sectionIds[e]?.ids || [],
        };
        if (!this.pagesData[e]?.data.length) {
          this.loadData();
        } else {
          this.setPageData(e);
        }
      }
    });
  }

  private sectionIds: SectionData = {};
  private pagesData: PagesData = {};
  private $navigationId = new BehaviorSubject<number>(0);
  $pageData = new BehaviorSubject<{
    data: any[];
    isEnd: boolean;
    loading: boolean;
  }>({
    data: [],
    isEnd: false,
    loading: false,
  });

  private loading: boolean = false;
  private isEnd = false;

  setNavigationId(id: number) {
    this.$navigationId.next(id);
  }

  private setPageData(id: number) {
    this.$pageData.next({
      data: this.pagesData[String(id)].data,
      isEnd: this.isEnd,
      loading: this.loading,
    });
  }

  private loadData() {
    this.loading = true;
    const pageId = this.$navigationId.value;
    this.setPageData(pageId);
    this.httpClient
      .get('/homePage/getHome', {
        params: {
          size: 10,
          page: this.pagesData[pageId].page!,
          navigationId: pageId,
        },
      })
      .pipe(
        map((res) => {
          const { data } = res as any;
          if (data.recommendItems.length) {
            data.recommendItems.forEach((item: any) => {
              if (!this.sectionIds[pageId].ids!.includes(item.homeSectionId)) {
                this.pagesData[pageId].data.push(item);
                this.sectionIds[pageId].ids!.push(item.homeSectionId);
              }
            });
          } else {
            this.isEnd = true;
            this.$pageData.next({ ...this.$pageData.value, isEnd: true });
          }
        }),
        catchError(() => {
          this.isEnd = true;
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
          this.setPageData(pageId);
        })
      )
      .subscribe();
  }

  scroll() {
    return fromEvent(window, 'scroll').pipe(
      tap(() => {
        const { scrollHeight, clientHeight, scrollTop } =
          document.documentElement;
        if (
          scrollTop + clientHeight > scrollHeight - 250 &&
          !this.isEnd &&
          !this.loading
        ) {
          this.pagesData[String(this.$navigationId.value)].page!++;
          this.loadData();
        }
      })
    );
  }
}

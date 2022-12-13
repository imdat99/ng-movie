import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLinkActive, RouterLinkWithHref } from "@angular/router";
import routes, { AppRoutes } from "@app/router";
import { BehaviorSubject } from "rxjs";

@Component({
  standalone: true,
  imports: [
    RouterLinkWithHref,
    NgFor,
    NgIf,
    FormsModule,
    AsyncPipe,
    RouterLinkActive,
  ],
  selector: "app-header",
  template: `
    <nav
      class="navbar navbar-expand-md"
      aria-label="Fourth navbar example"
      #appNav
    >
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">
          <img src="/assets/logo.png" alt="" class="logo-img" />
        </a>
        <button
          class="navbar-toggler collapsed"
          type="button"
          (click)="menuToggle = !menuToggle"
        >
          <i class="fa-solid fa-bars menu-toggle"></i>
        </button>
        <div class="navbar-collapse collapse" [class.show]="menuToggle">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <ng-container *ngFor="let route of routes">
              <li
                *ngIf="route.name"
                class="nav-item"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                <a [routerLink]="route.path" class="nav-link">
                  {{ route.name }}
                </a>
              </li>
            </ng-container>
          </ul>
          <div class="right-container d-flex">
            <div class="theme-toggle my-auto">
              <div class="toggle-icon">
                <div class="dark-mode-switch form-check form-switch">
                  <input
                    class="form-check-input btn-toggle position-relative cursor-pointer"
                    type="checkbox"
                    [ngModel]="check"
                    [attr.data-check]="check"
                    (ngModelChange)="themeHandler($event)"
                  />
                </div>
              </div>
            </div>
            <span class="btn-search" (click)="navigateSearch()">
              <i class="fa-solid fa-magnifying-glass"></i>
            </span>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ["./style.scss"],
})
export default class HeaderComponent implements OnInit {
  @ViewChild("appNav") nav!: ElementRef;
  routes: AppRoutes;
  menuToggle: boolean = false;
  check: boolean = false;
  $darkTheme = new BehaviorSubject(false);
  constructor(private readonly router: Router) {
    this.routes = routes;
    this.$darkTheme.next(localStorage.getItem("dark") === "true");
  }

  ngOnInit(): void {
    this.$darkTheme.subscribe((value: boolean) => {
      this.check = value;
      if (value) {
        document.body.classList.add("theme-dark");
      } else {
        document.body.classList.remove("theme-dark");
      }
      localStorage.setItem("dark", String(value));
    });
  }

  @HostListener("document:mousedown", ["$event"])
  onGlobalClick(event: MouseEvent): void {
    if (!this.nav.nativeElement.contains(event.target)) {
      this.menuToggle = false;
    }
  }

  themeHandler($event: boolean) {
    this.$darkTheme.next($event);
  }
  navigateSearch() {
    this.router.navigateByUrl("/search");
  }
}

import { Component } from "@angular/core";

@Component({
  standalone: true,
  selector: "app-footer",
  template: `
    <footer class="w-100 py-4 flex-shrink-0">
      <div class="container py-4">
        <div class="row gy-4 gx-2">
          <div class="col-lg-8 col-md-6">
            <a href="/">
              <div class="footer-brand mb-2">
                <img src="/assets/logo.png" alt="" class="logo-img" />
              </div>
            </a>
            <p class="small text-muted">
              Instant of <b>Vanilla-movie</b> using
              <a href="https://angular.io/"><b>Angular v15</b></a>
              <br />
              Nguồn phim được lấy từ api app
              <a
                href="https://documenter.getpostman.com/view/18986031/UVXdNeFD"
              >
                <b> loklok</b>
              </a>
            </p>
            <p>
              <b>contact me:</b>
              <a href="https://www.facebook.com/lethdat">
                <i class="fs-4 ms-2 fa-brands fa-facebook"></i>
              </a>
              <a href="https://www.instagram.com/">
                <i class="fs-4 ms-2 fa-brands fa-instagram"></i>
              </a>
            </p>
            <p class="small text-muted mb-0">
              © Copyrights. All rights reserved.
              <a class="text-danger" href="/"> dat09.fun </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}

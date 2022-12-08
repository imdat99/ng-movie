import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
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
          />
          <i class="fa-solid fa-circle-xmark position-absolute clear-input"></i>
          <button class="btn btn-outline-secondary" type="button">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
      <div class="result-list"></div>
      <div class="spinner"></div>
      <span>không còn dữ liệu</span>
    </div>
  `,
})
export default class SearchComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

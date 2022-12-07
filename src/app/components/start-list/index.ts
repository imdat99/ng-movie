import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { EncodeURIPipe } from '@app/pipes';

@Component({
  selector: 'movie-stars',
  standalone: true,
  imports: [NgFor, EncodeURIPipe],
  template: `
    <div>
      <div class="d-flex h5 my-2 pb-2 border-bottom justify-content-between">
        <b>{{ startData?.homeSectionName }}</b>
        <div class="btn-control">
          <button type="button">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button type="button">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <div class="star-list">
        <div class="star-container">
          <ng-container *ngFor="let item of startData?.recommendContentVOList">
            <a href="/">
              <div class="star-inner">
                <div class="star-img">
                  <img
                    [src]="
                      item.cover || item.imageUrl || item.image || '/110.png'
                        | encodeURI
                    "
                    alt=""
                    class="rounded-circle"
                    loading="lazy"
                  />
                </div>
                <span class="star-name">
                  {{ item.title || item.localName || '' }}
                </span>
              </div>
            </a>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./style.scss'],
})
export default class MovieStarsComponent implements OnInit {
  @Input() startData: any;

  ngOnInit() {}
}

// {this.props.list?.map((item: any) => {
//   return (
//     <div data={this.$id}>
//       <app-link to={`/album/${jumpLink(item)}`}>
//         <div class="star-inner">
//           <div class="star-img">
//             <img
//               src="/110.png"
//               alt=""
//               class="rounded-circle"
//               lazy-src={encodeURI(
//                 item.cover ||
//                   item.imageUrl ||
//                   item.image ||
//                   "/110.png"
//               )}
//               loading="lazy"
//             />
//           </div>
//           <span class="star-name">
//             {item.title || item.localName || ""}
//           </span>
//         </div>
//       </app-link>
//     </div>
//   );
// })}

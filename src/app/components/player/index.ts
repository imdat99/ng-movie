import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import Artplayer from 'artplayer';
import createPlayer from './player-helper';

@Component({
  selector: 'app-player',
  standalone: true,
  styles: [
    `
      .video {
        overflow-x: hidden;
      }
    `,
  ],
  template: `
    <div class="video">
      <div class="player-container" style="height: 40vh" #player></div>
    </div>
  `,
})
export class PlayerComponent implements AfterViewInit, OnDestroy {
  @Input() palyerData!: Record<string, any>;
  @ViewChild('player') player!: ElementRef;
  artPlayer!: Artplayer;
  constructor() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  ngOnDestroy(): void {
    this.artPlayer?.destroy(true);
  }

  ngAfterViewInit() {
    this.artPlayer = createPlayer({
      container: this.player.nativeElement,
      ...this.palyerData,
    });
  }
}

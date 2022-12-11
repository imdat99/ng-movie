import Artplayer from 'artplayer';
import { Option } from 'artplayer/types/option';
import Hls from 'hls.js';
export default function player(options: Partial<Option & { subtitle: any }>) {
  const { subtitle, ...artOptions } = options;
  const artInstant = new Artplayer(
    {
      url: '',
      container: '.player-container',
      isLive: false,
      muted: false,
      autoplay: true,
      pip: true,
      autoSize: true,
      autoMini: false,
      setting: true,
      loop: true,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: false,
      theme: '#E03131',
      customType: {
        m3u8(video: any, url: string) {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          } else {
            this.notice.show = 'Does not support playback of m3u8';
          }
        },
      },

      subtitle: {
        url:
          (
            subtitle.find((item: any) => item?.languageAbbr === 'vi') ||
            subtitle[0]
          )?.subtitlingUrl || '',
        type: 'srt',
        style: {
          color: '#fff',
          fontSize: '30px',
        },
        encoding: 'utf-8',
      },
      settings: [
        {
          width: 200,
          html: 'Subtitle',
          tooltip:
            (
              subtitle.find((item: any) => item?.languageAbbr === 'vi') ||
              subtitle[0]
            )?.language || '',
          icon: '<img width="22" heigth="22" src="https://artplayer.org/assets/img/subtitle.svg">',
          selector: [
            {
              html: 'Display',
              tooltip: 'Show',
              switch: true,
              onSwitch: function (item) {
                item.tooltip = item['switch'] ? 'Hide' : 'Show';
                artInstant.subtitle.show = !item['switch'];
                return !item['switch'];
              },
            },
            ...subtitle.map((item: any) => ({
              default: item?.languageAbbr === 'vi',
              html: item?.language,
              url: item?.subtitlingUrl,
            })),
          ],
          onSelect: function (item) {
            artInstant.subtitle.switch(item['url'], {
              name: item.html,
            });
            return item.html;
          },
        },
      ],
      layers: [
        {
          html: '<img width="100" src="/logo.png">',
          click: function () {
            window.open('http://dat09.fun/home');
          },
          style: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            opacity: '0.75',
          },
        },
      ],
      ...artOptions,
    },
    function () {
      this.autoHeight = true;
    }
  );

  return artInstant;
}

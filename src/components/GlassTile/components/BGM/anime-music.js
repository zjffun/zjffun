const animeMusic = {
  recommend: false,
  max_load_time: 10, // 最大加载时间, 一首歌的加载时间超过此数值, 将会直接跳到下一曲
  _anime_music_player: new Audio(),
  _setI_play: null,
  _setI_pause: null,
  _setI_progress: null,
  _now_load_time: 0,
  Play: function() {
    animeMusic.onPlay();
    animeMusic._anime_music_player.play();
    animeMusic._setI_progress = setInterval(function() {
      animeMusic.progress();
    }, 333);
    animeMusic._setI_play = setInterval(function() {
      if (animeMusic._anime_music_player.volume < 0.99)
        animeMusic._anime_music_player.volume += 0.01;
    }, 10);
    setTimeout(function() {
      clearInterval(animeMusic._setI_play);
      animeMusic._play_or_pauseing = false;
      animeMusic.onPlayed();
    }, 1100);
  },
  PlayTo: function(percentage) {
    animeMusic._anime_music_player.currentTime =
      animeMusic._anime_music_player.duration * (percentage / 100);
  },
  Pause: function() {
    clearInterval(animeMusic._setI_progress);

    animeMusic.onPause();

    animeMusic._setI_pause = setInterval(function() {
      if (animeMusic._anime_music_player.volume > 0.01)
        animeMusic._anime_music_player.volume -= 0.01;
    }, 10);
    setTimeout(function() {
      clearInterval(animeMusic._setI_pause);
      animeMusic._anime_music_player.pause();
      animeMusic._play_or_pauseing = false;

      animeMusic.onPaused();
    }, 1100);
  },
  Next: function(src) {
    animeMusic.Pause();
    animeMusic._anime_music_player.src = src;
    animeMusic._now_load_time = 0;
  },
  progress: function() {
    var all_time = secondToDate(animeMusic._anime_music_player.duration);
    var now_time = secondToDate(animeMusic._anime_music_player.currentTime);
    var percentage = parseInt(
      (animeMusic._anime_music_player.currentTime /
        animeMusic._anime_music_player.duration) *
        100
    );

    animeMusic.onProgress(percentage, now_time, all_time);
  },
  bindPlayTo: function(val) {
    var dom = val instanceof Node ? val : document.querySelector(val);
    if (dom) {
      dom.onclick = function(ev) {
        var oEvent = ev || event;
        var left = oEvent.offsetX;
        var percentage = parseInt((left / dom.offsetWidth) * 100);
        animeMusic.PlayTo(percentage);
      };
    } else {
      console.log('dom is not exists');
    }
  },
  onPlay: function() {},
  onPlayed: function() {},
  onPause: function() {},
  onPaused: function() {},
  onLoad: function() {},
  onLoaded: function() {},
  onProgress: function() {}
};

function secondToDate(result) {
  var m =
    Math.floor((result / 60) % 60) < 10
      ? '0' + Math.floor((result / 60) % 60)
      : Math.floor((result / 60) % 60);
  var s =
    Math.floor(result % 60) < 10
      ? '0' + Math.floor(result % 60)
      : Math.floor(result % 60);
  var ret = m + ':' + s;
  return ret == 'NaN:NaN' ? '00:00' : ret;
}

animeMusic._anime_music_player.onended = function() {
  animeMusic.Next();
};

export default animeMusic;

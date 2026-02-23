(function () {
  var tracks = [
    'bgm/01_staygold.mp3',
    'bgm/02_goodriddance.mp3',
    'bgm/03_Namidaga Koboresou.mp3',
    'bgm/04_Konya.mp3',
    'bgm/05_Sono Mukoue.mp3',
    'bgm/06_makeawish.mp3',
    'bgm/07_slipofthelip.mp3',
    'bgm/08_chainreaction.mp3',
    'bgm/09_youandi.mp3',
    'bgm/10_straightup.mp3'
  ];

  var idx = 0;
  var bgm = new Audio();
  var nextBgm = null;
  var ytPlaying = false;

  function play() {
    if (!ytPlaying) {
      bgm.play().catch(function () {});
    }
  }

  function setupTrack(audio, i) {
    audio.volume = 0.6;

    // 再生が始まったら次の曲をプリロード
    audio.addEventListener('playing', function () {
      var ni = (i + 1) % tracks.length;
      nextBgm = new Audio(tracks[ni]);
    }, { once: true });

    // 曲が終わったら次へ
    audio.addEventListener('ended', function () {
      idx = (i + 1) % tracks.length;
      bgm = nextBgm || new Audio(tracks[idx]);
      nextBgm = null;
      setupTrack(bgm, idx);
      play();
    }, { once: true });
  }

  bgm.src = tracks[0];
  setupTrack(bgm, 0);

  // ENTER ボタンでBGM開始＆オーバーレイを閉じる
  var overlay = document.getElementById('enter-overlay');
  var enterBtn = document.getElementById('enter-btn');

  enterBtn.addEventListener('click', function () {
    play();
    overlay.classList.add('hide');
    overlay.addEventListener('transitionend', function () {
      overlay.remove();
    }, { once: true });
  });

  // YouTube IFrame API の初期化コールバック（グローバルに公開）
  // APIスクリプト読み込み後に自動で呼ばれる
  window.onYouTubeIframeAPIReady = function () {
    new YT.Player('yt-player', {
      events: {
        onStateChange: function (event) {
          if (event.data === YT.PlayerState.PLAYING) {
            // YouTube 再生中 → BGM 停止
            ytPlaying = true;
            bgm.pause();
          } else if (
            event.data === YT.PlayerState.PAUSED ||
            event.data === YT.PlayerState.ENDED
          ) {
            // YouTube 停止 / 一時停止 → BGM 再開
            ytPlaying = false;
            play();
          }
        }
      }
    });
  };
})();

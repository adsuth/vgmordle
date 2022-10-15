// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var STAGGER_ERROR_MESSAGE = null

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: '',
    playerVars: {
      'playsinline': 1
    },
    events: {
      "onStateChange": onPlayerStateChange,
      "onReady": onPlayerReady,
      "onError": onError
    }
  });
}

function onError( ev = null ) {
  if ( ev?.data == 2 ) {
    return
  }
  console.warn(`PlayerError: ${ev?.data || "N/A"}\nsong index: ${song_current.index}\nname: ${song_current.name}\n(${song_current.url})`)
  cueNextSong()
}

function onPlayerStateChange(ev) {
  if (ev.data == YT.PlayerState.CUED && !player.getVideoData()['video_id'] ) {
    STAGGER_ERROR_MESSAGE = setTimeout( ev => { onError( ev ) }, 1000 )
    return 
  }

  if (ev.data === YT.PlayerState.PLAYING && !isEndGame) {
    clearTimeout( STAGGER_ERROR_MESSAGE )

    pieTimer.style.animationDuration = MAX_TIMES[index] + "ms"
    pieTimer.style.display = "block"
    playTriangle.style.display = "none"

    playAnimation()

    TIMER = window.setTimeout(() => {
      player.seekTo(0)
      player.stopVideo()
      window.clearTimeout(TIMER)

    }, MAX_TIMES[index])
  }

  if (ev.data === YT.PlayerState.CUED) {
    pieTimer.style.display = "none"
    playTriangle.style.display = "block"
  }
}

function onPlayerReady() {
  main()
}
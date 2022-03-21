// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: 'ZYAPgPH9hsI',
        playerVars: {
            'playsinline': 1
        },
        events: {
            "onStateChange": onPlayerStateChange,
            "onReady": onPlayerReady
        }
    });
}

function onPlayerStateChange(ev) {
    if ( ev.data === YT.PlayerState.PLAYING ) {
        var timer = window.setTimeout( () => {
            player.seekTo(0)
            player.stopVideo()
            window.clearTimeout( timer )

        }, MAX_TIMES[index] )
    }
}

function onPlayerReady() {
    main()
}
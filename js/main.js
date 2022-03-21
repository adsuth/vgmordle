
const playButton = document.getElementById("btn_play")
const skipButton = document.getElementById("btn_skip")
const guessBoxes = document.getElementById("ul_guessBoxes").getElementsByTagName("li")

var song;
var MAX_TIMES = [1000, 2000, 4000, 7000, 11000, 16000]
var index = 0

function main() {
    random_init()
    addEventListeners()
    song = getSong()
    player.cueVideoById( song.url )
}

function addEventListeners() {
    playButton.addEventListener("click", ev => {
        player.playVideo()
    })

    skipButton.addEventListener("click", ev => {
        if ( index === MAX_TIMES.length ) return
        index++
        
        fillGuessBox( id=index-1, msg="Skipped!!", color="#504175" )
    })
}

function fillGuessBox( id, msg, color ) {
    guessBoxes[id].innerText = msg
    guessBoxes[id].style.color = color
    guessBoxes[id].style.fontWeight = "600"
}
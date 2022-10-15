const list = document.getElementById("list")
const searchBox = document.getElementById("inp_guess")
const playButton = document.getElementById("btn_play")
const nextTrackButton = document.getElementById("btn_next")
const skipButton = document.getElementById("btn_skip")
const submitButton = document.getElementById("btn_submit")
const guessBoxes = document.getElementById("ul_guessBoxes")
const pieTimer = document.getElementById("chart")
const playTriangle = document.getElementById("triangle")

const MAX_TIMES = [1500, 3000, 5000, 8000, 11000, 16000, 30000]
const MAX_SUGGESTIONS = 5;
const maxGuesses = 6

const COLORS = {
  correct: {
    fore: "#00FFAA",
    back: "#00FFAA22",
  },
  wrong: {
    fore: "#FF0033",
    back: "#FF003322",
  },
  default: {
    fore: "#504175",
    back: "#00000033"
  }
}

var prevGuesses = []
var song;
var index = 0
var isEndGame = false

var TIMER = null
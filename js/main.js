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

var prevGuesses = []
var song;
var index = 0
var isEndGame = false

var TIMER = null

function main() {
  for (let li of guessBoxes.children) {
    li.innerText = ""
    li.style.background = "inherit"
  }
  
  if (!songs_random) {
    random_init()
  }
  
  searchBox.focus()

  index = 0
  prevGuesses = []
  isEndGame = false
  searchBox.value = ""
  list.innerHTML = ""  

  song = getSong()
  player.cueVideoById(song.url.slice(song.url.lastIndexOf("/") + 1, song.url.length))
  showSongData()
}

addEventListeners()

function addEventListeners() {
  playButton.addEventListener("click", playSong )

  nextTrackButton.addEventListener("click", ev => {
    document.getElementById("modal").style.display = "none";
    main()
  })

  searchBox.addEventListener("input", function (ev) {
    list.style.display = "block"
    list.innerHTML = ""
    var counter = 0

    for (let game of games_all) {
      gameName = game.normalize("NFD").replace( /[^a-zA-Z0-9 -]/g, "" ).toLowerCase()

      if (counter === MAX_SUGGESTIONS ) {
        break
      }

      if (gameName.includes( ev.target.value.toLowerCase().replace( /[^a-zA-Z0-9 -]/g, "" ) )) {
        list.appendChild(makeListItem(game))
        counter++
      }
    }

    if (ev.target.value.length !== 0 && counter === 0 || ev.target.value.length === 0) {
      list.style.display = "none"
    }
  })

  skipButton.addEventListener("click", skip )

  submitButton.addEventListener("click", submitAnswer )

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter") {
      if ( isEndGame )
      {
        document.getElementById("modal").style.display = "none";
        main()
        return
      }

      if (ev.target.value.trim().length === 0) return;

      if ( prevGuesses.includes( ev.target.value.trim() ) )
      {
        searchBox.value = ""
        list.innerHTML = ""
        return
      }
      
      if ( list.childElementCount > 1 ) return;
      
      index++
      if (index === maxGuesses) {
        isEndGame = true
        document.getElementById("modal").style.display = "block";
        player.seekTo(0)
        return
      }
      
      if ( list.childElementCount === 1 ) 
      {
        searchBox.value = list.firstChild.innerText;
      }

      if ( songGuess() ) {
        fillGuessBox(id = index - 1, msg = searchBox.value, color = "#00FFAA", bgColor = "#00FFAA22")

        isEndGame = true
        playSong()
        showSongData()

        document.getElementById("modal").style.display = "block";
        return
      }
      
      fillGuessBox(id = index - 1, msg = searchBox.value, color = "#FF0033", bgColor = "#FF003322")
      prevGuesses.push( ev.target.value.trim() )
      searchBox.value = ""
      list.innerHTML = ""
    }

    if ( ev.key === " " && ev.ctrlKey )
    {
      playSong()
    }
    if ( ev.key === "ArrowRight" && ev.ctrlKey )
    {
      skip()
    }

  })
}

function fillGuessBox(id, msg, color, bgColor) {
  guessBoxes.getElementsByTagName("li")[id].innerText = msg
  guessBoxes.getElementsByTagName("li")[id].style.color = color
  guessBoxes.getElementsByTagName("li")[id].style.fontWeight = "600"
  guessBoxes.getElementsByTagName("li")[id].style.background = bgColor
}

function songGuess() {
  let guess        = document.getElementById("inp_guess").value.toLowerCase();
  let lastGuessBox = list?.firstElementChild?.innerText?.toLowerCase()
  return guess === song.game.toLowerCase() || lastGuessBox === song.game.toLowerCase()
}

/**
 * Method creates and populates a new list item.
 * The list item is then appended to the ul list
 * @param {String} content 
 * @returns 
 */
function makeListItem(content) {
  let li = document.createElement("li")
  li.innerText = content
  li.classList.add("list_item_class") // add style classes like this (each class has new line)
  li.addEventListener("click", ev => {
    searchBox.focus()
    searchBox.value = ev.target.innerText

    list.innerHTML = ""
    list.style.display = "none"

    if ( ev.ctrlKey )
      submitAnswer( ev )
  })
  return li
}

function showSongData() {
  document.getElementById("player").style.display = "flex"
  document.getElementById('game_title').innerHTML = song.game
  document.getElementById('song_title').innerHTML = song.name
}

function fadeOut() {
  let fadeTimeOut = setTimeout(function () {
    let fadeInterval = setInterval(function () {
      if (player.getVolume() === 0) {
        player.pauseVideo()
        clearInterval(fadeInterval)
      }
      player.setVolume(player.getVolume() - 0.1)
    }, 100)
  }, MAX_TIMES[MAX_TIMES.length - 1])
}

function playAnimation() {
  chart.classList.remove("chartAnimation")
  chart.offsetWidth = chart.offsetWidth
  chart.classList.add("chartAnimation")
}

function submitAnswer( ev )
{
  if (searchBox.value.length === 0) return

  if ( songGuess() ) {
    if ( YT.PlayerState.PLAYING )
    {
      window.clearTimeout(TIMER)
    }
    
    playSong()

    fillGuessBox(id = index, msg = searchBox.value, color = "#00FFAA", bgColor = "#00FFAA22")
    searchBox.value = ""

    isEndGame = true
    showSongData()

    document.getElementById("modal").style.display = "block";
    return
  }

  if (index === maxGuesses) {
    isEndGame = true
    document.getElementById("modal").style.display = "block";
    return
  }
  
  index++
  fillGuessBox(id = index - 1, searchBox.value, color = "#FF0033", bgColor = "#FF003322")
  
  searchBox.value = ""
  searchBox.focus()
}

function playSong( ev )
{
  if ( !isEndGame )
  {
    player.seekTo(0)
  }

  if ( YT.PlayerState.PLAYING )
  {
    window.clearTimeout( TIMER )
  }
  player.setVolume(100)
  player.playVideo()
  searchBox.focus()
}

function skip( ev ) {
  fillGuessBox(id = index, msg = "Skipped!!", color = "#504175", bgColor = "#00000033")
  index++
  if (index === maxGuesses) {
    isEndGame = true
    document.getElementById("modal").style.display = "block";
    player.setVolume(100)
    player.seekTo(0)
    return
  }
}
var games_all = null
var songs_all = null
var songs_random = null
var song_current = null

function random_init() {
  /*
      Gets all songs
      clamps all games to one array of songs
      generates a list of ids
      randomly permutes array
  */

  games_all = []
  songs_all = []
  songs_random = []

  $.ajax({
    url: "vgmordle.json",
    dataType: "json",
    success: function (data) {

      for (let game in data) {
        songs_all = songs_all.concat(data[game])
        games_all.push(game)
      }

      songs_random = shuffleArray(songs_all.slice(0))

    },
    async: false
  })
}

function getSong() {
  return songs_random.pop()
}

function shuffleArray(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr
}
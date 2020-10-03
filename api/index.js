require('dotenv').config()
const Genius = require("genius-lyrics")

const Client = new Genius.Client(process.env.GENIUS_ACCESS_TOKEN)

async function retrieveLyrics() {
  const partialSongs = await Client.songs.search("Pop Smoke")
  const artist = await Client.artists.get(partialSongs[0].artist.id)
  const songs = await artist.songs({ per_page: 10 })
  const indexSongs = Math.floor(Math.random() * Math.floor(songs.length))

  let lyrics
  while (!lyrics) {
    try {
      lyrics = await songs[indexSongs].lyrics(true)
    } catch (err) { console.error(err) }
  }
  const arrLyrics = lyrics.split("\n").filter(l => l.length && l[0] !== '[')
  const indexLyrics = Math.floor(Math.random() * Math.floor(arrLyrics.length))
  return arrLyrics[indexLyrics]
}

module.exports = async (req, res) => {
  try {
    res.send({
      status: 200,
      lyrics: await retrieveLyrics(),
    })
  } catch (err) {
    res.send({
      status: 500,
      message: err.message,
    })
  }
}

const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Playlist = require("../models/playlist.js");
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const playlist = await Playlist.create(req.body);
    playlist._doc.author = req.user;
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

router.get("/", verifyToken, async (req, res) => {
  try {
    const playlists = await Playlist.find({})
      .populate("playlist")
      .populate("author")
      .populate("genre")
      .populate("station")
    res.status(200).json(playlists);
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
});

router.get('/:playlistId', verifyToken, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId)
      .populate("author")
      .populate('songs')
    res.status(200).json(playlist);
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

router.put('/:playlistId', verifyToken, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId)
    if (!playlist.author.equals(req.user._id)) {
      return res.status(403).send("You are not allowed!")
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.playlistId, req.body, { new: true });
    updatedPlaylist._doc.author = req.user;
    res.status(200).json(updatedPlaylist)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
});

router.delete('/:playlistId', verifyToken, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId)
    if (!playlist.author.equals(req.user._id)) {
      return res.status(403).send("You are not allowed!")
    }
    const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.playlistId);
    res.status(200).json(deletedPlaylist)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
});
// --------------------------API-------------------------//

router.post('/api/:playlistId/:songId', async (req, res) => {
  const { playlistId } = req.params;
  const { songId } = req.params;
  console.log('this will work')
  try {
    const playlist = await Playlist.findById(playlistId);
    if(!playlist) return res.status(404).send('Playlist not found');

    if(!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    res.status(200).json({ message: 'Song Added', playlist })
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
});

module.exports = router;

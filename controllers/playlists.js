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
  }catch(err){
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

module.exports = router;

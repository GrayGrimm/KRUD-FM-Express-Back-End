const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Playlist = require("../models/playlists.js");
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

module.exports = router;

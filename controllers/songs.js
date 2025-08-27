const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Song = require("../models/song.js");
const router = express.Router();



router.post("/", verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const song = await Song.create(req.body);
        song._doc.author = req.user;
        res.status(201).json(song);
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.get('/', verifyToken, async (req, res) => {
    try {
        const songs = await Song.find({})
        res.status(200).json(songs)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
});

router.get('/:songId', verifyToken, async (req, res) => {
  try {
    const song = await Song.findById(req.params.songId)
    res.status(200).json(song);
  } catch(err) {
    res.status(500).json({ err: err.message })
  }
});

router.delete('/:songId', verifyToken, async (req, res) => {
    try {
        const deletedSong = await Song.findByIdAndDelete(req.params.songId)
        res.status(200).json(deletedSong)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
});


module.exports = router;
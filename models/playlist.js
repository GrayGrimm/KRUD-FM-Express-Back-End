const { mongoose } = require("mongoose");

const playlistsSchema = new mongoose.Schema({
        playlist: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        genre: {
            type: String,
            required: true,
        },
        station: {
            type: String,
            required: true,
            enum: ["953", "97.9", "666"],
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Songs" }]
});

const Playlist = mongoose.model('Playlist', playlistsSchema);

module.exports = Playlist;
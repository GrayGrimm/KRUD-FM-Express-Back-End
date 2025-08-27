const { mongoose } = require("mongoose");

const songsSchema = new mongoose.Schema({
    track: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    album: {
        type: String,
    },
    albumArt: {
        type: String, // image
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        
});

const Songs = mongoose.model('Songs', songsSchema);

module.exports = Songs;
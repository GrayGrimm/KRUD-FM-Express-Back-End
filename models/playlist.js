const playlistSchema = new mongoose.Schema({
        playlist: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
        station: {
            type: String,
            required: true,
            enum: [],
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        songsSchema: [{ type: mongoose.Schema.Types.ObjectId, ref: "Songs" }]
});

const Playlist = mongoose.model('Playlist', playlistSchema);

modules.exports = Playlist;
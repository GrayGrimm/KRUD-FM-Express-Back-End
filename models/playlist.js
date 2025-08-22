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
        author: {
            type: String,
            required: true,
        },
        songsSchema: [{ref: songId}]
});

const Playlist = mongoose.model('Playlist', playlistSchema);

modules.exports = Playlist;
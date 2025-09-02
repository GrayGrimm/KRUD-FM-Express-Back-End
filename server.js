const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');


const authRouter = require('./controllers/auth.js');
const usersRouter = require('./controllers/users.js')
const playlistsRouter = require('./controllers/playlists.js')
const songsRouter = require("./controllers/songs.js");

const soundcloudRouter = require('./controllers/soundcloud.js');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const PORT = process.env.PORT ? process.env.PORT : 3000;

app.use(cors());
app.use(express.json());
app.use(logger('dev'));


app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/playlists', playlistsRouter);
app.use("/songs", songsRouter);
app.use('/soundcloud', soundcloudRouter);

app.listen(PORT, () => {
  console.log('The express app is ready!');
});

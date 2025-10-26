const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
  }],
  isPublic: {
    type: Boolean,
    default: true,
  },
  coverImage: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);

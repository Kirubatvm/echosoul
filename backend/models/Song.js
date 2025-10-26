const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  audioUrl: { type: String, required: true },
  coverImage: { type: String },
  playCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Song', SongSchema);

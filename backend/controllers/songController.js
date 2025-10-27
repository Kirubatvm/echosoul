const cloudinary = require('cloudinary').v2;
const Song = require('../models/Song');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadStream = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
    stream.end(buffer);
  });

exports.uploadSong = async (req, res) => {
  try {
    const { title, artist } = req.body;
    if (!title || !artist) return res.status(400).json({ message: 'title and artist required' });

    const audioFile = req.files?.audio?.[0];
    if (!audioFile) return res.status(400).json({ message: 'audio file required' });

    // Upload audio as 'video' resource type
    const audioRes = await uploadStream(audioFile.buffer, {
      resource_type: 'video',
      folder: 'songs'
    });

    let coverUrl = null;
    const coverFile = req.files?.cover?.[0];
    if (coverFile) {
      const coverRes = await uploadStream(coverFile.buffer, {
        folder: 'covers'
      });
      coverUrl = coverRes.secure_url;
    }

    const song = await Song.create({
      title,
      artist,
      audioUrl: audioRes.secure_url,
      coverImage: coverUrl
    });

    return res.status(201).json(song);
  } catch (e) {
    console.error('Upload error:', e);
    return res.status(500).json({ message: 'Upload failed', error: e.message });
  }
};

// Get all songs
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    return res.json(songs);
  } catch (e) {
    console.error('Get songs error:', e);
    return res.status(500).json({ message: 'Failed to fetch songs' });
  }
};

// Search songs by title or artist
exports.searchSongs = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      const songs = await Song.find().sort({ createdAt: -1 });
      return res.json(songs);
    }
    const songs = await Song.find({
      $or: [
        { title: new RegExp(query, 'i') },
        { artist: new RegExp(query, 'i') }
      ]
    }).sort({ createdAt: -1 });
    return res.json(songs);
  } catch (e) {
    console.error('Search error:', e);
    return res.status(500).json({ message: 'Search failed' });
  }
};
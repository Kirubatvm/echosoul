const Song = require('../models/Song');

// Upload song
exports.uploadSong = async (req, res) => {
  try {
    const { title, artist, album, genre, duration } = req.body;
    
    if (!req.files || !req.files.audio) {
      return res.status(400).json({ message: 'Audio file is required' });
    }

    const audioUrl = req.files.audio[0].path;
    const coverImage = req.files.cover ? req.files.cover[0].path : null;

    const song = new Song({
      title,
      artist,
      album,
      genre,
      duration,
      audioUrl,
      coverImage,
      uploadedBy: req.user._id,
    });

    await song.save();
    res.status(201).json({ message: 'Song uploaded successfully', song });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all songs
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate('uploadedBy', 'username').sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get song by ID
exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('uploadedBy', 'username');
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search songs
exports.searchSongs = async (req, res) => {
  try {
    const { query } = req.query;
    const songs = await Song.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { artist: { $regex: query, $options: 'i' } },
        { album: { $regex: query, $options: 'i' } },
      ],
    }).populate('uploadedBy', 'username');
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Increment play count
exports.incrementPlayCount = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    );
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete song
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    if (song.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this song' });
    }

    await song.deleteOne();
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

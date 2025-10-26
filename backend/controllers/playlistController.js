const Playlist = require('../models/Playlist');
const User = require('../models/User');

// Create playlist
exports.createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const playlist = new Playlist({
      name,
      description,
      owner: req.user._id,
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    await playlist.save();

    // Add to user's playlists
    await User.findByIdAndUpdate(req.user._id, {
      $push: { playlists: playlist._id },
    });

    res.status(201).json({ message: 'Playlist created successfully', playlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user playlists
exports.getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id })
      .populate('songs')
      .sort({ createdAt: -1 });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get playlist by ID
exports.getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('songs')
      .populate('owner', 'username');
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add song to playlist
exports.addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: 'Song already in playlist' });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.json({ message: 'Song added to playlist', playlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove song from playlist
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
    await playlist.save();

    res.json({ message: 'Song removed from playlist', playlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete playlist
exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await playlist.deleteOne();
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { playlists: playlist._id },
    });

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, playlistController.createPlaylist);
router.get('/user', authMiddleware, playlistController.getUserPlaylists);
router.get('/:id', playlistController.getPlaylistById);
router.post('/:id/songs', authMiddleware, playlistController.addSongToPlaylist);
router.delete('/:id/songs', authMiddleware, playlistController.removeSongFromPlaylist);
router.delete('/:id', authMiddleware, playlistController.deletePlaylist);

module.exports = router;

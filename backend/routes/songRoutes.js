const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadAudio, uploadImage } = require('../config/cloudinary');
const multer = require('multer');

// Handle multiple file uploads
const upload = multer({}).fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]);

router.post('/upload', authMiddleware, upload, songController.uploadSong);
router.get('/', songController.getAllSongs);
router.get('/search', songController.searchSongs);
router.get('/:id', songController.getSongById);
router.post('/:id/play', songController.incrementPlayCount);
router.delete('/:id', authMiddleware, songController.deleteSong);

module.exports = router;

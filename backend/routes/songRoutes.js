const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadSong, getAllSongs, searchSongs } = require('../controllers/songController');

const upload = multer({ storage: multer.memoryStorage() });

// GET all songs (public, no auth needed)
router.get('/', getAllSongs);

// Search songs by query (public)
router.get('/search', searchSongs);

// Upload song (protected)
router.post(
  '/upload',
  authMiddleware,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  uploadSong
);

module.exports = router;

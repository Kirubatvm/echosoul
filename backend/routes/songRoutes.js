const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const { uploadSong } = require('../controllers/songController');

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/upload',
  auth,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  uploadSong
);

module.exports = router;

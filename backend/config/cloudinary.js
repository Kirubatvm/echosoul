const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for audio files
const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'spotify-clone/audio',
    resource_type: 'video', // Use 'video' for audio files
    allowed_formats: ['mp3', 'wav', 'ogg'],
  },
});

// Storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'spotify-clone/images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const uploadAudio = multer({ storage: audioStorage });
const uploadImage = multer({ storage: imageStorage });

module.exports = { cloudinary, uploadAudio, uploadImage };

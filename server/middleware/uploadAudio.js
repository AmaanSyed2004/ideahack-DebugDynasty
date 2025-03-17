const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/audio'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));  // e.g., 16783248.wav
  }
});

// Filter only audio files
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'audio' &&  file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files allowed.'));
  }
};

const uploadAudio = multer({ storage, fileFilter });

module.exports = uploadAudio;

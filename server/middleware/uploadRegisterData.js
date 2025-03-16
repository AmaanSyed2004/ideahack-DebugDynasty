const multer = require('multer');

const storage = multer.memoryStorage();

const uploadRegisterFiles = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // optional limit: 10MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'face_img' && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')) {
      cb(null, true);
    } else if (file.fieldname === 'audio' &&  file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}`), false);
    }
  },
}).fields([
  { name: 'face_img', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
]);

module.exports = uploadRegisterFiles;

const multer = require("multer");

const allowedMimeTypes = ["image/jpeg", "image/jpg"]; //only jpg image for now, since the ml model only takes jpg images

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error("Only image files (JPG, PNG, WEBP) are allowed"), false);
    }
};

const upload = multer({
    storage: multer.memoryStorage(), 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;

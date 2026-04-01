const multer = require('multer');
const path = require('path');

// 1. Define where and how to store the files
const storage = multer.diskStorage({
  // Specify the destination folder for uploads
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // Create a unique filename for each upload
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. Filter files to ensure they are images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, webp) are allowed!'), false);
  }
};

// 3. Initialize multer with our configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
  fileFilter: fileFilter
});

module.exports = upload;

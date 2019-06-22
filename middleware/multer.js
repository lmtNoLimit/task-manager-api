const multer = require('multer');
const upload = multer({
  fileFilter(req, file, cb) {
    if(!/\.(png|jpg|jpeg)$/gim.test(file.originalname)) {
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true);
  },
  limits: {
    fileSize: 1000000,
  },
});

module.exports = upload;
const fs = require('fs');
const path = require('path');
const multer = require('multer');

fs.readdir('uploads', (err) => {
  if (err) fs.mkdirSync('uploads');
});

exports.upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${Date.now()}-${name}${ext}`);
    },
  }),
});

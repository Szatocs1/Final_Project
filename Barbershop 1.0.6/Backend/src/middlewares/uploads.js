const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/termekek/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Csak képfájlok engedélyezettek!'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5* 1024 * 1024 } });

const storagePfp = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/pfpicture/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const uploadPfp = multer({ storage: storagePfp, fileFilter, limits: { fileSize: 5* 1024* 1024 } })

module.exports = {
  upload,
  uploadPfp
}
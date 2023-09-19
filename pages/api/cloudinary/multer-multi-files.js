import multer from 'multer';
import path from 'path';
// import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public');
  },
  filename(req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname.replace(fileExt, '').toLocaleLowerCase() +
      '-' +
      Date.now();
    cb(null, fileName + fileExt);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10485760, // 10mb
  },
  fileFilter(req, file, cb) {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, or png file format allowed'));
    }
  },
});

export default upload;

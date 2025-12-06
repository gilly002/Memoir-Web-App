import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: './uploads/posts', // Directory to store post images
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export default upload;

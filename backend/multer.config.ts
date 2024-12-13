// multer.config.ts
import * as multer from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: multer.diskStorage({
    destination: './uploads', // You can change this path
    filename: (req, file, cb) => {
      cb(null, Date.now() + extname(file.originalname)); // Unique filename
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
};

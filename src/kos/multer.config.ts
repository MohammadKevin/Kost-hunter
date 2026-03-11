import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_, file, cb) => {
      const unique = Date.now();
      cb(null, unique + extname(file.originalname));
    },
  }),
};

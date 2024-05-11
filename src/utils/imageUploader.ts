import { Request } from 'express';
import multer from 'multer';

// multer store
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: any,
  cb: (arg0: Error, arg1: boolean) => void
) => {
  // Check the file's MIME type
  const allowedMimeTypes = ['application/pdf'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file
    cb(new Error('Unsupported file type!'), false);
  }
};

const limits = {
  fileSize: 1000000, // 1MB
};

const upload = multer({ storage, limits, fileFilter });

export default upload;

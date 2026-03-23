import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import DataURIParser from 'datauri/parser';
import { AppError } from '../errors';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError.BadRequest('Input only accept image.'));
  }
};

// To upload images
export const upload = multer({
  storage,
  fileFilter,
});

// To format image uri
export const formatImageURI = (ext: string, buffer: Buffer) => {
  const datauri = new DataURIParser();
  return datauri.format(ext, buffer).content;
};

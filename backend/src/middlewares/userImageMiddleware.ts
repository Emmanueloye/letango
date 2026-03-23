import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/userModel';
import * as utils from '../utils';

// Multer config to upload image
export const userImageUpload = utils.upload.single('photo');

// To process user image upon upload
export const processUserImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   get the currently logged in user
  const currentUser = await User.findById(req.user?._id);

  //   check if file exist on file. If not move to the next middleware in the stack
  if (!req.file) return next();

  //   process image with sharp package
  const file = await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat('jpeg')
    .toBuffer();

  // convert image buffer to uri
  const imageFile = utils.formatImageURI('jpeg', file);

  //   check for existing file and delete
  if (currentUser?.photo) {
    await cloudinary.uploader.destroy(currentUser?.photoPublicId as string);
  }

  //   upload new image
  const result = await cloudinary.uploader.upload(imageFile as string);

  //   set the image data on request body object
  req.body.photo = result.secure_url;
  req.body.photoPublicId = result.public_id;

  next();
};

import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import * as utils from '../utils';
import Contribution from '../models/contributionModel';

export const logoUpload = utils.upload.single('logo');

export const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const contribution = await Contribution.findOne({ ref: req.params.ref });

  if (!req.file) return next();

  const file = await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat('jpeg')
    .toBuffer();

  const imageFile = utils.formatImageURI('jpeg', file);

  // Delete existing image if any.
  if (contribution?.logo) {
    await cloudinary.uploader.destroy(contribution?.logoId as string);
  }

  const result = await cloudinary.uploader.upload(imageFile as string);

  req.body.logo = result.secure_url;
  req.body.logoId = result.public_id;

  next();
};

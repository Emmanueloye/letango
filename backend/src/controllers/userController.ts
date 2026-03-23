import { NextFunction, Request, Response } from 'express';
import User from '../models/userModel';
import { AppError, StatusCodes } from '../errors';
import * as utils from '../utils';
import { body } from 'express-validator';

/* ============================= Hanlder for app users ===================================== */

// User handler to get the currently logged in user.
export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id);

  if (!user) {
    throw new AppError.NotFound('No user found.');
  }

  res.status(StatusCodes.OK).json({ success: true, user });
};

// Handler to update currently logged in user.
export const updateMe = async (req: Request, res: Response) => {
  // Extract fields require from  body object
  const { surname, otherNames, phone, photo, photoPublicId } = req.body;

  //   Update user
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { surname, otherNames, phone, photo, photoPublicId },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new AppError.NotFound('The user you want to update does not exist.');
  }

  res.status(StatusCodes.OK).json({ success: true, user });
};

// Update logged in user password
export const changeMyPassword = async (req: Request, res: Response) => {
  const { currentPassword, password, confirmPassword } = req.body;

  //   Get user
  const user = await User.findById(req.user?._id).select('+password');

  //   Check if user exist
  if (!user) {
    throw new AppError.NotFound('The user you want to update does not exist.');
  }

  //   Check if the current password is correct.
  if (!(await user.correctPassword(currentPassword, user.password))) {
    throw new AppError.Unauthenticated(
      'The current password you provide is incorrect.',
    );
  }

  //   update password.
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordChangedAt = new Date(Date.now() - 1);
  await user.save({ validateBeforeSave: false });

  //   Log out user
  utils.logoutCookies(res);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Password updated. please login again with your new credentials.',
  });
};

/* ============================= Hanlder for app admin ===================================== */

export const getUsers = async (req: Request, res: Response) => {
  const features = new utils.GetRequestAPI(User.find(), req.query)
    .filter()
    .sort()
    .limitDocuments()
    .limitFields()
    .paginate();

  const users = await features.query;

  //   Count all documents
  const documentCount = await User.find().countDocuments();

  //   Setup the pagination
  const page = utils.paginateDetails(documentCount, req);

  res
    .status(StatusCodes.OK)
    .json({ success: true, noHits: users.length, page, users });
};

export const getUser = async (req: Request, res: Response) => {
  const { userRef } = req.params;

  const user = await User.findOne({ userRef });

  if (!user) {
    throw new AppError.NotFound('No resource found for this user.');
  }

  res.status(StatusCodes.OK).json({ success: true, user });
};

export const UpdateUser = async (req: Request, res: Response) => {
  const { surname, otherNames, phone, isActive } = req.body;

  //   Update user
  const user = await User.findOneAndUpdate(
    { userRef: req.params.userRef },
    { surname, otherNames, phone, isActive },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new AppError.NotFound('The user you want to update does not exist.');
  }

  res.status(StatusCodes.OK).json({ success: true, user });
};

// Validate change my password inputs
export const validateChangeMyPassword = utils.checkForErrors([
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password field is required.'),
  body('password').notEmpty().withMessage('New password field is required.'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('confirm password field is required.'),
]);

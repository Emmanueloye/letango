import { NextFunction, Request, Response } from 'express';
import * as utils from '../utils';
import User from '../models/userModel';
import { AppError, StatusCodes } from '../errors';
import { body } from 'express-validator';
import Token from '../models/tokenModel';

// verify signup inputs
export const validateSignup = utils.checkForErrors([
  body('surname').notEmpty().withMessage('Surname field is required.'),
  body('otherNames').notEmpty().withMessage('Other names field is required.'),
  body('email').notEmpty().withMessage('Email field is required.'),
  body('password').notEmpty().withMessage('Password field is required.'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password field is required.'),
]);

// Signup handler
export const signup = async (req: Request, res: Response) => {
  // Get the required data from the body
  const { surname, otherNames, email, password, confirmPassword } = req.body;
  //   Create token
  const [token, hashedToken] = utils.generateToken();

  //   Data for email verification
  const data = {
    name: otherNames?.split(' ')[0],
    email,
    url: `${process.env.BASE_URL}/verify-email?email=${email}&token=${token}`,
  };

  //   Create user
  const newUser = await User.create({
    surname,
    otherNames,
    email,
    password,
    confirmPassword,
    userRef: utils.shortID(10),
    emailVerificationToken: hashedToken,
  });

  //   Send verification email
  try {
    await utils.Email.sendVerificationEmail(data);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Please check your email for your verification email.',
      url: data?.url,
    });
  } catch (error) {
    // If error, delete the created user.
    await User.deleteOne({ _id: newUser._id });
    throw new AppError.BadRequest(
      'Sorry! Something went wrong and we could not send your verification email. Please try and register again.',
    );
  }
};

// Middleware to handle email and token in the query params
export const switchVerifyEmailBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.email) req.body.email = req.query.email;
  if (!req.body.token) req.body.token = req.query.token;
  next();
};

// Verify email handler
export const verifyEmail = async (req: Request, res: Response) => {
  // Get email and token from the request body.
  const { email, token } = req.body;

  // get user with email and token
  const user = await User.findOne({
    email,
    emailVerificationToken: utils.generateToken('hash', token), // hash the plain token coming from the user
  });
  // Check if there is user. If no user throw error
  if (!user) {
    throw new AppError.Unauthenticated(
      'Invalid verification credentials. Please follow the verification link sent to your email.',
    );
  }
  // If user, set verification details and send respond
  user.emailVerificationToken = null;
  user.isVerified = true;
  user.verificationDate = new Date(Date.now());
  await user.save();
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Your email has been verified. Please login.',
  });
};

// Middleware to validate login inputs.
export const validateLogin = utils.checkForErrors([
  body('email').notEmpty().withMessage('Email field is required.'),
  body('password').notEmpty().withMessage('Password field is required.'),
]);

// Login email handler
export const login = async (req: Request, res: Response) => {
  // get email and password from body.
  const { email, password } = req.body;
  // get user with email
  const user = await User.findOne({ email }).select('+password');

  const firstName = user?.otherNames.split(' ').at(0) || '';
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);
  // Check if password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError.Unauthenticated('Invalid email or password.');
  }
  // Check if user email is verified.
  if (!user.isVerified) {
    throw new AppError.Unauthenticated('Please verify your email and login.');
  }

  if (!user.isActive) {
    throw new AppError.Unauthenticated(
      'Your account is not active. Please, contact the app admin.',
    );
  }
  // check if there is existing refresh token
  const existingRefreshToken = await Token.findOne({ user: user._id });

  if (existingRefreshToken) {
    // Check if the existing refresh token is valid.
    if (!existingRefreshToken.isValid) {
      throw new AppError.UnAuthorized(
        'Your access to this app is restricted. Please reach out to the app admin.',
      );
    }

    // Send cookies to user
    utils.sendCookies({
      res,
      token: user._id,
      refresh: existingRefreshToken.token,
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Welcome ${capitalizedFirstName}. You are logged in.`,
    });
    return;
  }

  // Create new refresh token if it does not exist
  const newRefreshToken = await Token.create({
    token: utils.generateToken('plain'),
    user: user._id,
  });

  // Send cookies to user
  utils.sendCookies({ res, token: user._id, refresh: newRefreshToken.token });

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Welcome ${capitalizedFirstName}. You are logged in.`,
  });
};

// Forget password handler
export const forgetPassword = async (req: Request, res: Response) => {
  // get email from the body
  const { email } = req.body;
  if (!email) {
    throw new AppError.BadRequest('Email field is required.');
  }
  // get users using the email
  const user = await User.findOne({ email });
  // if user, set reset details in db and send the reset password link.

  if (user) {
    const [token, hashedToken] = utils.generateToken();
    const data = {
      name: user.otherNames?.split(' ')[0],
      email: user.email,
      url: `${process.env.BASE_URL}/update-password?email=${email}&token=${token}`,
    };
    try {
      // Set reset password details and send reset link
      user.passwordResetToken = hashedToken as string;
      user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();
      // Send reset link
      await utils.Email.sendPasswordResetLink(data);
    } catch (error) {
      // If there is error, unset the details.
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();
      throw new AppError.Unauthenticated(
        'Sorry! We could not send your reset link at the moment. Please try again later.',
      );
    }
  }
  // Irrespective of whether we found a user or not, we want to send the same message to user.
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Please check your email for reset password link.',
  });
};

export const validateResetPassword = utils.checkForErrors([
  body('email').notEmpty().withMessage('Invalid reset password credentials.'),
  body('token').notEmpty().withMessage('Invalid reset password credentials.'),
  body('password').notEmpty().withMessage('Password field is required.'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password field is required.'),
]);

// Reset password handler
export const resetPassword = async (req: Request, res: Response) => {
  // get the email and token
  const { email, token, password, confirmPassword } = req.body;
  // Get user with unexpires password reset token.
  const user = await User.findOne({
    email,
    passwordResetToken: utils.generateToken('hash', token),
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError.Unauthenticated(
      'Invalid reset password credentials, try the process again.',
    );
  }
  // If there is user, reset the password and unset other fields.
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  user.passwordChangedAt = new Date(Date.now() - 1);
  await user.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Password reset successfully. Login with your new credentials.',
  });
};

// Logout handler
export const logout = async (req: Request, res: Response) => {
  // delete the refresh token.
  await Token.deleteOne({});
  // send logout tokens
  utils.logoutCookies(res);
  res.status(StatusCodes.NO_CONTENT).json({ success: true });
};

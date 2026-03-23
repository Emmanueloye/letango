import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import { logoutCookies, sendCookies, verifyJWT } from '../utils';
import { AppError } from '../errors';
import Token from '../models/tokenModel';

// Route protection handler - Authorization
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // get cookies from the request
  const { _letango_acc: accessToken, _letango_ref: refreshToken } =
    req.signedCookies;

  if (!accessToken || !refreshToken) {
    throw new AppError.Unauthenticated('Please login to perform this action.');
  }
  // Check if the cookies exists
  if (accessToken) {
    // Verify the cookies/decode it
    const decode = await verifyJWT(accessToken, res);
    const payload = decode as any;

    // Get current user and existing refresh token
    const currentUser = await User.findById(payload.id);
    const existingRefreshToken = await Token.findOne({ user: payload.id });

    if (!currentUser) {
      logoutCookies(res);
      throw new AppError.Unauthenticated(
        'User with the credentials no longer exist.',
      );
    }

    // Check if user is active.
    if (!currentUser.isActive) {
      logoutCookies(res);
      throw new AppError.UnAuthorized(
        'Your account is not active. Please contact the app admin.',
      );
    }

    // Check if refresh token still valid.
    if (existingRefreshToken && !existingRefreshToken.isValid) {
      logoutCookies(res);
      throw new AppError.UnAuthorized(
        'You have been restricted to access this app. Please contact the app admin.',
      );
    }

    // Detect password change
    if (await currentUser.detectPasswordChange(payload.iat)) {
      logoutCookies(res);
      throw new AppError.Unauthenticated(
        'Password change detected. Please log in again.',
      );
    }
    // Send cookies back to user.
    sendCookies({
      res,
      token: payload.id,
      refresh: existingRefreshToken!.token,
    });
    req.user = currentUser;

    return next();
  }

  // If no access token, this allow refresh token to generate fresh access & refresh tokens for users after all verification.
  const decode = await verifyJWT(refreshToken, res);
  const payload = decode as any;

  const currentUser = await User.findById(payload.id);
  const existingRefreshToken = await Token.findOne({ user: payload.id });

  if (!currentUser) {
    logoutCookies(res);
    throw new AppError.Unauthenticated(
      'User with the credentials no longer exist.',
    );
  }

  // Check if user is active.
  if (!currentUser.isActive) {
    logoutCookies(res);
    throw new AppError.UnAuthorized(
      'Your account is not active. Please contact the app admin.',
    );
  }

  // Check if refresh token still valid.
  if (existingRefreshToken && !existingRefreshToken.isValid) {
    logoutCookies(res);
    throw new AppError.UnAuthorized(
      'You have been restricted to access this app. Please contact the app admin.',
    );
  }

  if (await currentUser.detectPasswordChange(payload.iat)) {
    logoutCookies(res);
    throw new AppError.Unauthenticated(
      'Password change detected. Please log in again.',
    );
  }

  sendCookies({
    res,
    token: currentUser.id,
    refresh: existingRefreshToken!.token,
  });

  // Attached currently logged in user to request object.
  req.user = currentUser;

  next();
};

// To check user roles - Permission
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role)) {
      throw new AppError.UnAuthorized(
        'You are not permitted to access this resource.',
      );
    }
    next();
  };
};

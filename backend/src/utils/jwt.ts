import jwt from 'jsonwebtoken';
import { AppError } from '../errors';
import { Response } from 'express';
import { Types } from 'mongoose';

type AccessToken = { id: Types.ObjectId };
type RefreshToken = {
  id: Types.ObjectId;
  refresh: string;
};

export type JWTPayload = AccessToken | RefreshToken;

type Token = {
  res: Response;
  token: Types.ObjectId;
  refresh: string;
};

/**
 * Create JWT cookie
 * @param payload Object that accepts {id: Types.ObjectId} | { id: Types.ObjectId; refresh: string }
 * @returns jwt cookie
 */
export const createJWT = (payload: JWTPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string);
};

/**
 * Verify jwt cookies.
 * @param token string
 * @param res : mainly to log out user incase there is an error.
 */
export const verifyJWT = async (token: string, res: Response) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    logoutCookies(res);
    throw new AppError.Unauthenticated('Invalid authentication credentials.');
  }
};

/**
 * Send logout cookies on logout. It mainly send an empty cookies.
 * @param res Response
 */
export const logoutCookies = (res: Response) => {
  res.cookie('_letango_acc', '', {
    maxAge: 1,
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  res.cookie('_letango_ref', '', {
    maxAge: 1,
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
};

/**
 * Send cookies - access and refresh token to the users on login.
 * @param param0 Object {res, token and refresh}
 */
export const sendCookies = ({ res, token, refresh }: Token) => {
  // Create access and refresh token
  const accessToken = createJWT({ id: token });
  const refreshToken = createJWT({ id: token, refresh });

  res.cookie('_letango_acc', accessToken, {
    maxAge: Number(process.env.ACCESS_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000,
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  res.cookie('_letango_ref', refreshToken, {
    maxAge: Number(process.env.REFRESH_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000,
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
};

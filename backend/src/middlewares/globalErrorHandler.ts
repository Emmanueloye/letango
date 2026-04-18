import { NextFunction, Request, Response } from 'express';
import { AppError, StatusCodes } from '../errors';

const sendDevError = (res: Response, err: any) => {
  res
    .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ err, stack: err.stack });
};

const sendProdError = (res: Response, err: any) => {
  if (err.isOperational) {
    res
      .status(err.statusCode)
      .json({ success: false, status: err.status, message: err.message });
  } else {
    console.log('Error 🔥🔥🔥', err.message);

    console.log(err?.stack);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      status: err.status,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err };

  // Handle validationError
  if (err.name === 'ValidationError') {
    const msg = Object.values(error.errors)
      .map((val: any) => val.message)
      .join(' ');
    error = { ...new AppError.BadRequest(msg) };
  }

  // Handle duplicate error
  if (err.code === 11000) {
    const valueExtract = Object.keys(err.keyValue)[0];
    const value =
      valueExtract?.charAt(0).toUpperCase() + valueExtract!.slice(1);
    error = {
      ...new AppError.BadRequest(
        `${value} already exist, please choose another ${value.toLowerCase()}.`,
      ),
    };
  }

  // sendDevError(res, err);
  sendProdError(res, error);
};

export default globalErrorHandler;

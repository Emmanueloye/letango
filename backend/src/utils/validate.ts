import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors';
import { validationResult, param } from 'express-validator';
import { Types } from 'mongoose';

export const checkForErrors = (validatedInputs: any, errCode = 400) => {
  return [
    validatedInputs,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errMsg = errors
          .array()
          .map((val) => val.msg)
          .join('. ');

        throw new AppError.BadRequest(errMsg);
      }
      next();
    },
  ];
};

export const validateParams = checkForErrors([
  param('id')
    .custom((value: Types.ObjectId) => Types.ObjectId.isValid(value))
    .withMessage('No page found for the requested id'),
]);

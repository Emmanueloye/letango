import { Request, Response } from 'express';
import { AppError } from '../errors';

const notFoundMiddleware = async (req: Request, res: Response) => {
  throw new AppError.NotFound('Oop!!! Page not found.');
};

export default notFoundMiddleware;

import StatusCodes from './statusCodes';

// Bad request error handler
export class BadRequest extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  success: boolean;
  message: string;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BADREQUEST;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.success = false;
    this.message = message;
  }
}

// Notfound error handler
export class NotFound extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  success: boolean;
  message: string;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOTFOUND;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.success = false;
    this.message = message;
  }
}

// Unauthenticated error handler
export class Unauthenticated extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  success: boolean;
  message: string;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.success = false;
    this.message = message;
  }
}

// Unauthorized error handler
export class UnAuthorized extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  success: false;
  message: string;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.success = false;
    this.message = message;
  }
}

// Too many request handler
export class TooManyRequests extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  success: boolean;
  message: string;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.TO_MANY_REQUEST;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.success = false;
    this.message = message;
  }
}

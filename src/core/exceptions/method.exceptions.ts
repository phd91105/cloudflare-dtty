import {
  HttpStatus,
  type ExceptionHandler,
  type RouterResponse,
} from 'cloudflare-dtty';

export class ErrorHandler implements ExceptionHandler {
  handle(error: Error): RouterResponse | Promise<RouterResponse> {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (error instanceof NotFound) {
      status = HttpStatus.NOT_FOUND;
    }
    if (error instanceof BadRequest) {
      status = HttpStatus.BAD_REQUEST;
    }
    if (error instanceof Unauthorized) {
      status = HttpStatus.UNAUTHORIZED;
    }

    return {
      status,
      data: {
        code: status,
        error: error.message ?? 'Unknown Error.',
      },
    };
  }
}

export class NotFound extends Error {
  constructor(message = 'Not found.') {
    super(message);
    this.name = 'NotFound';
  }
}

export class Unauthorized extends Error {
  constructor(message = 'Unauthorized.') {
    super(message);
    this.name = 'Unauthorized';
  }
}

export class BadRequest extends Error {
  constructor(message = 'Bad Request.') {
    super(message);
    this.name = 'BadRequest';
  }
}

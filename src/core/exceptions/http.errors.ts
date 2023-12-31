export class NotFound extends Error {
  constructor(message = 'Not found.') {
    super(message);
  }
}

export class Unauthorized extends Error {
  constructor(message = 'Unauthorized.') {
    super(message);
  }
}

export class BadRequest extends Error {
  constructor(message = 'Bad Request.') {
    super(message);
  }
}

export class Forbidden extends Error {
  constructor(message = 'Forbidden.') {
    super(message);
  }
}

export class InternalServerError extends Error {
  constructor(message = 'Internal Server Error.') {
    super(message);
  }
}

export class NotImplemented extends Error {
  constructor(message = 'Not Implemented.') {
    super(message);
  }
}

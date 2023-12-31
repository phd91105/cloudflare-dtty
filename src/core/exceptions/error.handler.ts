import {
  HttpStatus,
  type ExceptionHandler,
  type RouterResponse,
} from 'cloudflare-dtty';
import {
  BadRequest,
  Forbidden,
  NotFound,
  NotImplemented,
  Unauthorized,
} from './http.errors';

export class ErrorHandler implements ExceptionHandler {
  handle(error: Error): RouterResponse | Promise<RouterResponse> {
    const status: HttpStatus = this.getErrorStatus(error);
    return {
      status,
      data: {
        code: status,
        error: error.message ?? 'Unknown Error',
      },
    };
  }

  private getErrorStatus(error: Error): HttpStatus {
    if (error instanceof NotFound) return HttpStatus.NOT_FOUND;
    if (error instanceof BadRequest) return HttpStatus.BAD_REQUEST;
    if (error instanceof Unauthorized) return HttpStatus.UNAUTHORIZED;
    if (error instanceof Forbidden) return HttpStatus.FORBIDDEN;
    if (error instanceof NotImplemented) return HttpStatus.NOT_IMPLEMENTED;

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

import type { DttyMiddleware, DttyRequest } from 'cloudflare-dtty';
import { Unauthorized } from 'core/exceptions';

export class AuthGuard implements DttyMiddleware {
  apply(req: DttyRequest): void | Promise<void> {
    if (!req.headers.get('authorization')) {
      throw new Unauthorized();
    }
  }
}

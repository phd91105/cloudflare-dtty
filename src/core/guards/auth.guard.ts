import jwt from '@tsndr/cloudflare-worker-jwt';
import {
  Inject,
  Injectable,
  type DttyMiddleware,
  type DttyRequest,
} from 'cloudflare-dtty';
import { Unauthorized } from 'core/exceptions';
import { Environment } from 'core/providers';
import _ from 'lodash';

@Injectable()
export class AuthGuard implements DttyMiddleware {
  constructor(@Inject(Environment) private env: Env) {}

  async apply(req: DttyRequest) {
    const authorization = req.headers.get('authorization');
    const [scheme, token] = _.split(_.trim(authorization), /\s/);
    if (scheme !== 'Bearer' || !authorization || !token)
      throw new Unauthorized();

    const isValid = await jwt.verify(token, this.env.JWT_SECRET);
    if (!isValid) throw new Unauthorized();
  }
}

import {
  Inject,
  Injectable,
  type DttyMiddleware,
  type DttyRequest,
} from 'cloudflare-dtty';
import { Unauthorized } from 'core/exceptions';
import { Environment } from 'core/providers';
import { verifyKey } from 'discord-interactions';

@Injectable()
export class VerifyBotRequest implements DttyMiddleware {
  constructor(@Inject(Environment) private env: Env) {}

  apply(req: DttyRequest) {
    const signature = req.headers.get('x-signature-ed25519');
    const timestamp = req.headers.get('x-signature-timestamp');

    const isValidRequest = verifyKey(
      JSON.stringify(req.rawBody),
      signature,
      timestamp,
      this.env.DISCORD_PUBLIC_KEY,
    );

    if (!isValidRequest) {
      throw new Unauthorized();
    }
  }
}

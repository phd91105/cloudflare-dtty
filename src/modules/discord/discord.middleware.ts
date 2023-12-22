import {
  Inject,
  Injectable,
  WORKER,
  type DttyMiddleware,
  type DttyRequest,
} from 'cloudflare-dtty';
import { Unauthorized } from 'core/exceptions';
import { verifyKey } from 'discord-interactions';

@Injectable()
export class VerifyBotRequest implements DttyMiddleware {
  constructor(@Inject(WORKER) private worker: Worker) {}

  apply(req: DttyRequest): void | Promise<void> {
    const signature = req.headers.get('x-signature-ed25519');
    const timestamp = req.headers.get('x-signature-timestamp');

    const isValidRequest =
      signature &&
      timestamp &&
      verifyKey(
        JSON.stringify(req.rawBody),
        signature,
        timestamp,
        this.worker.env.DISCORD_PUBLIC_KEY,
      );

    if (!isValidRequest) {
      throw new Unauthorized();
    }
  }
}

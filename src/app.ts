import { Dtty } from 'cloudflare-dtty';
import { ErrorHandler } from 'core/exceptions';
import { AssetController } from 'modules/asset';
import { AuthController } from 'modules/auth';
import { DiscordController } from 'modules/discord';

export class App {
  constructor(private app = new Dtty()) {
    this.app.enableCors();
    this.app.setGlobalExceptionHandlers(ErrorHandler);
    this.app.registerControllers(
      AssetController,
      AuthController,
      DiscordController,
    );
  }

  handle(request: Request, env: Env, context: ExecutionContext) {
    return this.app.handle(request, env, context);
  }
}

export default new App();

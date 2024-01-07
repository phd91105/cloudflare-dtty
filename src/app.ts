import { ErrorHandler } from 'core/exceptions';
import { Dtty } from 'dtty-extra';
import { AuthController } from 'modules/auth';
import { DiscordBotController } from 'modules/discord';
import { FilmController } from 'modules/film';

export class App {
  constructor(private app = new Dtty()) {
    this.app.enableCors();
    this.app.setGlobalExceptionHandlers(ErrorHandler);
    this.app.registerControllers(
      AuthController,
      DiscordBotController,
      FilmController,
    );
  }

  handle(request: Request, env: Env, context: ExecutionContext) {
    return this.app.handle(request, env, context);
  }
}

export default new App();

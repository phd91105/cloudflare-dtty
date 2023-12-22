import { Dtty, type Env } from 'cloudflare-dtty';
import { IndexController } from 'core/controllers/common.controller';
import { FshareController } from 'modules/fshare/fshare.module';

export class App {
  constructor(
    private readonly request: Request,
    private readonly env: Env,
    private readonly context: ExecutionContext,
    private readonly app = new Dtty(),
  ) {
    this.app.registerControllers(IndexController, FshareController);
  }

  handle() {
    return this.app.handle(this.request, this.env, this.context);
  }
}

export default App;

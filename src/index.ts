import App from 'app';
import type { Env } from 'cloudflare-dtty';

export default {
  fetch(request: Request, env: Env, context: ExecutionContext) {
    const app = new App(request, env, context);

    return app.handle();
  },
};

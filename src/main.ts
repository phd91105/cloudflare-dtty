import app from 'app';

export default {
  fetch(request: Request, env: Env, context: ExecutionContext) {
    return app.handle(request, env, context);
  },
};

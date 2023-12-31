import { Inject, Injectable, WORKER } from 'cloudflare-dtty';

@Injectable()
export class Context implements ExecutionContext {
  constructor(@Inject(WORKER) private worker: Worker) {}

  waitUntil(promise: Promise<unknown>) {
    return this.worker.context.waitUntil(promise);
  }

  passThroughOnException() {
    return this.worker.context.passThroughOnException();
  }
}

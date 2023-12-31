import { Inject, Injectable, WORKER } from 'cloudflare-dtty';
import _ from 'lodash';

@Injectable()
export class Environment {
  constructor(@Inject(WORKER) private worker: Worker) {
    return new Proxy(this, {
      get: (target, prop) => {
        try {
          if (!_.isString(prop)) return undefined;
          return target.worker.env[prop];
        } catch {
          return undefined;
        }
      },
    });
  }
}

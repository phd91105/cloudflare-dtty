import { Inject, Injectable, WORKER } from 'cloudflare-dtty';
import isString from 'lodash/isString';

@Injectable()
export class Storage {
  constructor(@Inject(WORKER) private worker: { env: KV }) {
    return new Proxy(this, {
      get: (target, prop, receiver) => {
        if (!isString(prop)) return Reflect.get(target, prop, receiver);

        return {
          get: async (key: string) => {
            const value = await this.worker.env[prop].get(key);
            try {
              return JSON.parse(value);
            } catch {
              return value;
            }
          },
          put: async (key: string, value: string | AnyObject) => {
            try {
              await this.worker.env[prop].put(key, JSON.stringify(value));
              return value;
            } catch (error) {
              throw error;
            }
          },
          delete: async (key: string) => {
            try {
              await this.worker.env[prop].delete(key);
              return;
            } catch (error) {
              throw error;
            }
          },
        };
      },
    });
  }
}

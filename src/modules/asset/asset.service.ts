import { getAssetFromKV, NotFoundError } from '@cloudflare/kv-asset-handler';
import { Inject, Injectable, WORKER, type DttyRequest } from 'cloudflare-dtty';
import { NotFound } from 'core/exceptions';

@Injectable()
export class AssetService {
  constructor(@Inject(WORKER) private worker: Worker) {}

  async getFileFromKV(request: DttyRequest) {
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: this.worker.context.waitUntil.bind(this.worker.context),
        },
        {
          ASSET_NAMESPACE: this.worker.env.__STATIC_CONTENT,
        },
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFound();
      }

      throw new Error();
    }
  }
}

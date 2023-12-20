import { Inject, Injectable, WORKER, Worker } from 'cloudflare-dtty';
import { Fetcher } from 'core/providers/fetcher.provider';

@Injectable()
export class FshareService {
  constructor(
    @Inject(Fetcher)
    private readonly fetcher: Fetcher,

    @Inject(WORKER)
    private readonly worker: Worker,
  ) {}

  get() {
    return this.fetcher.get(
      'https://657ff67f6ae0629a3f53ff0a.mockapi.io/api/images',
    );
  }
}

import { Inject, Injectable, WORKER, Worker } from 'cloudflare-dtty';
import { commonHeaders } from 'core/constants/common.contants';
import { Fetcher } from 'core/providers/fetcher.provider';
import { constructURLWithParams } from 'core/utils/string.utils';
import {
  FS_ENV,
  SESSION_KEY,
  TOKEN_KEY,
  baseURL,
  fshareApiUrl,
  getFolderURL,
} from 'modules/fshare/fshare.contants';
import { FshareAuthResponse, FshareFileResponse } from './fshare.interface';
import { FshareFile, FshareFolder } from './fshare.validators';

@Injectable()
export class FshareService {
  constructor(
    @Inject(Fetcher)
    private readonly fetcher: Fetcher,

    @Inject(WORKER)
    private readonly worker: Worker,
  ) {}

  /**
   * Perform a login operation to FShare.
   */
  async login() {
    const fshareEnv = await this.worker.env.FS.get(FS_ENV);
    const fshareEnvJson = JSON.parse(fshareEnv);

    const data = await this.fetcher.post<FshareAuthResponse>(
      baseURL + fshareApiUrl.login,
      {
        user_email: fshareEnvJson.EMAIL,
        password: fshareEnvJson.PASSWORD,
        app_key: fshareEnvJson.APP_KEY,
      },
      {
        headers: commonHeaders(fshareEnvJson.USER_AGENT),
      },
    );

    await Promise.all([
      this.worker.env.FS.put(TOKEN_KEY, data.token),
      this.worker.env.FS.put(SESSION_KEY, data.session_id),
    ]);

    return data;
  }

  /**
   * Refresh the FShare access token.
   */
  async refreshToken() {
    const [token, fshareEnv] = await Promise.all([
      this.worker.env.FS.get(TOKEN_KEY),
      this.worker.env.FS.get(FS_ENV),
    ]);

    const fshareEnvJson = JSON.parse(fshareEnv);

    const data = await this.fetcher.post<FshareAuthResponse>(
      baseURL + fshareApiUrl.refreshToken,
      {
        token,
        app_key: fshareEnvJson.APP_KEY,
      },
      {
        headers: commonHeaders(fshareEnvJson.USER_AGENT),
      },
    );

    await Promise.all([
      this.worker.env.FS.put(TOKEN_KEY, data.token),
      this.worker.env.FS.put(SESSION_KEY, data.session_id),
    ]);

    return data;
  }

  /**
   * Get a download link for a file from FShare.
   */
  async getLink(file: FshareFile) {
    const [token, sessionId] = await Promise.all([
      this.worker.env.FS.get(TOKEN_KEY),
      this.worker.env.FS.get(SESSION_KEY),
    ]);

    return this.fetcher.post<FshareFileResponse>(
      baseURL + fshareApiUrl.download,
      { ...file, token, zipflag: 0 },
      {
        headers: {
          ...commonHeaders(),
          Cookie: `session_id=${sessionId}`,
        },
      },
    );
  }

  /**
   * Get information about a folder from FShare.
   */
  async getFolder(folder: FshareFolder) {
    const url = constructURLWithParams(
      `${getFolderURL}${fshareApiUrl.getFolder}`,
      {
        linkcode: folder.code,
        sort: 'type,name',
      },
    );

    return this.fetcher.get(url, {
      headers: { ...commonHeaders() },
    });
  }
}

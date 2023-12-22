import { Injectable } from 'cloudflare-dtty';

@Injectable()
export class Fetcher {
  private async request<T>(
    url: string,
    options: RequestInit = {},
    resType: 'text' | 'json' = 'json',
  ): Promise<T> {
    try {
      const response = await fetch(`${url}`, options);

      return response[resType]() as Promise<T>;
    } catch (error) {
      throw error;
    }
  }

  get<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  post<T>(url: string, body: unknown, options: RequestInit = {}): Promise<T> {
    const defaultOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return this.request<T>(url, { ...defaultOptions, ...options });
  }
}

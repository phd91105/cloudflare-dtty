import { Injectable } from 'cloudflare-dtty';

@Injectable()
export class HttpRequest {
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

  get<T>(
    url: string,
    options: RequestInit = {},
    resType: 'text' | 'json' = 'json',
  ): Promise<T> {
    return this.request<T>(url, { ...options, method: 'get' }, resType);
  }

  post<T>(url: string, body: unknown, options: RequestInit = {}): Promise<T> {
    const defaultOptions = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return this.request<T>(url, { ...defaultOptions, ...options });
  }

  put<T>(url: string, body: unknown, options: RequestInit = {}): Promise<T> {
    const defaultOptions = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return this.request<T>(url, { ...defaultOptions, ...options });
  }

  patch<T>(url: string, body: unknown, options: RequestInit = {}): Promise<T> {
    const defaultOptions = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return this.request<T>(url, { ...defaultOptions, ...options });
  }

  delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    const defaultOptions = {
      method: 'delete',
    };
    return this.request<T>(url, { ...defaultOptions, ...options });
  }
}

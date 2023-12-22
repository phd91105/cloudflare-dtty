import { Inject, Injectable } from 'cloudflare-dtty';
import { HttpRequest } from 'core/providers/request.provider';
import { Storage } from 'core/providers/storage.provider';
import type { SignInDto, SignUpDto } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Storage) private storage: KV,
    @Inject(HttpRequest) private http: HttpRequest,
  ) {}

  regsiter(body: SignUpDto) {
    return body;
  }

  login(body: SignInDto) {
    return body;
  }
}

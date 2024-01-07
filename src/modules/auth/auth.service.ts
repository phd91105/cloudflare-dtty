import jwt from '@tsndr/cloudflare-worker-jwt';
import QB from 'common/queryBuilder';
import { NotFound } from 'core/exceptions';
import { Context, Environment } from 'core/providers';
import { Inject, Injectable } from 'dtty-extra';
import type { SignInDto, SignUpDto } from './auth.model';
import type { User } from './user.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Environment) private storage: KV,
    @Inject(Environment) private env: Env,
    @Inject(Environment) private db: D1,
    @Inject(Context) private context: Context,
  ) {}

  async regsiter(body: SignUpDto) {
    return body;
  }

  async login(body: SignInDto) {
    const user = await this.db.dtty
      .prepare(
        QB.buildSelectQuery({
          col: 'id, name, email',
          table: 'user',
          where: 'email = ?',
        }),
      )
      .bind(body.email)
      .first<User>();

    if (!user) throw new NotFound('User not found.');
    const accessToken = await jwt.sign(user, this.env.JWT_SECRET);
    const refreshToken = crypto.randomUUID();

    this.context.waitUntil(
      this.storage.auth.put(refreshToken, user.id, {
        expirationTtl: 60 * 60 * 24 * 1,
      }),
    );

    return { accessToken, refreshToken };
  }
}

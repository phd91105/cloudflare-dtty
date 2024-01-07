import { Body, Controller, Inject, Post } from 'dtty-extra';
import { SignInDto, SignUpDto } from './auth.model';
import { AuthService } from './auth.service';

@Controller('/v1/api')
export class AuthController {
  constructor(@Inject(AuthService) private service: AuthService) {}

  @Post('/register')
  signUp(@Body(SignUpDto) user: SignUpDto) {
    return this.service.regsiter(user);
  }

  @Post('/login')
  signIn(@Body(SignInDto) user: SignInDto) {
    return this.service.login(user);
  }
}

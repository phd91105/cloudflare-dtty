import { Controller, Get } from 'cloudflare-dtty';

@Controller('/')
export class IndexController {
  @Get('/')
  index() {
    return { hello: 'world' };
  }
}

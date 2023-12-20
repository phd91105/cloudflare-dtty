import { Controller, Get, Inject } from 'cloudflare-dtty';
import { FshareService } from './fshare.service';

@Controller('/post')
export class PostController {
  constructor(
    @Inject(FshareService)
    private readonly fshareService: FshareService,
  ) {}

  @Get('/')
  handleGet() {
    return this.fshareService.get();
  }
}

import { Body, Controller, Get, Inject, Post } from 'cloudflare-dtty';
import { FshareService } from './fshare.service';
import { FshareFile, FshareFolder } from './fshare.validators';

@Controller('/fshare')
export class FshareController {
  constructor(
    @Inject(FshareService)
    private readonly fshareService: FshareService,
  ) {}

  @Get('/login')
  login() {
    return this.fshareService.login();
  }

  @Get('/refreshToken')
  refreshToken() {
    return this.fshareService.refreshToken();
  }

  @Post('/getFile')
  getFileFshare(@Body(FshareFile) body: FshareFile) {
    return this.fshareService.getLink(body);
  }

  @Post('/getFolder')
  getFolderFshare(@Body(FshareFolder) body: FshareFolder) {
    return this.fshareService.getFolder(body);
  }
}

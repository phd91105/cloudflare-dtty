import {
  Controller,
  Get,
  Inject,
  Request,
  type DttyRequest,
} from 'cloudflare-dtty';
import { AssetService } from './asset.service';

@Controller('/*')
export class AssetController {
  constructor(@Inject(AssetService) private service: AssetService) {}

  @Get()
  getAsset(@Request() request: DttyRequest) {
    return this.service.getFileFromKV(request);
  }
}

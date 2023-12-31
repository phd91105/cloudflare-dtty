import {
  ApplyMiddleware,
  Body,
  Controller,
  Inject,
  Post,
} from 'cloudflare-dtty';
import { AuthGuard } from 'core/guards';
import { FilmService } from './film.service';
import { FilmSearchDto } from './models/film.model';

@Controller('/v1/api')
@ApplyMiddleware(AuthGuard)
export class FilmController {
  constructor(@Inject(FilmService) private service: FilmService) {}

  @Post('/films')
  filmSearch(@Body(FilmSearchDto) body: FilmSearchDto) {
    return this.service.search(body);
  }
}

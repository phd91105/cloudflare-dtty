import { AuthGuard } from 'core/guards';
import { ApplyMiddleware, Body, Controller, Inject, Post } from 'dtty-extra';
import { FilmSearchDto } from './film.model';
import { FilmService } from './film.service';

@Controller('/v1/api')
@ApplyMiddleware(AuthGuard)
export class FilmController {
  constructor(@Inject(FilmService) private service: FilmService) {}

  @Post('/films')
  filmSearch(@Body(FilmSearchDto) body: FilmSearchDto) {
    return this.service.search(body);
  }
}

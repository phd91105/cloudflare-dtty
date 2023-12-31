import { Inject, Injectable } from 'cloudflare-dtty';
import { StringUtils } from 'common/utils';
import { HttpRequest } from 'core/providers';
import { thuvienhdUrl } from './film.constant';
import { FilmRepo } from './film.repo';
import type { FilmResponse } from './models/film.interface';
import type { FilmSearchDto } from './models/film.model';

@Injectable()
export class FilmService {
  constructor(
    @Inject(FilmRepo) private repo: FilmRepo,
    @Inject(HttpRequest) private http: HttpRequest,
  ) {}

  async search(body: FilmSearchDto) {
    const cleanedKeyword = StringUtils.removeDiacritics(body.filmName);
    const dbData = await this.repo.findAll(cleanedKeyword);
    if (dbData) return dbData;

    const filmResponse = await this.http.get<FilmResponse>(
      thuvienhdUrl(body.filmName),
    );
    if (filmResponse.data) {
      await this.repo.bulkCreate(filmResponse, cleanedKeyword);
    }

    return filmResponse;
  }
}

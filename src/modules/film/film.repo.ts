import QB from 'common/queryBuilder';
import { StringUtils } from 'common/utils';
import { Environment } from 'core/providers';
import { Inject, Injectable } from 'dtty-extra';
import _ from 'lodash';
import { NEED_REFRESH, SUCCESS } from './film.constant';
import type { FilmResponse } from './film.interface';

@Injectable()
export class FilmRepo {
  constructor(@Inject(Environment) private db: D1) {}

  async findAll(cleanKeyword: string) {
    const { results: films } = await this.db.film
      .prepare(
        QB.buildSelectQuery({
          col: '*',
          table: 'film',
          where: 'search_text LIKE ?',
        }),
      )
      .bind(`%${cleanKeyword}%`)
      .all();

    const oldKey = _.map(films, ({ search_text }) =>
      String(search_text).split('__').pop(),
    );

    const needRefresh = _.some(
      oldKey,
      (value) => value.length > cleanKeyword.length && cleanKeyword.length > 4,
    );

    if (!films.length) return null;

    const filmIds = _.map(films, 'id');
    const { results: filmDetail } = await this.db.film
      .prepare(
        QB.buildSelectQuery({
          col: '*',
          distinct: true,
          table: 'film_detail',
          where: `film_id IN (${filmIds})`,
        }),
      )
      .all();

    const data = _.map(films, (film) => {
      return {
        ...film,
        links: _.filter(filmDetail, (item) => item.film_id === film.id),
      };
    });

    return { status: needRefresh ? NEED_REFRESH : SUCCESS, data };
  }

  async bulkCreate(filmResponse: FilmResponse, cleanKeyword: string) {
    const { values, detailValues } = this.processInsertValues(
      filmResponse,
      cleanKeyword,
    );

    await Promise.all([
      this.db.film.exec(
        QB.buildInsertOrUpdateQuery({
          table: 'film',
          cols: ['id', 'image', 'title', 'search_text'],
          values,
        }),
      ),
      this.db.film.exec(
        QB.buildInsertOrUpdateQuery({
          table: 'film_detail',
          cols: ['film_id', 'title', 'link'],
          values: detailValues,
        }),
      ),
    ]);
  }

  private processInsertValues = (
    filmResponse: FilmResponse,
    cleanKeyword: string,
  ) => {
    const values = _.join(
      _.map(
        filmResponse.data,
        ({ id, image, title }) =>
          `('${id}', '${image}', '${StringUtils.removeQuote(
            title,
          )}', '${StringUtils.removeDiacritics(title)}__${cleanKeyword}')`,
      ),
      ',',
    );

    const filmDetails = _.flatten(
      _.map(filmResponse.data, ({ links, id }) =>
        _.map(links, ({ title, link }) => ({ title, link, film_id: id })),
      ),
    );

    const detailValues = _.join(
      _.map(
        filmDetails,
        ({ film_id, link, title }) =>
          `(${film_id}, '${StringUtils.removeQuote(title)}', '${link}')`,
      ),
      ',',
    );

    return { values, detailValues };
  };
}

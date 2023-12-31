import { URIUtils } from 'common/utils';

export const NEED_REFRESH = 'NEED_REFRESH';
export const SUCCESS = 'SUCCESS';
export const searchFilmURL = 'https://thuvienhd.com';

export const thuvienhdUrl = (keyword: string) =>
  URIUtils.constructURLWithParams(searchFilmURL, {
    feed: 'timfsharejson',
    search: encodeURIComponent(keyword),
  });

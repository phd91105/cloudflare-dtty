import isNil from 'lodash/isNil';

/**
 * Remove accents from Vietnamese characters
 */
export const removeDiacritics = (str: string) => {
  str = str.toLowerCase();
  str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
  str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
  str = str.replace(/[ìíịỉĩ]/g, 'i');
  str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
  str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
  str = str.replace(/[ỳýỵỷỹ]/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\s/g, '');
  str = str.replace(/'/g, '');

  return str;
};

/**
 * Remove single quote from string
 */
export const removeQuote = (str: string) => str.replace(/'/g, '');

/**
 * determineContentType
 */
export const determineContentType = (path: string) => {
  if (path.endsWith('.css')) {
    return 'text/css';
  } else if (path.endsWith('.js')) {
    return 'application/javascript';
  } else if (path.endsWith('.html')) {
    return 'text/html';
  } else if (path.endsWith('.svg')) {
    return 'image/svg+xml';
  } else if (path.endsWith('.zip')) {
    return 'application/zip';
  } else if (path.endsWith('_gen.png')) {
    return 'image/png';
  } else if (path.endsWith('.ico')) {
    return 'image/vnd.microsoft.icon';
  }
  // Add more content types as needed
  return 'text/plain';
};

/**
 * Base64Utils
 */
export class Base64Utils {
  static bufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  static base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });
    return blob;
  }
}

/**
 * getCurrentDateTime
 */
export const getCurrentDateTime = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const msSeconds = String(now.getMilliseconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}${msSeconds}`;
};

/**
 * truncateUtf8
 */
export const truncateUtf8 = (str: string, n: number) => {
  let l = 0;
  let r = '';
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (
      (c >= 0x0 && c < 0x81) ||
      c === 0xf8f0 ||
      (c >= 0xff61 && c < 0xffa0) ||
      (c >= 0xf8f1 && c < 0xf8f4)
    ) {
      l += 1;
    } else {
      l += 2;
    }
    if (l <= n) {
      r = r.concat(str[i]);
    }
  }
  return r;
};

/**
 * truncate2byte
 */
export const truncate2byte = (s: string, n: number) => {
  if (!isNil(s)) {
    const r = truncateUtf8(s.toString(), n);

    if (r.length !== s.toString().length) {
      return `${r}...`;
    } else {
      return r;
    }
  }

  return s;
};

/**
 * findMinMaxDates
 */
export function findMinMaxDates(dates: string[]) {
  const parseDate = (dateStr: string) => {
    const [datePart, timePart] = dateStr.split(' ');
    const [month, day, year] = datePart.split('/').map(Number);
    let hours = 0,
      minutes = 0;

    if (timePart) {
      const [time, ampm] = timePart.split(' ');
      [hours, minutes] = time.split(':').map(Number);
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }

    return new Date(Date.UTC(year, month - 1, day, hours, minutes));
  };

  let minDate = parseDate(dates[0]);
  let maxDate = parseDate(dates[0]);

  dates.forEach((dateStr) => {
    const date = parseDate(dateStr);
    if (date < minDate) {
      minDate = date;
    }
    if (date > maxDate) {
      maxDate = date;
    }
  });

  return {
    minDate: minDate.toISOString().split('T')[0] + 'T00:00:00Z',
    maxDate: maxDate.toISOString().split('T')[0] + 'T23:59:59Z',
  };
}

/**
 * Constructs a URL with query parameters.
 */
export const constructURLWithParams = (
  baseUrl: string,
  params: { [key: string]: string | number },
) => {
  const url = new URL(baseUrl);
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      url.searchParams.set(key, String(params[key]));
    }
  });
  return url.toString();
};

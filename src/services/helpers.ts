import QueryString from 'querystring';

export function withQuery(url: string, query: any) {
  let newUrl = String(url);

  if (query && !Array.isArray(query) && Object.keys(query).length) {
    if (newUrl.indexOf('?') !== -1) {
      newUrl += '&';
    } else {
      newUrl += '?';
    }
    newUrl += QueryString.stringify(query);
  }
  return newUrl;
}

export const commonHeaders = (
  ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
) => ({
  'content-type': 'application/json; charset=utf-8',
  'user-agent': ua,
});

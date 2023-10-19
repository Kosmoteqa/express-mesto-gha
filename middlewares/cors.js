const allowedCors = [
  'localhost:3000',
  'http://mesto-roma.nomoredomainsrocks.ru',
  'http://api.mesto-roma.nomoredomainsrocks.ru',
  'https://mesto-roma.nomoredomainsrocks.ru',
  'https://api.mesto-roma.nomoredomainsrocks.ru',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { origin } = req.headers;

  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  res.header('Access-Control-Allow-Credentials', true);

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};

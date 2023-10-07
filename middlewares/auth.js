const jwt = require('jsonwebtoken');
const { errorUnauthorized } = require('./errorCode');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(res
      .status(errorUnauthorized)
      .send({ message: 'Необходима авторизация' }));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return next(res
      .status(errorUnauthorized)
      .send({ message: 'Необходима авторизация' }));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const router = require('./routes');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const defaultError = require('./errors/defaultError');
const { URLREGEX } = require('./middlewares/validation');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger)
app.use(cors)
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    avatar: Joi.string().regex(URLREGEX),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
}), createUser);
app.use(auth);
app.use(router);
app.use(errorLogger)
app.use(errors());
app.use(defaultError);

app.listen(PORT, () => {
  console.log('app started');
});

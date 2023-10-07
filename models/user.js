const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');
const { URLREGEX } = require('../middlewares/validation');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => URLREGEX.test(v),
      message: 'Не вылидный адрес'
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Не вылидная почта'
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  }
});

module.exports = mongoose.model('user', userSchema);
